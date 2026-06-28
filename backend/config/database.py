from motor.motor_asyncio import AsyncIOMotorClient
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    MONGODB_URI: str = "mongodb://localhost:27017"
    JWT_SECRET: str = "portfolio-jwt-secret"
    ADMIN_USERNAME: str = "admin"
    ADMIN_PASSWORD: str = "admin@123"
    FRONTEND_URL: str = "http://localhost:3000"

    class Config:
        env_file = ".env"


settings = Settings()

client: AsyncIOMotorClient = None
db = None


async def connect_db():
    global client, db
    client = AsyncIOMotorClient(settings.MONGODB_URI)
    db = client["portfolio"]
    await db.experience.create_index("order")
    await db.projects.create_index("order")
    await db.skills.create_index("order")
    await db.contact_messages.create_index([("created_at", -1)])
    print("Connected to MongoDB: portfolio")


async def close_db():
    global client
    if client:
        client.close()


async def get_db():
    global client, db
    if db is None:
        await connect_db()
    return db
