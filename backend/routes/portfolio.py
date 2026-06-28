from fastapi import APIRouter
from config.database import get_db
from models.schemas import ContactMessageCreate
from datetime import datetime, timezone
from bson import ObjectId

router = APIRouter(prefix="/api/v1", tags=["portfolio"])


def doc_to_dict(doc) -> dict:
    if doc is None:
        return {}
    d = dict(doc)
    if "_id" in d:
        d["id"] = str(d.pop("_id"))
    return d


def docs_to_list(docs) -> list:
    return [doc_to_dict(d) for d in docs]


@router.get("/portfolio")
async def get_portfolio():
    db = get_db()
    profile = await db.profile.find_one({})
    experience = await db.experience.find({}).sort("order", 1).to_list(None)
    projects = await db.projects.find({}).sort("order", 1).to_list(None)
    skills = await db.skills.find({}).sort("order", 1).to_list(None)
    theme = await db.theme.find_one({})

    return {
        "profile": doc_to_dict(profile),
        "experience": docs_to_list(experience),
        "projects": docs_to_list(projects),
        "skills": docs_to_list(skills),
        "theme": doc_to_dict(theme),
    }


@router.post("/contact")
async def submit_contact(data: ContactMessageCreate):
    db = get_db()
    doc = {
        "name": data.name,
        "email": data.email,
        "message": data.message,
        "is_read": False,
        "created_at": datetime.now(timezone.utc),
    }
    result = await db.contact_messages.insert_one(doc)
    return {"id": str(result.inserted_id), "message": "Message sent successfully"}
