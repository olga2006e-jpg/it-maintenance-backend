"""
Singleton-функция для получения текущего пользователя.

По заданию лабораторной №3 пользователь-создатель ЗАФИКСИРОВАН КОНСТАНТОЙ.
В лабораторной №4 здесь будет проверка JWT-токена.
"""
from fastapi import Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from db.session import get_db
from models.user import User

# Константы фиксированного пользователя
CURRENT_USER_ID = 1
CURRENT_USERNAME = "demo_user"


async def get_current_user(db: AsyncSession = Depends(get_db)) -> User:
    """
    Возвращает пользователя с CURRENT_USER_ID.
    Если его ещё нет в БД — создаёт.
    Используется во всех методах через Depends(get_current_user).
    """
    stmt = select(User).where(User.id == CURRENT_USER_ID)
    user = (await db.execute(stmt)).scalar_one_or_none()

    if user is None:
        user = User(id=CURRENT_USER_ID, username=CURRENT_USERNAME)
        db.add(user)
        await db.commit()
        await db.refresh(user)

    return user