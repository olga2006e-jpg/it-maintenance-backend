import redis.asyncio as redis
from core.config import settings


class SessionService:
    def __init__(self) -> None:
        self.redis = redis.Redis(
            host=settings.REDIS_HOST,
            port=settings.REDIS_PORT,
            password=settings.REDIS_PASSWORD or None,
            db=settings.REDIS_DB,
            decode_responses=True,
        )

    async def create_session(self, session_id: str, user_id: int, ttl: int = 3600) -> None:
        """Создаёт сессию: ключ session:<id> -> user_id на ttl секунд."""
        await self.redis.setex(f"session:{session_id}", ttl, str(user_id))

    async def get_user_id(self, session_id: str) -> int | None:
        """Возвращает user_id по session_id или None."""
        user_id = await self.redis.get(f"session:{session_id}")
        return int(user_id) if user_id else None

    async def destroy_session(self, session_id: str) -> None:
        """Удаляет сессию (logout)."""
        await self.redis.delete(f"session:{session_id}")

    async def exists(self, session_id: str) -> bool:
        """Проверяет наличие сессии."""
        return await self.redis.exists(f"session:{session_id}") == 1


session_service = SessionService()