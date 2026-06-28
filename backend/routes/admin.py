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
    db = await get_db()
    now = datetime.now(timezone.utc)
    dump = data.model_dump(exclude_none=True)
    if "social_links" in dump and dump["social_links"]:
        dump["social_links"] = dump["social_links"].model_dump() if hasattr(dump["social_links"], "model_dump") else dump["social_links"]
    dump["updated_at"] = now
    await db.profile.update_one({}, {"$set": dump}, upsert=True)
    doc = await db.profile.find_one({})
    return doc_to_dict(doc)


# --- Resume Upload (Cloudinary raw upload) ---
@router.post("/resume/upload")
async def upload_resume(file: UploadFile = File(...)):
    allowed = {"application/pdf", "application/msword",
               "application/vnd.openxmlformats-officedocument.wordprocessingml.document"}
    if file.content_type not in allowed:
        raise HTTPException(status_code=400, detail="Only PDF, DOC, or DOCX accepted")

    content = await file.read()
    filename = file.filename or "resume"

    import httpx
    async with httpx.AsyncClient(timeout=30) as client:
        resp = await client.post(
            "https://api.cloudinary.com/v1_1/dadulg5bs/raw/upload",
            data={"upload_preset": "Snkrs cart"},
            files={"file": (filename, content, file.content_type)},
        )

    if resp.status_code != 200:
        raise HTTPException(status_code=502, detail=f"Cloudinary upload failed: {resp.text}")

    url = resp.json().get("secure_url", "")
    return {"url": url}


# --- Experience ---
@router.get("/experience")
async def list_experience():
    db = await get_db()
    docs = await db.experience.find({}).sort("order", 1).to_list(None)
    return docs_to_list(docs)


@router.post("/experience")
async def create_experience(data: ExperienceCreate):
    db = await get_db()
    now = datetime.now(timezone.utc)
    doc = data.model_dump()
    doc["created_at"] = now
    doc["updated_at"] = now
    result = await db.experience.insert_one(doc)
    created = await db.experience.find_one({"_id": result.inserted_id})
    return doc_to_dict(created)


@router.put("/experience/{id}")
async def update_experience(id: str, data: ExperienceUpdate):
    db = await get_db()
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
    db = await get_db()
    result = await db.experience.delete_one({"_id": to_oid(id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Experience not found")
    return {"message": "Deleted successfully"}


# --- Projects ---
@router.get("/projects")
async def list_projects():
    db = await get_db()
    docs = await db.projects.find({}).sort("order", 1).to_list(None)
    return docs_to_list(docs)


@router.post("/projects")
async def create_project(data: ProjectCreate):
    db = await get_db()
    now = datetime.now(timezone.utc)
    doc = data.model_dump()
    doc["created_at"] = now
    doc["updated_at"] = now
    result = await db.projects.insert_one(doc)
    created = await db.projects.find_one({"_id": result.inserted_id})
    return doc_to_dict(created)


@router.put("/projects/{id}")
async def update_project(id: str, data: ProjectUpdate):
    db = await get_db()
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
    db = await get_db()
    result = await db.projects.delete_one({"_id": to_oid(id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"message": "Deleted successfully"}


# --- Skills ---
@router.get("/skills")
async def list_skills():
    db = await get_db()
    docs = await db.skills.find({}).sort("order", 1).to_list(None)
    return docs_to_list(docs)


@router.post("/skills")
async def create_skill_category(data: SkillCategoryCreate):
    db = await get_db()
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
    db = await get_db()
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
    db = await get_db()
    result = await db.skills.delete_one({"_id": to_oid(id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Skill category not found")
    return {"message": "Deleted successfully"}


# --- Theme ---
@router.put("/theme")
async def update_theme(data: ThemeUpdate):
    db = await get_db()
    now = datetime.now(timezone.utc)
    dump = data.model_dump(exclude_none=True)
    dump["updated_at"] = now
    await db.theme.update_one({}, {"$set": dump}, upsert=True)
    doc = await db.theme.find_one({})
    return doc_to_dict(doc)


# --- Messages ---
@router.get("/messages")
async def list_messages():
    db = await get_db()
    docs = await db.contact_messages.find({}).sort("created_at", -1).to_list(None)
    return docs_to_list(docs)


@router.put("/messages/{id}/read")
async def mark_message_read(id: str):
    db = await get_db()
    await db.contact_messages.update_one({"_id": to_oid(id)}, {"$set": {"is_read": True}})
    return {"message": "Marked as read"}


@router.delete("/messages/{id}")
async def delete_message(id: str):
    db = await get_db()
    result = await db.contact_messages.delete_one({"_id": to_oid(id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Message not found")
    return {"message": "Deleted successfully"}
