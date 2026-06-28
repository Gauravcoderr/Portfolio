from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from datetime import datetime, timezone
from bson import ObjectId
from config.database import get_db
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


def doc_to_dict(doc) -> dict:
    if doc is None:
        return {}
    d = dict(doc)
    if "_id" in d:
        d["id"] = str(d.pop("_id"))
    return d


def docs_to_list(docs) -> list:
    return [doc_to_dict(d) for d in docs]


def to_oid(id: str):
    try:
        return ObjectId(id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid id")


# --- Profile ---
@router.put("/profile")
async def update_profile(data: ProfileUpdate):
    db = get_db()
    now = datetime.now(timezone.utc)
    dump = data.model_dump(exclude_none=True)
    if "social_links" in dump and dump["social_links"]:
        dump["social_links"] = dump["social_links"].model_dump() if hasattr(dump["social_links"], "model_dump") else dump["social_links"]
    dump["updated_at"] = now
    await db.profile.update_one({}, {"$set": dump}, upsert=True)
    doc = await db.profile.find_one({})
    return doc_to_dict(doc)


# --- Resume Upload (Supabase removed — use Cloudinary or manual URL) ---
@router.post("/resume/upload")
async def upload_resume(file: UploadFile = File(...)):
    raise HTTPException(status_code=501, detail="Resume upload not configured. Set resume_url directly via PUT /admin/profile.")


# --- Experience ---
@router.get("/experience")
async def list_experience():
    db = get_db()
    docs = await db.experience.find({}).sort("order", 1).to_list(None)
    return docs_to_list(docs)


@router.post("/experience")
async def create_experience(data: ExperienceCreate):
    db = get_db()
    now = datetime.now(timezone.utc)
    doc = data.model_dump()
    doc["created_at"] = now
    doc["updated_at"] = now
    result = await db.experience.insert_one(doc)
    created = await db.experience.find_one({"_id": result.inserted_id})
    return doc_to_dict(created)


@router.put("/experience/{id}")
async def update_experience(id: str, data: ExperienceUpdate):
    db = get_db()
    now = datetime.now(timezone.utc)
    dump = data.model_dump(exclude_none=True)
    dump["updated_at"] = now
    result = await db.experience.update_one({"_id": to_oid(id)}, {"$set": dump})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Experience not found")
    doc = await db.experience.find_one({"_id": to_oid(id)})
    return doc_to_dict(doc)


@router.delete("/experience/{id}")
async def delete_experience(id: str):
    db = get_db()
    result = await db.experience.delete_one({"_id": to_oid(id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Experience not found")
    return {"message": "Deleted successfully"}


# --- Projects ---
@router.get("/projects")
async def list_projects():
    db = get_db()
    docs = await db.projects.find({}).sort("order", 1).to_list(None)
    return docs_to_list(docs)


@router.post("/projects")
async def create_project(data: ProjectCreate):
    db = get_db()
    now = datetime.now(timezone.utc)
    doc = data.model_dump()
    doc["created_at"] = now
    doc["updated_at"] = now
    result = await db.projects.insert_one(doc)
    created = await db.projects.find_one({"_id": result.inserted_id})
    return doc_to_dict(created)


@router.put("/projects/{id}")
async def update_project(id: str, data: ProjectUpdate):
    db = get_db()
    now = datetime.now(timezone.utc)
    dump = data.model_dump(exclude_none=True)
    dump["updated_at"] = now
    result = await db.projects.update_one({"_id": to_oid(id)}, {"$set": dump})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Project not found")
    doc = await db.projects.find_one({"_id": to_oid(id)})
    return doc_to_dict(doc)


@router.delete("/projects/{id}")
async def delete_project(id: str):
    db = get_db()
    result = await db.projects.delete_one({"_id": to_oid(id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"message": "Deleted successfully"}


# --- Skills ---
@router.get("/skills")
async def list_skills():
    db = get_db()
    docs = await db.skills.find({}).sort("order", 1).to_list(None)
    return docs_to_list(docs)


@router.post("/skills")
async def create_skill_category(data: SkillCategoryCreate):
    db = get_db()
    now = datetime.now(timezone.utc)
    doc = {
        "category": data.category,
        "items": [i.model_dump() for i in data.items],
        "order": data.order,
        "created_at": now,
        "updated_at": now,
    }
    result = await db.skills.insert_one(doc)
    created = await db.skills.find_one({"_id": result.inserted_id})
    return doc_to_dict(created)


@router.put("/skills/{id}")
async def update_skill_category(id: str, data: SkillCategoryUpdate):
    db = get_db()
    now = datetime.now(timezone.utc)
    dump = data.model_dump(exclude_none=True)
    if "items" in dump:
        dump["items"] = [
            i.model_dump() if hasattr(i, "model_dump") else i
            for i in dump["items"]
        ]
    dump["updated_at"] = now
    result = await db.skills.update_one({"_id": to_oid(id)}, {"$set": dump})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Skill category not found")
    doc = await db.skills.find_one({"_id": to_oid(id)})
    return doc_to_dict(doc)


@router.delete("/skills/{id}")
async def delete_skill_category(id: str):
    db = get_db()
    result = await db.skills.delete_one({"_id": to_oid(id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Skill category not found")
    return {"message": "Deleted successfully"}


# --- Theme ---
@router.put("/theme")
async def update_theme(data: ThemeUpdate):
    db = get_db()
    now = datetime.now(timezone.utc)
    dump = data.model_dump(exclude_none=True)
    dump["updated_at"] = now
    await db.theme.update_one({}, {"$set": dump}, upsert=True)
    doc = await db.theme.find_one({})
    return doc_to_dict(doc)


# --- Messages ---
@router.get("/messages")
async def list_messages():
    db = get_db()
    docs = await db.contact_messages.find({}).sort("created_at", -1).to_list(None)
    return docs_to_list(docs)


@router.put("/messages/{id}/read")
async def mark_message_read(id: str):
    db = get_db()
    await db.contact_messages.update_one({"_id": to_oid(id)}, {"$set": {"is_read": True}})
    return {"message": "Marked as read"}


@router.delete("/messages/{id}")
async def delete_message(id: str):
    db = get_db()
    result = await db.contact_messages.delete_one({"_id": to_oid(id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Message not found")
    return {"message": "Deleted successfully"}
