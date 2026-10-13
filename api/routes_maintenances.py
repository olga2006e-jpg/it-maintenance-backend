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

from core.security import get_current_user, get_current_user_optional
from db.session import get_db
from models.user import User

from schemas.maintenance import (
    LikeDto,
    maintenancePublishDto,
    maintenanceCatalogDto,
    maintenanceFeedDto,
)
from services.maintenance_service import maintenance_service

router = APIRouter(prefix="/api", tags=["maintenances"])


# --- GET список (только published) с фильтрацией ---
# Гость тоже может читать → get_current_user_optional
@router.get("/maintenances", response_model=list[maintenanceCatalogDto])
async def list_maintenances(
    search: Optional[str] = Query(None),
    tariff_from: Optional[int] = Query(None, ge=0),
    tariff_to: Optional[int] = Query(None, ge=0),
    db: AsyncSession = Depends(get_db),
    user: User | None = Depends(get_current_user_optional),
):
    return await maintenance_service.list_published(
        db, user, search, tariff_from, tariff_to
    )


# --- GET первая опубликованная карточка (для ленты) ---
# Гость может смотреть ленту → get_current_user_optional
@router.get("/feed", response_model=Optional[maintenanceFeedDto])
async def get_feed(
    db: AsyncSession = Depends(get_db),
    user: User | None = Depends(get_current_user_optional),
):
    return await maintenance_service.feed(db, user)


# --- GET следующая услуга в ленте по id (?next=true) ---
# Гость → get_current_user_optional
@router.get(
    "/feed/{maintenance_id}/next", response_model=maintenanceFeedDto
)
async def get_next_in_feed(
    maintenance_id: int,
    next: bool = Query(True),
    db: AsyncSession = Depends(get_db),
    user: User | None = Depends(get_current_user_optional),
):
    """
    Возвращает следующую опубликованную услугу после указанной.
    Если maintenance_id — последний в списке, возвращает первую (циклично).
    """
    return await maintenance_service.get_next(db, user, maintenance_id)


# --- GET черновик текущего пользователя (без id) ---
# Гость → None (черновика нет), поэтому get_current_user_optional
@router.get("/drafts", response_model=Optional[maintenanceCatalogDto])
async def get_draft(
    db: AsyncSession = Depends(get_db),
    user: User | None = Depends(get_current_user_optional),
):
    return await maintenance_service.get_draft(db, user)


# --- POST создать черновик + загрузка файлов в MinIO ---
# Только авторизованный → get_current_user
@router.post("/maintenances", response_model=maintenanceCatalogDto)
async def create_maintenance(
    title: str = Form(..., min_length=3, max_length=100),
    image: Optional[UploadFile] = File(None),
    video: Optional[UploadFile] = File(None),
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    if image is None and video is None:
        raise HTTPException(400, "Нужно приложить хотя бы один файл")

    return await maintenance_service.create_draft(db, user, title, image, video)


# --- PUT публикация (смена статуса draft -> published) ---
# Только автор → get_current_user
@router.put(
    "/maintenances/{maintenance_id}/publish",
    response_model=maintenanceCatalogDto,
)
async def publish_maintenance(
    maintenance_id: int,
    dto: maintenancePublishDto,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return await maintenance_service.publish(db, user, maintenance_id, dto)


# --- DELETE soft delete (status = deleted), только свои ---
# Только автор → get_current_user
@router.delete("/maintenances/{maintenance_id}")
async def delete_maintenance(
    maintenance_id: int,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    await maintenance_service.soft_delete(db, user, maintenance_id)
    return {
        "message": f"maintenance {maintenance_id} deleted",
    }


# --- POST like 0/1 ---
# Только авторизованный → get_current_user
@router.post("/maintenances/{maintenance_id}/like")
async def like_maintenance(
    maintenance_id: int,
    dto: LikeDto,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return await maintenance_service.toggle_like(db, user, maintenance_id, dto.value)