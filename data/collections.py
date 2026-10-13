"""Данные лабораторной №1: только Python-массивы, без БД."""

MINIO_BASE_URL = "http://localhost:9000/medialab1"

maintenances_db = [
    {
        "id": 1,
        "slug": "fura",
        "title": "Фура",
        "subtitle": "Магистральный грузовик",
        "description": "Идеальна для больших грузов. Подходит для строительства, материалов, мебели и крупной техники.",
        "capacity_kg": 20000,
        "speed_kmh": 60,
        "price_per_km": 120,
        "likes": 24,
        "image_url": f"{MINIO_BASE_URL}/fura.png",
        "video_url": f"{MINIO_BASE_URL}/fura.mp4",
    },
    {
        "id": 2,
        "slug": "malyi-gruzovik",
        "title": "Малотоннажный грузовик",
        "subtitle": "Городская доставка",
        "description": "Городская и межгородская перевозка небольших партий товаров и сборных грузов.",
        "capacity_kg": 1500,
        "speed_kmh": 80,
        "price_per_km": 90,
        "likes": 18,
        "image_url": f"{MINIO_BASE_URL}/small-truck.png",
        "video_url": f"{MINIO_BASE_URL}/small-truck.mp4",
    },
    {
        "id": 3,
        "slug": "aviaperevozka",
        "title": "Авиаперевозка",
        "subtitle": "Срочная доставка",
        "description": "Срочная доставка малогабаритных грузов на дальние расстояния. Минимальные сроки.",
        "capacity_kg": 100,
        "speed_kmh": 800,
        "price_per_km": 500,
        "likes": 31,
        "image_url": f"{MINIO_BASE_URL}/airplane.png",
        "video_url": f"{MINIO_BASE_URL}/airplane.mp4",
    },
    {
        "id": 4,
        "slug": "poezd",
        "title": "Поезд",
        "subtitle": "Железнодорожная доставка",
        "description": "Экономичная перевозка крупных партий товаров. Стабильный график и высокая надёжность.",
        "capacity_kg": 60000,
        "speed_kmh": 100,
        "price_per_km": 60,
        "likes": 12,
        "image_url": f"{MINIO_BASE_URL}/train.png",
        "video_url": f"{MINIO_BASE_URL}/train.mp4",
    },
]

likes_by_user = {
    1: {1, 3},
    2: {2},
}