# Portfolio - CLAUDE.md

Developer portfolio for Gaurav Rauthan with a FastAPI + PostgreSQL (Supabase) backend and Next.js 14 frontend with an admin CMS.

## Project Structure

```
portfolio/
├── backend/          # FastAPI (Python) — PostgreSQL via asyncpg
│   ├── config/       # Database connection, settings
│   ├── middleware/   # JWT auth dependency
│   ├── models/       # Pydantic schemas
│   ├── routes/       # portfolio.py (public), auth.py, admin.py
│   ├── main.py       # FastAPI app, CORS, lifespan
│   ├── seed.py       # Seed all data into Supabase
│   └── schema.sql    # Run in Supabase SQL Editor first
└── frontend/         # Next.js 14 App Router — TypeScript + Tailwind
    └── src/
        ├── app/      # pages (/, /admin/*)
        ├── components/layout/, home/, admin/
        ├── context/ThemeContext.tsx
        ├── lib/api.ts, utils.ts
        └── types/index.ts
```

## Running Locally

```bash
# Backend
cd backend && source venv/bin/activate
uvicorn main:app --reload --port 8000

# Frontend
cd frontend && npm run dev
```

## Setup Order

1. Create a Supabase project at supabase.com
2. Run `backend/schema.sql` in the Supabase SQL Editor
3. Fill in `backend/.env` with your DATABASE_URL and JWT_SECRET
4. Run `python backend/seed.py` to populate the database
5. Start the backend and frontend

## Key Env Variables

**backend/.env**
- `DATABASE_URL` — Supabase PostgreSQL connection string
- `JWT_SECRET` — Secret for admin JWT tokens
- `ADMIN_USERNAME` / `ADMIN_PASSWORD` — Admin login credentials

**frontend/.env.local**
- `NEXT_PUBLIC_API_URL` — Backend URL (default: http://localhost:8000/api/v1)

## API Routes

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /api/v1/portfolio | No | All data (profile, experience, projects, skills, theme) |
| POST | /api/v1/contact | No | Submit contact message |
| POST | /api/v1/auth/login | No | Admin login → JWT |
| PUT | /api/v1/admin/profile | JWT | Update profile |
| CRUD | /api/v1/admin/experience | JWT | Experience entries |
| CRUD | /api/v1/admin/projects | JWT | Projects |
| CRUD | /api/v1/admin/skills | JWT | Skill categories |
| PUT | /api/v1/admin/theme | JWT | Theme color |
| GET/DELETE | /api/v1/admin/messages | JWT | Contact messages |

## Theme System

Accent color is stored in the `theme` table. On the frontend, `ThemeContext` reads it and sets `--accent`, `--accent-light`, `--accent-dark` CSS custom properties on `<html>`. All accent-colored elements use `var(--accent)` — changing the color in the admin panel updates the entire site at runtime.

## Admin Panel

URL: `/admin/login` — default credentials set in `.env`  
The JWT token is stored in `localStorage` as `admin_token`.
