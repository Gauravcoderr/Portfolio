from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class SocialLinks(BaseModel):
    github: str = ""
    linkedin: str = ""
    twitter: str = ""
    email: str = ""


class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    title: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    bio: Optional[str] = None
    resume_url: Optional[str] = None
    avatar_url: Optional[str] = None
    social_links: Optional[SocialLinks] = None


class ExperienceCreate(BaseModel):
    company: str
    role: str
    location: str = ""
    start_date: str
    end_date: Optional[str] = None
    is_current: bool = False
    description: list[str] = []
    tech_stack: list[str] = []
    company_url: str = ""
    order: int = 0


class ExperienceUpdate(BaseModel):
    company: Optional[str] = None
    role: Optional[str] = None
    location: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    is_current: Optional[bool] = None
    description: Optional[list[str]] = None
    tech_stack: Optional[list[str]] = None
    company_url: Optional[str] = None
    order: Optional[int] = None


class ProjectCreate(BaseModel):
    title: str
    slug: str = ""
    description: str = ""
    bullets: list[str] = []
    image_url: str = ""
    live_url: str = ""
    github_url: str = ""
    tech_stack: list[str] = []
    category: str = "professional"
    is_featured: bool = False
    order: int = 0


class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    bullets: Optional[list[str]] = None
    image_url: Optional[str] = None
    live_url: Optional[str] = None
    github_url: Optional[str] = None
    tech_stack: Optional[list[str]] = None
    category: Optional[str] = None
    is_featured: Optional[bool] = None
    order: Optional[int] = None


class SkillItem(BaseModel):
    name: str
    proficiency: int = 80


class SkillCategoryCreate(BaseModel):
    category: str
    items: list[SkillItem] = []
    order: int = 0


class SkillCategoryUpdate(BaseModel):
    category: Optional[str] = None
    items: Optional[list[SkillItem]] = None
    order: Optional[int] = None


class ThemeUpdate(BaseModel):
    accent_color: Optional[str] = None
    accent_color_name: Optional[str] = None
    font_heading: Optional[str] = None
    font_body: Optional[str] = None


class ContactMessageCreate(BaseModel):
    name: str
    email: str
    message: str


class AdminLogin(BaseModel):
    username: str
    password: str
