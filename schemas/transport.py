from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class TransportCreateDto(BaseModel):
    """
    Вход при создании черновика.
    Только пользовательские поля. Системные (id, status, author_id, даты)
    с клиента НЕ принимаются — вычисляются на бэкенде.
    """
    title: str = Field(..., min_length=3, max_length=100)


class TransportPublishDto(BaseModel):
    """Вход при публикации."""
    description: str = Field(..., min_length=1, max_length=500)
    speed_kmh: int = Field(..., ge=0)
    price_per_km: int = Field(..., ge=0)


class LikeDto(BaseModel):
    """0 = убрать лайк, 1 = поставить."""
    value: int = Field(..., ge=0, le=1)


class TransportResponseDto(BaseModel):
    """Ответ клиенту."""
    id: int
    title: str
    description: str
    status: str
    image_url: Optional[str] = None    # signed URL или путь заглушки
    video_url: Optional[str] = None    # signed URL
    speed_kmh: int
    price_per_km: int
    likes: int
    created_at: datetime
    published_at: Optional[datetime] = None
    is_mine: int = 0                   # 1 — создатель == текущий юзер, 0 — иначе

    class Config:
        from_attributes = True