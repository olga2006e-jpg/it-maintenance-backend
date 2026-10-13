from minio import Minio
from core.config import settings

client = Minio(
    f"{settings.MINIO_ENDPOINT}:{settings.MINIO_PORT}",
    access_key=settings.MINIO_ACCESS_KEY,
    secret_key=settings.MINIO_SECRET_KEY,
    secure=settings.MINIO_USE_SSL,
)

try:
    buckets = [b.name for b in client.list_buckets()]
    print("[OK] Buckets:", buckets)
    if settings.MINIO_BUCKET in buckets:
        objs = [o.object_name for o in client.list_objects(settings.MINIO_BUCKET)]
        print(f"[OK] Objects in {settings.MINIO_BUCKET}:", objs)
except Exception as e:
    print("[FAIL] MinIO:", e)