import io
import uuid
from datetime import timedelta

from minio import Minio
from minio.error import S3Error

from core.config import settings


class MinioService:
    def __init__(self) -> None:
        self.bucket = settings.MINIO_BUCKET
        self.client = Minio(
            f"{settings.MINIO_ENDPOINT}:{settings.MINIO_PORT}",
            access_key=settings.MINIO_ACCESS_KEY,
            secret_key=settings.MINIO_SECRET_KEY,
            secure=settings.MINIO_USE_SSL,
        )
        self._ensure_bucket()

    def _ensure_bucket(self) -> None:
        try:
            if not self.client.bucket_exists(self.bucket):
                self.client.make_bucket(self.bucket)
        except S3Error as e:
            print(f"[MinIO] bucket error: {e}")

    # ---------- загрузка ----------
    def upload(self, data: bytes, ext: str, prefix: str = "transport") -> str:
        """
        Кладёт файл в MinIO.
        Возвращает ИМЯ (ключ) файла — его сохраняем в БД.
        Имя генерируется на латинице (uuid hex).
        """
        ext = ext.lstrip(".").lower() or "bin"
        filename = f"{prefix}-{uuid.uuid4().hex}.{ext}"
        self.client.put_object(
            self.bucket,
            filename,
            io.BytesIO(data),
            length=len(data),
        )
        return filename

    # ---------- чтение ----------
    def get_signed_url(self, filename: str | None) -> str | None:
        """
        Если filename — уже полный URL или локальный путь (заглушка
        из /static/...), возвращаем как есть.
        Иначе подписываем через MinIO.
        """
        if not filename:
            return None
        if (
            filename.startswith("http://")
            or filename.startswith("https://")
            or filename.startswith("/")
        ):
            return filename

        try:
            return self.client.presigned_get_object(
                self.bucket, filename, expires=timedelta(days=7)
            )
        except S3Error as e:
            print(f"[MinIO] signed url error: {e}")
            return None

    # ---------- удаление ----------
    def delete(self, filename: str | None) -> None:
        if not filename or filename.startswith("http") or filename.startswith("/"):
            return
        try:
            self.client.remove_object(self.bucket, filename)
        except S3Error as e:
            print(f"[MinIO] remove error: {e}")


minio_service = MinioService()