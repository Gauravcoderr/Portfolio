import json
from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime, timezone
from config.database import get_pool
from middleware.auth import verify_admin
from models.schemas import (
    ProfileUpdate,
    ExperienceCreate,
    ExperienceUpdate,
    ProjectCreate,
    ProjectUpdate,
    SkillCategoryCreate,
    SkillCategoryUpdate,
    ThemeUpdate,
)

router = APIRouter(
    prefix="/api/v1/admin", tags=["admin"], dependencies=[Depends(verify_admin)]
)


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


# --- Profile ---
@router.put("/profile")
async def update_profile(data: ProfileUpdate):
    pool = await get_pool()
    now = datetime.now(timezone.utc)
    dump = data.model_dump(exclude_none=True)
    if "social_links" in dump and dump["social_links"]:
        dump["social_links"] = json.dumps(dump["social_links"])

    async with pool.acquire() as conn:
        existing = await conn.fetchrow("SELECT id FROM profile LIMIT 1")
        if existing:
            sets = ", ".join(
                f"{k} = ${i+2}" for i, k in enumerate(dump.keys())
            )
            vals = list(dump.values())
            await conn.execute(
                f"UPDATE profile SET {sets}, updated_at = ${len(vals)+2} WHERE id = $1",
                existing["id"], *vals, now,
            )
        else:
            cols = ", ".join(dump.keys())
            placeholders = ", ".join(f"${i+1}" for i in range(len(dump)))
            await conn.execute(
                f"INSERT INTO profile ({cols}, updated_at) VALUES ({placeholders}, ${len(dump)+1})",
                *dump.values(), now,
            )
        row = await conn.fetchrow("SELECT * FROM profile LIMIT 1")
    return row_to_dict(row)


# --- Experience ---
@router.get("/experience")
async def list_experience():
    pool = await get_pool()
    async with pool.acquire() as conn:
        rows = await conn.fetch('SELECT * FROM experience ORDER BY "order" ASC')
    return rows_to_list(rows)


@router.post("/experience")
async def create_experience(data: ExperienceCreate):
    pool = await get_pool()
    now = datetime.now(timezone.utc)
    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            """
            INSERT INTO experience
              (company, role, location, start_date, end_date, is_current,
               description, tech_stack, company_url, "order", created_at, updated_at)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$11)
            RETURNING *
            """,
            data.company, data.role, data.location, data.start_date,
            data.end_date, data.is_current,
            json.dumps(data.description), json.dumps(data.tech_stack),
            data.company_url, data.order, now,
        )
    return row_to_dict(row)


@router.put("/experience/{id}")
async def update_experience(id: str, data: ExperienceUpdate):
    pool = await get_pool()
    now = datetime.now(timezone.utc)
    dump = data.model_dump(exclude_none=True)
    for k in ("description", "tech_stack"):
        if k in dump:
            dump[k] = json.dumps(dump[k])
    async with pool.acquire() as conn:
        existing = await conn.fetchrow("SELECT id FROM experience WHERE id = $1::uuid", id)
        if not existing:
            raise HTTPException(status_code=404, detail="Experience not found")
        sets = ", ".join(f"{k} = ${i+2}" for i, k in enumerate(dump.keys()))
        vals = list(dump.values())
        await conn.execute(
            f'UPDATE experience SET {sets}, updated_at = ${len(vals)+2} WHERE id = $1::uuid',
            id, *vals, now,
        )
        row = await conn.fetchrow("SELECT * FROM experience WHERE id = $1::uuid", id)
    return row_to_dict(row)


@router.delete("/experience/{id}")
async def delete_experience(id: str):
    pool = await get_pool()
    async with pool.acquire() as conn:
        result = await conn.execute("DELETE FROM experience WHERE id = $1::uuid", id)
    if result == "DELETE 0":
        raise HTTPException(status_code=404, detail="Experience not found")
    return {"message": "Deleted successfully"}


# --- Projects ---
@router.get("/projects")
async def list_projects():
    pool = await get_pool()
    async with pool.acquire() as conn:
        rows = await conn.fetch('SELECT * FROM projects ORDER BY "order" ASC')
    return rows_to_list(rows)


@router.post("/projects")
async def create_project(data: ProjectCreate):
    pool = await get_pool()
    now = datetime.now(timezone.utc)
    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            """
            INSERT INTO projects
              (title, slug, description, bullets, image_url, live_url,
               github_url, tech_stack, category, is_featured, "order", created_at, updated_at)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$12)
            RETURNING *
            """,
            data.title, data.slug, data.description,
            json.dumps(data.bullets), data.image_url, data.live_url,
            data.github_url, json.dumps(data.tech_stack),
            data.category, data.is_featured, data.order, now,
        )
    return row_to_dict(row)


@router.put("/projects/{id}")
async def update_project(id: str, data: ProjectUpdate):
    pool = await get_pool()
    now = datetime.now(timezone.utc)
    dump = data.model_dump(exclude_none=True)
    for k in ("bullets", "tech_stack"):
        if k in dump:
            dump[k] = json.dumps(dump[k])
    async with pool.acquire() as conn:
        existing = await conn.fetchrow("SELECT id FROM projects WHERE id = $1::uuid", id)
        if not existing:
            raise HTTPException(status_code=404, detail="Project not found")
        sets = ", ".join(f"{k} = ${i+2}" for i, k in enumerate(dump.keys()))
        vals = list(dump.values())
        await conn.execute(
            f'UPDATE projects SET {sets}, updated_at = ${len(vals)+2} WHERE id = $1::uuid',
            id, *vals, now,
        )
        row = await conn.fetchrow("SELECT * FROM projects WHERE id = $1::uuid", id)
    return row_to_dict(row)


@router.delete("/projects/{id}")
async def delete_project(id: str):
    pool = await get_pool()
    async with pool.acquire() as conn:
        result = await conn.execute("DELETE FROM projects WHERE id = $1::uuid", id)
    if result == "DELETE 0":
        raise HTTPException(status_code=404, detail="Project not found")
    return {"message": "Deleted successfully"}


# --- Skills ---
@router.get("/skills")
async def list_skills():
    pool = await get_pool()
    async with pool.acquire() as conn:
        rows = await conn.fetch('SELECT * FROM skills ORDER BY "order" ASC')
    return rows_to_list(rows)


@router.post("/skills")
async def create_skill_category(data: SkillCategoryCreate):
    pool = await get_pool()
    now = datetime.now(timezone.utc)
    items = [i.model_dump() for i in data.items]
    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            """
            INSERT INTO skills (category, items, "order", created_at, updated_at)
            VALUES ($1, $2, $3, $4, $4) RETURNING *
            """,
            data.category, json.dumps(items), data.order, now,
        )
    return row_to_dict(row)


@router.put("/skills/{id}")
async def update_skill_category(id: str, data: SkillCategoryUpdate):
    pool = await get_pool()
    now = datetime.now(timezone.utc)
    dump = data.model_dump(exclude_none=True)
    if "items" in dump:
        dump["items"] = json.dumps([
            i.model_dump() if hasattr(i, "model_dump") else i
            for i in dump["items"]
        ])
    async with pool.acquire() as conn:
        existing = await conn.fetchrow("SELECT id FROM skills WHERE id = $1::uuid", id)
        if not existing:
            raise HTTPException(status_code=404, detail="Skill category not found")
        sets = ", ".join(f"{k} = ${i+2}" for i, k in enumerate(dump.keys()))
        vals = list(dump.values())
        await conn.execute(
            f'UPDATE skills SET {sets}, updated_at = ${len(vals)+2} WHERE id = $1::uuid',
            id, *vals, now,
        )
        row = await conn.fetchrow("SELECT * FROM skills WHERE id = $1::uuid", id)
    return row_to_dict(row)


@router.delete("/skills/{id}")
async def delete_skill_category(id: str):
    pool = await get_pool()
    async with pool.acquire() as conn:
        result = await conn.execute("DELETE FROM skills WHERE id = $1::uuid", id)
    if result == "DELETE 0":
        raise HTTPException(status_code=404, detail="Skill category not found")
    return {"message": "Deleted successfully"}


# --- Theme ---
@router.put("/theme")
async def update_theme(data: ThemeUpdate):
    pool = await get_pool()
    now = datetime.now(timezone.utc)
    dump = data.model_dump(exclude_none=True)
    async with pool.acquire() as conn:
        existing = await conn.fetchrow("SELECT id FROM theme LIMIT 1")
        if existing:
            sets = ", ".join(f"{k} = ${i+2}" for i, k in enumerate(dump.keys()))
            vals = list(dump.values())
            await conn.execute(
                f"UPDATE theme SET {sets}, updated_at = ${len(vals)+2} WHERE id = $1",
                existing["id"], *vals, now,
            )
        else:
            cols = ", ".join(dump.keys())
            placeholders = ", ".join(f"${i+1}" for i in range(len(dump)))
            await conn.execute(
                f"INSERT INTO theme ({cols}, updated_at) VALUES ({placeholders}, ${len(dump)+1})",
                *dump.values(), now,
            )
        row = await conn.fetchrow("SELECT * FROM theme LIMIT 1")
    return row_to_dict(row)


# --- Messages ---
@router.get("/messages")
async def list_messages():
    pool = await get_pool()
    async with pool.acquire() as conn:
        rows = await conn.fetch(
            "SELECT * FROM contact_messages ORDER BY created_at DESC"
        )
    return rows_to_list(rows)


@router.put("/messages/{id}/read")
async def mark_message_read(id: str):
    pool = await get_pool()
    async with pool.acquire() as conn:
        await conn.execute(
            "UPDATE contact_messages SET is_read = TRUE WHERE id = $1::uuid", id
        )
    return {"message": "Marked as read"}


@router.delete("/messages/{id}")
async def delete_message(id: str):
    pool = await get_pool()
    async with pool.acquire() as conn:
        result = await conn.execute(
            "DELETE FROM contact_messages WHERE id = $1::uuid", id
        )
    if result == "DELETE 0":
        raise HTTPException(status_code=404, detail="Message not found")
    return {"message": "Deleted successfully"}
