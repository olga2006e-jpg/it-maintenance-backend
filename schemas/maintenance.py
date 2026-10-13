from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


# ─────────────────────────────────────────────────────────────
# ВХОДЯЩИЕ DTO (то, что приходит от клиента)
# ─────────────────────────────────────────────────────────────

class maintenanceCreateDto(BaseModel):
    """
    Вход при создании черновика.
    Только пользовательские поля. Системные (id, status, author_id, даты)
    с клиента НЕ принимаются — вычисляются на бэкенде.
    """
    title: str = Field(..., min_length=3, max_length=100)


class maintenancePublishDto(BaseModel):
    """Вход при публикации."""
    description: str = Field(..., min_length=1, max_length=500)
    speed_kmh: int = Field(..., ge=0)
    price_per_km: int = Field(..., ge=0)


class LikeDto(BaseModel):
    """0 = убрать лайк, 1 = поставить."""
    value: int = Field(..., ge=0, le=1)


# ─────────────────────────────────────────────────────────────
# ИСХОДЯЩИЕ DTO (то, что уходит клиенту)
# Вариант 2: два раздельных DTO под разные сценарии.
# ─────────────────────────────────────────────────────────────

class maintenanceCatalogDto(BaseModel):
    """
    Для КАТАЛОГА (GET /api/maintenances).
    Важно понять: услуга моя (is_mine=1) или чужая (is_mine=0).
    Поле is_liked здесь НЕ отдаём — в каталоге оно не нужно.
    """
    id: int
    title: str
    description: str
    status: str
    image_url: Optional[str] = None
    video_url: Optional[str] = None
    speed_kmh: int
    price_per_km: int
    likes: int
    created_at: datetime
    published_at: Optional[datetime] = None

    # ← ИСПРАВЛЕНО: признак «моя услуга», для каталога
    is_mine: int = 0

    class Config:
        from_attributes = True


class maintenanceFeedDto(BaseModel):
    """
    Для ЛЕНТЫ (GET /api/feed, GET /api/feed/{id}/next).
    Важно понять: текущий пользователь уже лайкнул (is_liked=1) или нет (is_liked=0).
    Поле is_mine здесь НЕ отдаём — в ленте оно не нужно.
    """
    id: int
    title: str
    description: str
    status: str
    image_url: Optional[str] = None
    video_url: Optional[str] = None
    speed_kmh: int
    price_per_km: int
    likes: int
    created_at: datetime
    published_at: Optional[datetime] = None

    # ← ИСПРАВЛЕНО: признак «я лайкнул», для ленты
    is_liked: int = 0

    class Config:
        from_attributes = True