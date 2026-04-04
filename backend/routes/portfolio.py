import json
from fastapi import APIRouter
from config.database import get_pool
from models.schemas import ContactMessageCreate
from datetime import datetime, timezone

router = APIRouter(prefix="/api/v1", tags=["portfolio"])


def row_to_dict(row) -> dict:
    if row is None:
        return {}
    d = dict(row)
    for k, v in d.items():
        if isinstance(v, str):
            try:
                parsed = json.loads(v)
                if isinstance(parsed, (list, dict)):
                    d[k] = parsed
            except (json.JSONDecodeError, TypeError):
                pass
        if hasattr(v, "isoformat"):
            d[k] = v.isoformat()
    if "id" in d and d["id"] is not None:
        d["id"] = str(d["id"])
    return d


def rows_to_list(rows) -> list:
    return [row_to_dict(dict(r)) for r in rows]


@router.get("/portfolio")
async def get_portfolio():
    pool = await get_pool()
    async with pool.acquire() as conn:
        profile_row = await conn.fetchrow("SELECT * FROM profile LIMIT 1")
        experience_rows = await conn.fetch(
            'SELECT * FROM experience ORDER BY "order" ASC'
        )
        projects_rows = await conn.fetch(
            'SELECT * FROM projects ORDER BY "order" ASC'
        )
        skills_rows = await conn.fetch(
            'SELECT * FROM skills ORDER BY "order" ASC'
        )
        theme_row = await conn.fetchrow("SELECT * FROM theme LIMIT 1")

    return {
        "profile": row_to_dict(profile_row),
        "experience": rows_to_list(experience_rows),
        "projects": rows_to_list(projects_rows),
        "skills": rows_to_list(skills_rows),
        "theme": row_to_dict(theme_row),
    }


@router.post("/contact")
async def submit_contact(data: ContactMessageCreate):
    pool = await get_pool()
    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            """
            INSERT INTO contact_messages (name, email, message, is_read, created_at)
            VALUES ($1, $2, $3, FALSE, $4)
            RETURNING id
            """,
            data.name,
            data.email,
            data.message,
            datetime.now(timezone.utc),
        )
    return {"id": str(row["id"]), "message": "Message sent successfully"}
