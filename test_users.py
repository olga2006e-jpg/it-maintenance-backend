import asyncio
from sqlalchemy import text
from db.session import engine


async def main():
    async with engine.connect() as conn:
        result = await conn.execute(text("SELECT id, username FROM users"))
        for row in result:
            print(row)


if __name__ == "__main__":
    asyncio.run(main())