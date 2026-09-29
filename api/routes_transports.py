from typing import Optional

from fastapi import (
    APIRouter,
    Depends,
    File,
    Form,
    HTTPException,
    Query,
    UploadFile,
)
from sqlalchemy.ext.asyncio import AsyncSession

from core.security import get_current_user
from db.session import get_db
from models.user import User
from schemas.transport import (
    LikeDto,
    TransportPublishDto,
    TransportResponseDto,
)
from services.transport_service import transport_service

router = APIRouter(prefix="/api", tags=["transports"])


# --- GET список (только published) с фильтрацией ---
@router.get("/transports", response_model=list[TransportResponseDto])
async def list_transports(
    search: Optional[str] = Query(None),
    tariff_from: Optional[int] = Query(None, ge=0),
    tariff_to: Optional[int] = Query(None, ge=0),
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return await transport_service.list_published(
        db, user, search, tariff_from, tariff_to
    )


# --- GET лента (только published) ---
@router.get("/feed", response_model=list[TransportResponseDto])
async def get_feed(
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return await transport_service.feed(db, user)


# --- GET следующая услуга в ленте по id (?next=true) ---
@router.get(
    "/feed/{transport_id}/next", response_model=TransportResponseDto
)
async def get_next_in_feed(
    transport_id: int,
    next: bool = Query(True),
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """
    Возвращает следующую опубликованную услугу после указанной.
    Если transport_id — последний в списке, возвращает первую (циклично).
    """
    return await transport_service.get_next(db, user, transport_id)


# --- GET черновик текущего пользователя (без id) ---
@router.get("/drafts", response_model=Optional[TransportResponseDto])
async def get_draft(
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return await transport_service.get_draft(db, user)


# --- POST создать черновик + загрузка файлов в MinIO ---
@router.post("/transports", response_model=TransportResponseDto)
async def create_transport(
    title: str = Form(..., min_length=3, max_length=100),
    image: Optional[UploadFile] = File(None),
    video: Optional[UploadFile] = File(None),
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    if image is None and video is None:
        raise HTTPException(400, "Нужно приложить хотя бы один файл")

    return await transport_service.create_draft(db, user, title, image, video)


# --- PUT публикация (смена статуса draft -> published) ---
@router.put(
    "/transports/{transport_id}/publish",
    response_model=TransportResponseDto,
)
async def publish_transport(
    transport_id: int,
    dto: TransportPublishDto,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return await transport_service.publish(db, user, transport_id, dto)


# --- DELETE soft delete (status = deleted), только свои ---
@router.delete("/transports/{transport_id}")
async def delete_transport(
    transport_id: int,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    await transport_service.soft_delete(db, user, transport_id)
    return {
        "message": f"Transport {transport_id} deleted",
    }


# --- POST like 0/1 ---
@router.post("/transports/{transport_id}/like")
async def like_transport(
    transport_id: int,
    dto: LikeDto,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return await transport_service.toggle_like(db, user, transport_id, dto.value)