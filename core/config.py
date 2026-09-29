from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # --- База данных ---
    DB_HOST: str
    DB_PORT: int
    DB_USER: str
    DB_PASSWORD: str
    DB_NAME: str

    # --- MinIO ---
    MINIO_ENDPOINT: str = "localhost"
    MINIO_PORT: int = 9000
    MINIO_ACCESS_KEY: str = "root"
    MINIO_SECRET_KEY: str = "rootpassword"
    MINIO_BUCKET: str = "medialab1"
    MINIO_USE_SSL: bool = False
    MINIO_PUBLIC_URL: str = "http://localhost:9000"

    @property
    def DATABASE_URL(self) -> str:
        return (
            f"postgresql+asyncpg://{self.DB_USER}:{self.DB_PASSWORD}"
            f"@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"
        )

    class Config:
        env_file = ".env"


settings = Settings()