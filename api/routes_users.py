from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from db.session import get_db
from models.user import User
from schemas.user import UserRegisterDto, UserResponseDto

router = APIRouter(prefix="/api/users", tags=["users"])


@router.post("/register", response_model=UserResponseDto)
async def register(dto: UserRegisterDto, db: AsyncSession = Depends(get_db)):
    stmt = select(User).where(User.username == dto.username)
    if (await db.execute(stmt)).scalar_one_or_none():
        raise HTTPException(400, "Имя занято")

    user = User(username=dto.username)
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user


@router.post("/login")
async def login():
    # Заглушка для лабораторной №4
    return {"status": "stub", "detail": "Реализуется в лабораторной №4"}


@router.post("/logout")
async def logout():
    # Заглушка для лабораторной №4
    return {"status": "stub", "detail": "Реализуется в лабораторной №4"}