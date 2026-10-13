from fastapi import APIRouter, Query, Request, Depends, Form
from fastapi.templating import Jinja2Templates
from fastapi.responses import RedirectResponse
from sqlalchemy import select, text
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime
from models.user import User
from db.session import get_db
from models.maintenance import maintenance
from models.like import Like
from services.minio_service import minio_service

router = APIRouter()
templates = Jinja2Templates(directory="templates")

# ─── Заглушка лежит в static/css/images/placeholder.png ───
PLACEHOLDER_URL = "/static/css/images/placeholder.png"


# ─── GET #1: лента ─────────────────────────────────────────
@router.get("/", name="feed")
async def get_feed(
    request: Request,
    user_id: int = Query(1, ge=1),
    maintenance_id: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_db),
):
    stmt = select(maintenance).where(maintenance.status == "published")
    result = await db.execute(stmt)
    rows = result.scalars().all()

    # Превращаем ORM-модели в словари с подписанными URL MinIO
    maintenances = [
        {
            "id": t.id,
            "title": t.title,
            "description": t.description,
            "image_url": minio_service.get_signed_url(t.image_url),
            "video_url": minio_service.get_signed_url(t.video_url),
            "speed_kmh": t.speed_kmh,
            "price_per_km": t.price_per_km,
            "likes": t.likes,
        }
        for t in rows
    ]

    liked_result = await db.execute(
        select(Like.maintenance_id).where(Like.user_id == user_id)
    )
    liked_ids = {row[0] for row in liked_result.all()}

    start_index = 0
    if maintenance_id > 0:
        for i, t in enumerate(maintenances):
            if t["id"] == maintenance_id:
                start_index = i
                break

    return templates.TemplateResponse(
        request=request,
        name="feed.html",
        context={
            "maintenances": maintenances,
            "liked_ids": liked_ids,
            "user_id": user_id,
            "start_index": start_index,
            "placeholder_url": PLACEHOLDER_URL,
        },
    )


# ─── GET #2: добавление / публикация ───────────────────────
@router.get("/add", name="add_maintenance")
async def get_add_maintenance(
    request: Request,
    user_id: int = Query(1, ge=1),
    db: AsyncSession = Depends(get_db),
):
    stmt = select(maintenance).where(
        maintenance.author_id == user_id,
        maintenance.status == "draft",
    )
    result = await db.execute(stmt)
    draft = result.scalar_one_or_none()

    # Если есть черновик — тоже подпишем URL для превью
    draft_view = None
    if draft is not None:
        draft_view = {
            "id": draft.id,
            "title": draft.title,
            "description": draft.description,
            "image_url": minio_service.get_signed_url(draft.image_url),
            "video_url": minio_service.get_signed_url(draft.video_url),
            "speed_kmh": draft.speed_kmh,
            "price_per_km": draft.price_per_km,
            "likes": draft.likes,
        }

    return templates.TemplateResponse(
        request=request,
        name="add.html",
        context={
            "user_id": user_id,
            "draft": draft_view,
            "placeholder_url": PLACEHOLDER_URL,
        },
    )


# ─── GET #3: каталог ───────────────────────────────────────
@router.get("/catalog", name="catalog")
async def get_catalog(
    request: Request,
    user_id: int = Query(1, ge=1),
    tariff_from: int | None = Query(None, ge=0),
    tariff_to: int | None = Query(None, ge=0),
    db: AsyncSession = Depends(get_db),
):
    stmt = select(maintenance).where(maintenance.status == "published")

    if tariff_from is not None or tariff_to is not None:
        lo = tariff_from if tariff_from is not None else 0
        hi = tariff_to if tariff_to is not None else 10**9
        if lo > hi:
            lo, hi = hi, lo
        stmt = stmt.where(
            maintenance.price_per_km >= lo,
            maintenance.price_per_km <= hi,
        )

    result = await db.execute(stmt)
    rows = result.scalars().all()

    maintenances = [
        {
            "id": t.id,
            "title": t.title,
            "description": t.description,
            "image_url": minio_service.get_signed_url(t.image_url),
            "video_url": minio_service.get_signed_url(t.video_url),
            "speed_kmh": t.speed_kmh,
            "price_per_km": t.price_per_km,
            "likes": t.likes,
        }
        for t in rows
    ]

    liked_result = await db.execute(
        select(Like.maintenance_id).where(Like.user_id == user_id)
    )
    liked_ids = {row[0] for row in liked_result.all()}

    return templates.TemplateResponse(
        request=request,
        name="catalog.html",
        context={
            "maintenances": maintenances,
            "liked_ids": liked_ids,
            "user_id": user_id,
            "tariff_from": tariff_from if tariff_from is not None else 0,
            "tariff_to": tariff_to if tariff_to is not None else 1000,
            "placeholder_url": PLACEHOLDER_URL,
        },
    )


# ─── POST #1: создание черновика ───────────────────────────
@router.post("/add", name="add_maintenance_post")
async def post_add_maintenance(
    title: str = Form(...),
    image_url: str = Form(""),
    video_url: str = Form(""),
    user_id: int = Form(1),
    db: AsyncSession = Depends(get_db),
):
    stmt = select(maintenance).where(
        maintenance.author_id == user_id,
        maintenance.status == "draft",
    )
    existing = (await db.execute(stmt)).scalar_one_or_none()
    if existing:
        return RedirectResponse(url="/add", status_code=303)

    new_maintenance = maintenance(
        title=title,
        description="",
        status="draft",
        image_url=image_url or PLACEHOLDER_URL,
        video_url=video_url,
        speed_kmh=0,
        price_per_km=0,
        created_at=datetime.utcnow(),
        published_at=None,
        author_id=user_id,
        likes=0,
    )
    db.add(new_maintenance)
    await db.commit()
    return RedirectResponse(url="/add", status_code=303)


# ─── POST #2: публикация ───────────────────────────────────
@router.post("/publish/{maintenance_id}", name="publish_maintenance")
async def publish_maintenance(
    maintenance_id: int,
    description: str = Form(...),
    speed_kmh: int = Form(...),
    price_per_km: int = Form(...),
    db: AsyncSession = Depends(get_db),
):
    maintenance = await db.get(maintenance, maintenance_id)
    if not maintenance:
        return RedirectResponse(url="/add", status_code=303)

    maintenance.description = description
    maintenance.speed_kmh = speed_kmh
    maintenance.price_per_km = price_per_km
    if not maintenance.image_url:
        maintenance.image_url = PLACEHOLDER_URL
    maintenance.status = "published"
    maintenance.published_at = datetime.utcnow()

    await db.commit()
    return RedirectResponse(url="/catalog", status_code=303)


# ─── POST #3: логическое удаление (Raw SQL) ────────────────
@router.post("/maintenance/{maintenance_id}/delete", name="delete_maintenance")
async def delete_maintenance(
    maintenance_id: int,
    db: AsyncSession = Depends(get_db),
):
    update_query = """
        UPDATE maintenances
        SET status = 'deleted'
        WHERE id = :id
    """
    await db.execute(text(update_query), {"id": maintenance_id})
    await db.commit()
    return RedirectResponse(url="/catalog", status_code=303)