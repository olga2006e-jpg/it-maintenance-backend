from datetime import datetime
from typing import Optional

from fastapi import HTTPException, UploadFile
from sqlalchemy import and_, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from models.like import Like
from models.transport import Transport
from models.user import User
from schemas.transport import TransportPublishDto
from services.minio_service import minio_service


class TransportService:

    # ============== GET список опубликованных ==============
    async def list_published(
        self,
        db: AsyncSession,
        user: User,
        search: Optional[str] = None,
        tariff_from: Optional[int] = None,
        tariff_to: Optional[int] = None,
    ) -> list[dict]:
        stmt = select(Transport).where(Transport.status == "published")

        if search:
            stmt = stmt.where(
                or_(
                    Transport.title.ilike(f"%{search}%"),
                    Transport.description.ilike(f"%{search}%"),
                )
            )
        if tariff_from is not None:
            stmt = stmt.where(Transport.price_per_km >= tariff_from)
        if tariff_to is not None:
            stmt = stmt.where(Transport.price_per_km <= tariff_to)

        rows = (await db.execute(stmt)).scalars().all()
        return [self._to_dto(t, user) for t in rows]

    # ============== GET лента ==============
    async def feed(self, db: AsyncSession, user: User) -> list[dict]:
        stmt = (
            select(Transport)
            .where(Transport.status == "published")
            .order_by(Transport.published_at.desc().nullslast())
        )
        rows = (await db.execute(stmt)).scalars().all()
        return [self._to_dto(t, user) for t in rows]

    # ============== GET следующая в ленте (?next=true) ==============
    async def get_next(
        self,
        db: AsyncSession,
        user: User,
        transport_id: int,
    ) -> dict:
        """
        Возвращает следующую опубликованную услугу после transport_id.
        Если transport_id последний — возвращает первую (циклично).
        """
        stmt = (
            select(Transport)
            .where(Transport.status == "published")
            .order_by(
                Transport.published_at.desc().nullslast(),
                Transport.id.desc(),
            )
        )
        rows = (await db.execute(stmt)).scalars().all()
        if not rows:
            raise HTTPException(404, "Лента пуста")

        ids = [t.id for t in rows]
        if transport_id not in ids:
            return self._to_dto(rows[0], user)

        idx = ids.index(transport_id)
        next_idx = (idx + 1) % len(rows)
        return self._to_dto(rows[next_idx], user)

    # ============== GET черновик (не более 1, id не указывается) ==============
    async def get_draft(self, db: AsyncSession, user: User) -> Optional[dict]:
        stmt = select(Transport).where(
            and_(
                Transport.author_id == user.id,
                Transport.status == "draft",
            )
        )
        t = (await db.execute(stmt)).scalar_one_or_none()
        return self._to_dto(t, user) if t else None

    # ============== POST создать черновик + файлы ==============
    async def create_draft(
        self,
        db: AsyncSession,
        user: User,
        title: str,
        image: Optional[UploadFile],
        video: Optional[UploadFile],
    ) -> dict:
        # У пользователя может быть только один черновик
        existing = await self.get_draft(db, user)
        if existing:
            raise HTTPException(400, "У пользователя уже есть черновик")

        image_name = ""
        video_name = ""

        if image is not None and image.filename:
            data = await image.read()
            ext = image.filename.rsplit(".", 1)[-1] if "." in image.filename else "jpg"
            image_name = minio_service.upload(data, ext, prefix="transport-img")

        if video is not None and video.filename:
            data = await video.read()
            ext = video.filename.rsplit(".", 1)[-1] if "." in video.filename else "mp4"
            video_name = minio_service.upload(data, ext, prefix="transport-vid")

        transport = Transport(
            title=title,
            description="",
            status="draft",
            image_url=image_name,
            video_url=video_name,
            speed_kmh=0,
            price_per_km=0,
            author_id=user.id,
            likes=0,
            created_at=datetime.utcnow(),
        )
        db.add(transport)
        await db.commit()
        await db.refresh(transport)
        return self._to_dto(transport, user)

    # ============== PUT публикация ==============
    async def publish(
        self,
        db: AsyncSession,
        user: User,
        transport_id: int,
        dto: TransportPublishDto,
    ) -> dict:
        t = await db.get(Transport, transport_id)
        if t is None or t.status == "deleted":
            raise HTTPException(404, "Услуга не найдена")
        if t.author_id != user.id:
            raise HTTPException(403, "Это не ваша услуга")
        if t.status != "draft":
            raise HTTPException(400, "Опубликовать можно только черновик")

        t.description = dto.description
        t.speed_kmh = dto.speed_kmh
        t.price_per_km = dto.price_per_km
        t.status = "published"
        t.published_at = datetime.utcnow()

        await db.commit()
        await db.refresh(t)
        return self._to_dto(t, user)

    # ============== DELETE soft delete ==============
    async def soft_delete(
        self, db: AsyncSession, user: User, transport_id: int
    ) -> None:
        t = await db.get(Transport, transport_id)
        if t is None or t.status == "deleted":
            raise HTTPException(404, "Услуга не найдена")
        if t.author_id != user.id:
            raise HTTPException(403, "Это не ваша услуга")

        t.status = "deleted"
        await db.commit()

    # ============== POST like (0/1) ==============
    async def toggle_like(
        self,
        db: AsyncSession,
        user: User,
        transport_id: int,
        value: int,
    ) -> dict:
        t = await db.get(Transport, transport_id)
        if t is None or t.status != "published":
            raise HTTPException(404, "Услуга не найдена или не опубликована")

        stmt = select(Like).where(
            and_(Like.user_id == user.id, Like.transport_id == transport_id)
        )
        existing = (await db.execute(stmt)).scalar_one_or_none()

        if value == 1 and existing is None:
            db.add(Like(user_id=user.id, transport_id=transport_id))
            t.likes += 1
        elif value == 0 and existing is not None:
            await db.delete(existing)
            t.likes = max(0, t.likes - 1)

        await db.commit()
        await db.refresh(t)
        return {"id": t.id, "likes": t.likes, "liked": value == 1}

    # ============== helpers ==============
    def _to_dto(self, t: Transport, user: User) -> dict:
        return {
            "id": t.id,
            "title": t.title,
            "description": t.description,
            "status": t.status,
            "image_url": minio_service.get_signed_url(t.image_url),
            "video_url": minio_service.get_signed_url(t.video_url),
            "speed_kmh": t.speed_kmh,
            "price_per_km": t.price_per_km,
            "likes": t.likes,
            "created_at": t.created_at,
            "published_at": t.published_at,
            "is_mine": 1 if t.author_id == user.id else 0,
        }


transport_service = TransportService()