# Portfolio

Personal developer portfolio for Gaurav Rauthan — built with a **FastAPI + PostgreSQL (Supabase)** backend and a **Next.js 14** frontend with a built-in admin CMS.

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| Backend | FastAPI (Python), asyncpg |
| Database | PostgreSQL via Supabase |
| Auth | JWT (admin only) |

## Features

- Dynamic portfolio sections: Hero, About, Experience, Projects, Skills, Contact
- Admin CMS at `/admin` — manage all content without touching code
- Runtime theme system — change accent color from the admin panel, updates site-wide instantly
- Contact form with messages stored in DB and viewable in admin

## Project Structure

```
portfolio/
├── backend/
│   ├── config/         # DB connection, settings
│   ├── middleware/     # JWT auth dependency
│   ├── models/         # Pydantic schemas
│   ├── routes/         # portfolio.py (public), auth.py, admin.py
│   ├── main.py         # FastAPI app entry point
│   ├── seed.py         # Seed initial data into Supabase
│   └── schema.sql      # Database schema — run in Supabase SQL Editor
└── frontend/
    └── src/
        ├── app/        # Pages: / and /admin/*
        ├── components/ # layout/, home/, admin/
        ├── context/    # ThemeContext.tsx
        ├── lib/        # api.ts, utils.ts
        └── types/      # index.ts
```

## Setup

### 1. Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Run `backend/schema.sql` in the Supabase SQL Editor

### 2. Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate       # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create `backend/.env`:

```env
DATABASE_URL=your_supabase_postgres_connection_string
JWT_SECRET=your_secret_key
ADMIN_USERNAME=admin
ADMIN_PASSWORD=yourpassword
```

Seed the database:

```bash
python seed.py
```

Start the server:

```bash
uvicorn main:app --reload --port 8000
```

### 3. Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

Start the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## API Routes

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/v1/portfolio` | — | All portfolio data |
| POST | `/api/v1/contact` | — | Submit contact message |
| POST | `/api/v1/auth/login` | — | Admin login → JWT |
| PUT | `/api/v1/admin/profile` | JWT | Update profile |
| CRUD | `/api/v1/admin/experience` | JWT | Experience entries |
| CRUD | `/api/v1/admin/projects` | JWT | Projects |
| CRUD | `/api/v1/admin/skills` | JWT | Skill categories |
| PUT | `/api/v1/admin/theme` | JWT | Accent color |
| GET/DELETE | `/api/v1/admin/messages` | JWT | Contact messages |

## Admin Panel

Navigate to `/admin/login` and sign in with the credentials from your `.env`.  
The JWT is stored in `localStorage` as `admin_token`.

## Theme System

The accent color is stored in the `theme` table. `ThemeContext` reads it on load and sets CSS custom properties (`--accent`, `--accent-light`, `--accent-dark`) on `<html>`. All accent-colored elements reference `var(--accent)`, so updating the color in the admin panel refreshes the entire site instantly — no redeploy needed.
