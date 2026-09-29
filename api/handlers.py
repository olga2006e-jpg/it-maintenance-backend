from fastapi import APIRouter, Query, Request, Depends, Form
from fastapi.templating import Jinja2Templates
from fastapi.responses import RedirectResponse
from sqlalchemy import select, text
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime
from models.user import User
from db.session import get_db
from models.transport import Transport
from models.like import Like

router = APIRouter()
templates = Jinja2Templates(directory="templates")

# ─── Заглушка лежит в static/css/images/placeholder.png ───
PLACEHOLDER_URL = "/static/css/images/placeholder.png"


# ─── GET #1: лента ─────────────────────────────────────────
@router.get("/", name="feed")
async def get_feed(
    request: Request,
    user_id: int = Query(1, ge=1),
    transport_id: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_db),
):
    stmt = select(Transport).where(Transport.status == "published")
    result = await db.execute(stmt)
    transports = result.scalars().all()
    liked_result = await db.execute(
        select(Like.transport_id).where(Like.user_id == user_id)
    )
    liked_ids = {row[0] for row in liked_result.all()}
    start_index = 0
    if transport_id > 0:
        for i, t in enumerate(transports):
            if t.id == transport_id:
                start_index = i
                break
    return templates.TemplateResponse(
        request=request,
        name="feed.html",
        context={
            "transports": transports,
            "liked_ids": liked_ids,
            "user_id": user_id,
            "start_index": start_index,
            "placeholder_url": PLACEHOLDER_URL,
        },
    )


# ─── GET #2: добавление / публикация ───────────────────────
@router.get("/add", name="add_transport")
async def get_add_transport(
    request: Request,
    user_id: int = Query(1, ge=1),
    db: AsyncSession = Depends(get_db),
):
    stmt = select(Transport).where(
        Transport.author_id == user_id,
        Transport.status == "draft",
    )
    result = await db.execute(stmt)
    draft = result.scalar_one_or_none()

    return templates.TemplateResponse(
        request=request,
        name="add.html",
        context={
            "user_id": user_id,
            "draft": draft,
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
    stmt = select(Transport).where(Transport.status == "published")

    if tariff_from is not None or tariff_to is not None:
        lo = tariff_from if tariff_from is not None else 0
        hi = tariff_to if tariff_to is not None else 10**9
        if lo > hi:
            lo, hi = hi, lo
        stmt = stmt.where(
            Transport.price_per_km >= lo,
            Transport.price_per_km <= hi,
        )

    result = await db.execute(stmt)
    transports = result.scalars().all()

    liked_result = await db.execute(
        select(Like.transport_id).where(Like.user_id == user_id)
    )
    liked_ids = {row[0] for row in liked_result.all()}

    return templates.TemplateResponse(
        request=request,
        name="catalog.html",
        context={
            "transports": transports,
            "liked_ids": liked_ids,
            "user_id": user_id,
            "tariff_from": tariff_from if tariff_from is not None else 0,
            "tariff_to": tariff_to if tariff_to is not None else 1000,
            "placeholder_url": PLACEHOLDER_URL,
        },
    )


# ─── POST #1: создание черновика ───────────────────────────
@router.post("/add", name="add_transport_post")
async def post_add_transport(
    title: str = Form(...),
    image_url: str = Form(""),
    video_url: str = Form(""),
    user_id: int = Form(1),
    db: AsyncSession = Depends(get_db),
):
    stmt = select(Transport).where(
        Transport.author_id == user_id,
        Transport.status == "draft",
    )
    existing = (await db.execute(stmt)).scalar_one_or_none()
    if existing:
        return RedirectResponse(url="/add", status_code=303)

    new_transport = Transport(
        title=title,
        description="",
        status="draft",
        image_url=image_url or PLACEHOLDER_URL,   # ← локальная заглушка
        video_url=video_url,
        speed_kmh=0,
        price_per_km=0,
        created_at=datetime.utcnow(),
        published_at=None,
        author_id=user_id,
        likes=0,
    )
    db.add(new_transport)
    await db.commit()
    return RedirectResponse(url="/add", status_code=303)


# ─── POST #2: публикация ───────────────────────────────────
@router.post("/publish/{transport_id}", name="publish_transport")
async def publish_transport(
    transport_id: int,
    description: str = Form(...),
    speed_kmh: int = Form(...),
    price_per_km: int = Form(...),
    db: AsyncSession = Depends(get_db),
):
    transport = await db.get(Transport, transport_id)
    if not transport:
        return RedirectResponse(url="/add", status_code=303)

    transport.description = description
    transport.speed_kmh = speed_kmh
    transport.price_per_km = price_per_km
    if not transport.image_url:
        transport.image_url = PLACEHOLDER_URL
    transport.status = "published"
    transport.published_at = datetime.utcnow()

    await db.commit()
    return RedirectResponse(url="/catalog", status_code=303)


# ─── POST #3: логическое удаление (Raw SQL) ────────────────
@router.post("/transport/{transport_id}/delete", name="delete_transport")
async def delete_transport(
    transport_id: int,
    db: AsyncSession = Depends(get_db),
):
    update_query = """
        UPDATE transports
        SET status = 'deleted'
        WHERE id = :id
    """
    await db.execute(text(update_query), {"id": transport_id})
    await db.commit()
    return RedirectResponse(url="/catalog", status_code=303)