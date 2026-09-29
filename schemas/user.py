from pydantic import BaseModel, Field


class UserRegisterDto(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)


class UserResponseDto(BaseModel):
    id: int
    username: str

    class Config:
        from_attributes = True