import asyncio
from sqlalchemy import text
from db.session import engine

async def test_connection():
    try:
        async with engine.connect() as conn:
            result = await conn.execute(text("SELECT 1"))
            print("[OK] Connection successful:", result.scalar())
    except Exception as e:
        print("[FAIL] Connection failed:", e)

if __name__ == "__main__":
    asyncio.run(test_connection())