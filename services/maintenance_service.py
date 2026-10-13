from datetime import datetime
from typing import Optional

from fastapi import HTTPException, UploadFile
from sqlalchemy import and_, or_, select, text
from sqlalchemy.ext.asyncio import AsyncSession

from models.like import Like
from models.maintenance import maintenance
from models.user import User
from schemas.maintenance import maintenancePublishDto
from services.minio_service import minio_service


class maintenanceService:

    # ============== GET список опубликованных (для каталога) ==============
    async def list_published(
        self,
        db: AsyncSession,
        user: User | None,
        search: Optional[str] = None,
        tariff_from: Optional[int] = None,
        tariff_to: Optional[int] = None,
    ) -> list[dict]:
        stmt = select(maintenance).where(maintenance.status == "published")

        if search:
            stmt = stmt.where(
                or_(
                    maintenance.title.ilike(f"%{search}%"),
                    maintenance.description.ilike(f"%{search}%"),
                )
            )
        if tariff_from is not None:
            stmt = stmt.where(maintenance.price_per_km >= tariff_from)
        if tariff_to is not None:
            stmt = stmt.where(maintenance.price_per_km <= tariff_to)

        rows = (await db.execute(stmt)).scalars().all()
        return [self._to_dto(t, user) for t in rows]

    # ============== GET первая опубликованная карточка (для ленты) ==============
    async def feed(self, db: AsyncSession, user: User | None) -> Optional[dict]:
        stmt = (
            select(maintenance)
            .where(maintenance.status == "published")
            .order_by(
                maintenance.published_at.asc().nullsfirst(),
                maintenance.id.asc(),
            )
            .limit(1)
        )
        t = (await db.execute(stmt)).scalar_one_or_none()
        if t is None:
            return None

        liked_ids = await self._get_liked_ids(db, user)
        return self._to_dto(t, user, liked_ids)

    # ============== GET следующая в ленте (?next=true) ==============
    async def get_next(
        self,
        db: AsyncSession,
        user: User | None,
        maintenance_id: int,
    ) -> dict:
        stmt = (
            select(maintenance)
            .where(maintenance.status == "published")
            .order_by(
                maintenance.published_at.desc().nullslast(),
                maintenance.id.desc(),
            )
        )
        rows = (await db.execute(stmt)).scalars().all()
        if not rows:
            raise HTTPException(404, "Лента пуста")

        liked_ids = await self._get_liked_ids(db, user)

        ids = [t.id for t in rows]
        if maintenance_id not in ids:
            return self._to_dto(rows[0], user, liked_ids)

        idx = ids.index(maintenance_id)
        next_idx = (idx + 1) % len(rows)
        return self._to_dto(rows[next_idx], user, liked_ids)

    # ============== GET черновик (не более 1, id не указывается) ==============
    async def get_draft(self, db: AsyncSession, user: User | None) -> Optional[dict]:
        if user is None:
            return None
        stmt = select(maintenance).where(
            and_(
                maintenance.author_id == user.id,
                maintenance.status == "draft",
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
        existing = await self.get_draft(db, user)
        if existing:
            raise HTTPException(400, "У пользователя уже есть черновик")

        image_name = ""
        video_name = ""

        if image is not None and image.filename:
            data = await image.read()
            ext = image.filename.rsplit(".", 1)[-1] if "." in image.filename else "jpg"
            image_name = minio_service.upload(data, ext, prefix="maintenance-img")

        if video is not None and video.filename:
            data = await video.read()
            ext = video.filename.rsplit(".", 1)[-1] if "." in video.filename else "mp4"
            video_name = minio_service.upload(data, ext, prefix="maintenance-vid")

        maintenance = maintenance(
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
        db.add(maintenance)
        await db.commit()
        await db.refresh(maintenance)
        return self._to_dto(maintenance, user)

    # ============== PUT публикация ==============
    async def publish(
        self,
        db: AsyncSession,
        user: User,
        maintenance_id: int,
        dto: maintenancePublishDto,
    ) -> dict:
        t = await db.get(maintenance, maintenance_id)
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

    # ============== DELETE soft delete (raw SQL) ==============
    async def soft_delete(
        self, db: AsyncSession, user: User, maintenance_id: int
    ) -> None:
        result = await db.execute(
            text(
                "UPDATE maintenances "
                "SET status = 'deleted' "
                "WHERE id = :id AND author_id = :author_id AND status != 'deleted'"
            ),
            {"id": maintenance_id, "author_id": user.id},
        )
        await db.commit()

        if result.rowcount == 0:
            raise HTTPException(404, "Услуга не найдена или не ваша")

    # ============== POST like (0/1) ==============
    async def toggle_like(
        self,
        db: AsyncSession,
        user: User,
        maintenance_id: int,
        value: int,
    ) -> dict:
        t = await db.get(maintenance, maintenance_id)
        if t is None or t.status != "published":
            raise HTTPException(404, "Услуга не найдена или не опубликована")

        stmt = select(Like).where(
            and_(Like.user_id == user.id, Like.maintenance_id == maintenance_id)
        )
        existing = (await db.execute(stmt)).scalar_one_or_none()

        if value == 1 and existing is None:
            db.add(Like(user_id=user.id, maintenance_id=maintenance_id))
            t.likes += 1
        elif value == 0 and existing is not None:
            await db.delete(existing)
            t.likes = max(0, t.likes - 1)

        await db.commit()
        await db.refresh(t)
        return {"id": t.id, "likes": t.likes, "liked": value == 1}

    # ============== helpers ==============
    async def _get_liked_ids(self, db: AsyncSession, user: User | None) -> set[int]:
        if user is None:
            return set()
        stmt = select(Like.maintenance_id).where(Like.user_id == user.id)
        rows = (await db.execute(stmt)).scalars().all()
        return set(rows)

    def _to_dto(
        self,
        t: maintenance,
        user: User | None,
        liked_ids: Optional[set[int]] = None,
    ) -> dict:
        liked_ids = liked_ids or set()
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
            "is_mine": 1 if user and t.author_id == user.id else 0,
            "is_liked": 1 if t.id in liked_ids else 0,
        }


maintenance_service = maintenanceService()