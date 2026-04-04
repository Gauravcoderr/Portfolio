from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config.database import settings
from routes.portfolio import router as portfolio_router
from routes.auth import router as auth_router
from routes.admin import router as admin_router

app = FastAPI(title="Portfolio API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(portfolio_router)
app.include_router(auth_router)
app.include_router(admin_router)


@app.get("/")
async def health():
    return {"status": "ok", "service": "portfolio-api"}
