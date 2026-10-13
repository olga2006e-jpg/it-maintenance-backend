from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, Response, Cookie
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from core.security import get_password_hash, verify_password
from db.session import get_db
from models.user import User
from schemas.user import UserRegisterDto, UserLoginDto, UserResponseDto
from services.session_service import session_service

router = APIRouter(prefix="/api/users", tags=["users"])


@router.post("/register", response_model=UserResponseDto, summary="Регистрация")
async def register(dto: UserRegisterDto, db: AsyncSession = Depends(get_db)):
    stmt = select(User).where(User.username == dto.username)
    if (await db.execute(stmt)).scalar_one_or_none():
        raise HTTPException(400, "Имя занято")

    user = User(
        username=dto.username,
        password_hash=get_password_hash(dto.password),
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user


@router.post("/login", summary="Вход (устанавливает cookie session_id)")
async def login(
    dto: UserLoginDto,
    response: Response,
    db: AsyncSession = Depends(get_db),
):
    stmt = select(User).where(User.username == dto.username)
    user = (await db.execute(stmt)).scalar_one_or_none()
    if not user or not verify_password(dto.password, user.password_hash):
        raise HTTPException(401, "Неверный логин или пароль")

    session_id = str(uuid4())
    await session_service.create_session(session_id, user.id)
    response.set_cookie(
        key="session_id",
        value=session_id,
        httponly=True,
        max_age=3600,
        samesite="lax",
    )
    return {
        "message": "Успешный вход",
        "user_id": user.id,
        "username": user.username,
    }


@router.post("/logout", summary="Выход (удаляет сессию и cookie)")
async def logout(
    response: Response,
    session_id: str | None = Cookie(default=None, alias="session_id"),
):
    if session_id:
        await session_service.destroy_session(session_id)
    response.delete_cookie("session_id")
    return {"message": "Выход выполнен"}