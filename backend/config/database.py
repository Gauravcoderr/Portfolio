import asyncpg
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = ""
    JWT_SECRET: str = "change-this-secret"
    ADMIN_USERNAME: str = "admin"
    ADMIN_PASSWORD: str = "admin123"
    FRONTEND_URL: str = "http://localhost:3000"

    class Config:
        env_file = ".env"


settings = Settings()

_pool: asyncpg.Pool = None


async def connect_db():
    global _pool
    _pool = await asyncpg.create_pool(
        settings.DATABASE_URL,
        min_size=1,
        max_size=10,
        statement_cache_size=0,
        ssl='require',
    )


async def close_db():
    global _pool
    if _pool:
        await _pool.close()


def get_pool() -> asyncpg.Pool:
    return _pool
