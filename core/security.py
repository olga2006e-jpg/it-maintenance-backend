from fastapi import Depends, HTTPException, Cookie
from passlib.context import CryptContext
from sqlalchemy.ext.asyncio import AsyncSession

from db.session import get_db
from models.user import User
from services.session_service import session_service

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


async def get_current_user(
    session_id: str | None = Cookie(default=None, alias="session_id"),
    db: AsyncSession = Depends(get_db),
) -> User:
    """
    Обязательная авторизация: 401, если нет cookie или сессии в Redis.
    """
    if not session_id:
        raise HTTPException(status_code=401, detail="Не авторизован")

    user_id = await session_service.get_user_id(session_id)
    if not user_id:
        raise HTTPException(status_code=401, detail="Сессия недействительна или истекла")

    user = await db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=401, detail="Пользователь не найден")

    return user


async def get_current_user_optional(
    session_id: str | None = Cookie(default=None, alias="session_id"),
    db: AsyncSession = Depends(get_db),
) -> User | None:
    """
    Необязательная авторизация: для гостей возвращает None, не бросает 401.
    """
    if not session_id:
        return None
    user_id = await session_service.get_user_id(session_id)
    if not user_id:
        return None
    return await db.get(User, user_id)