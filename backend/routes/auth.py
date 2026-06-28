from fastapi import APIRouter, HTTPException
from jose import jwt
from datetime import datetime, timedelta, timezone
from config.database import settings, get_db
from models.schemas import AdminLogin
from passlib.context import CryptContext

router = APIRouter(prefix="/api/v1/auth", tags=["auth"])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


@router.post("/login")
async def admin_login(data: AdminLogin):
    db = get_db()
    user = await db.admin_users.find_one({"username": data.username})

    if not user or not pwd_context.verify(data.password, user["password_hash"]):
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
