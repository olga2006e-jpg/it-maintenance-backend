from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from api.handlers import router as html_router
from api.routes_transports import router as transports_router
from api.routes_users import router as users_router

app = FastAPI(title="Логистика.Про API")

# Статика (стили, локальные картинки-заглушки)
app.mount("/static", StaticFiles(directory="static"), name="static")

# HTML-страницы (лента, добавление, каталог) — для SPA
app.include_router(html_router)

# REST API с префиксом /api
app.include_router(transports_router)
app.include_router(users_router)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)