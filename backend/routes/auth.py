from fastapi import APIRouter, HTTPException
from jose import jwt
from datetime import datetime, timedelta, timezone
from config.database import settings, get_pool
from models.schemas import AdminLogin
from passlib.context import CryptContext

router = APIRouter(prefix="/api/v1/auth", tags=["auth"])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


@router.post("/login")
async def admin_login(data: AdminLogin):
    pool = await get_pool()
    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            "SELECT * FROM admin_users WHERE username = $1", data.username
        )

    if not row or not pwd_context.verify(data.password, row["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = jwt.encode(
        {
            "sub": data.username,
            "role": "admin",
            "exp": datetime.now(timezone.utc) + timedelta(days=7),
        },
        settings.JWT_SECRET,
        algorithm="HS256",
    )

    return {"token": token, "username": data.username}
