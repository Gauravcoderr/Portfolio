import asyncpg
from typing import Optional
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = ""
    JWT_SECRET: str = "change-this-secret"
    ADMIN_USERNAME: str = "admin"
    ADMIN_PASSWORD: str = "admin123"
    FRONTEND_URL: str = "http://localhost:3000"
    SUPABASE_URL: str = ""
    SUPABASE_SERVICE_KEY: str = ""

    class Config:
        env_file = ".env"


settings = Settings()

_pool: Optional[asyncpg.Pool] = None


async def get_pool() -> asyncpg.Pool:
    global _pool
    if _pool is None:
        db_url = settings.DATABASE_URL.split("?")[0]
        _pool = await asyncpg.create_pool(
            db_url,
            min_size=1,
            max_size=5,
            statement_cache_size=0,
            ssl='require',
        )
    return _pool
