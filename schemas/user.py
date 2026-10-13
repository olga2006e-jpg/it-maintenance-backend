from pydantic import BaseModel, Field


class UserRegisterDto(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=4, max_length=100)


class UserLoginDto(BaseModel):
    username: str
    password: str


class UserResponseDto(BaseModel):
    id: int
    username: str

    class Config:
        from_attributes = True