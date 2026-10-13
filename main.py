from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.openapi.utils import get_openapi

from api.handlers import router as html_router
from api.routes_maintenances import router as maintenances_router
from api.routes_users import router as users_router

app = FastAPI(title="Логистика.Про API")

app.mount("/static", StaticFiles(directory="static"), name="static")

app.include_router(html_router)
app.include_router(maintenances_router)
app.include_router(users_router)


def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema

    openapi_schema = get_openapi(
        title="Логистика.Про API",
        version="1.0.0",
        description=(
            "API сервиса логистики. "
            "Для защищённых методов: /api/users/register → /api/users/login, "
            "затем в Swagger → Authorize вставить session_id."
        ),
        routes=app.routes,
    )

    openapi_schema["components"]["securitySchemes"] = {
        "cookieAuth": {
            "type": "apiKey",
            "in": "cookie",
            "name": "session_id",
        }
    }

    app.openapi_schema = openapi_schema
    return app.openapi_schema


app.openapi = custom_openapi


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)