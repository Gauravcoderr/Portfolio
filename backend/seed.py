"""
Run this AFTER running schema.sql in your Supabase SQL Editor.
Usage: python seed.py
"""
import asyncio
import asyncpg
import json
from datetime import datetime, timezone
from passlib.context import CryptContext
from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "")
ADMIN_USERNAME = os.getenv("ADMIN_USERNAME", "admin")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "admin@123")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
now = datetime.now(timezone.utc)


async def seed():
    if not DATABASE_URL or "YOUR-PASSWORD" in DATABASE_URL:
        print("ERROR: Set DATABASE_URL in .env with your actual Supabase password first.")
        return

    conn = await asyncpg.connect(DATABASE_URL, statement_cache_size=0)

    print("Clearing existing data...")
    for table in ["profile", "experience", "projects", "skills", "theme",
                  "contact_messages", "admin_users"]:
        await conn.execute(f"DELETE FROM {table}")

    print("Seeding profile...")
    await conn.execute(
        """
        INSERT INTO profile
          (name, title, email, phone, location, bio, resume_url, avatar_url, social_links, updated_at)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
        """,
        "Gaurav Rauthan",
        "Frontend Developer | React.js | Next.js | TypeScript | JavaScript | GenAI",
        "gauravrauthan12112@gmail.com",
        "+91-9759784091",
        "Dwarka, Delhi",
        "Results-driven Frontend Developer with 3+ years of experience designing and optimizing high-performance, scalable web applications using React.js, Next.js, React Query, and Redux. Experienced in building Generative AI-powered features including conversational chatbots and intelligent resume parsing systems. Skilled in implementing SSR, CI/CD, and responsive UI architectures for business-critical platforms.",
        "",
        "",
        json.dumps({
            "github": "https://github.com/Gauravcoderr",
            "linkedin": "https://linkedin.com/in/gaurav-rauthan-b96aa3227",
            "twitter": "",
            "email": "gauravrauthan12112@gmail.com",
        }),
        now,
    )

    print("Seeding experience...")
    experiences = [
        {
            "company": "EMB Global",
            "role": "Frontend Developer (SDE-1)",
            "location": "Gurugram",
            "start_date": "June 2025",
            "end_date": None,
            "is_current": True,
            "description": [
                "Built and maintained 5 interconnected platforms — EMBTalent (embtalent.ai), Artha (artha.emb.global), and the RA Tool suite (Client Portal, Admin Dashboard, Vendor Portal) — using Next.js 15, React 19, React Query, Tailwind CSS, and Radix UI.",
                "Architected a GenAI-powered conversational chatbot in EMBTalent that captures client hiring requirements through natural AI dialogue, replacing static forms and reducing requirement submission time by 60%.",
                "Built AI-driven resume extraction powered by Claude Opus that parses and structures full candidate profiles (skills, experience, education) in under 2 minutes, down from 10+ minutes manually.",
                "Developed the RA Tool multi-portal recruitment platform: Client portal with drag-and-drop candidate pipelines; Admin dashboard with a 19-state candidate lifecycle, vendor vetting, and contract management; Vendor portal for bench profile management, receiving requirements, and submitting matching candidates.",
                "Built the Artha financial management platform with Role & Access Control, Currency Management, PI/CI workflows, Milestone Generation modules, and Razorpay payment integration — reducing manual onboarding effort by 45%.",
                "Integrated Intervue.io for skill-based assessments, Firebase Cloud Messaging for real-time push notifications, and Mixpanel for analytics across portals.",
                "Improved platform SEO, Lighthouse performance scores, and Core Web Vitals across all products.",
            ],
            "tech_stack": ["Next.js 15", "React 19", "React Query", "TypeScript", "Tailwind CSS", "Radix UI", "Redux", "Generative AI", "dnd-kit", "Razorpay"],
            "company_url": "https://emb.global",
            "order": 0,
        },
        {
            "company": "Peregrine IT Solutions",
            "role": "Frontend Developer",
            "location": "Noida",
            "start_date": "February 2024",
            "end_date": "June 2025",
            "is_current": False,
            "description": [
                "Built the Torrins music e-learning platform (torrins.com) — an online music education site with structured video lessons for Guitar, Piano, Bass, and Drums, serving 2,464+ active learners across 75+ countries with 10,000+ video lessons and 1,000+ song tutorials.",
                "Architected responsive applications using Next.js, React.js, Redux, and Bootstrap, achieving a 35% improvement in page load efficiency.",
                "Implemented personalized learning paths, course progression tracking, multi-angle video lessons, and subscription-based access.",
                "Collaborated with designers and backend engineers to ship 10+ production-grade applications under tight deadlines.",
                "Boosted rendering speed via memoization and dynamic imports, eliminating redundant re-renders across key modules.",
            ],
            "tech_stack": ["Next.js", "React.js", "Redux", "Bootstrap", "Material UI", "JavaScript"],
            "company_url": "https://www.torrins.com",
            "order": 1,
        },
        {
            "company": "Ahom Technologies",
            "role": "Frontend Developer",
            "location": "Gurugram",
            "start_date": "January 2023",
            "end_date": "February 2024",
            "is_current": False,
            "description": [
                "Developed the frontend for the StarQuik online grocery delivery platform (starquik.com) — a client site for same-day delivery of groceries, fresh produce, dairy, and household essentials with location-based delivery slots, category navigation, and promotional banners.",
                "Revamped enterprise UI systems with React.js and Next.js, achieving a 40% improvement in page responsiveness.",
                "Consumed and streamlined RESTful API integrations, reducing fetch latency by 30% and enhancing platform reliability.",
                "Drove agile sprint delivery, conducted code reviews, and introduced reusable component architecture to accelerate development by 20%.",
            ],
            "tech_stack": ["React.js", "Next.js", "HTML5", "CSS3", "JavaScript", "PHP (Blade)", "RESTful APIs"],
            "company_url": "https://www.starquik.com",
            "order": 2,
        },
        {
            "company": "Zucol Group",
            "role": "Frontend Developer Intern",
            "location": "Gurugram",
            "start_date": "October 2022",
            "end_date": "December 2022",
            "is_current": False,
            "description": [
                "Modernized legacy web interfaces using React.js and Bootstrap, increasing user engagement by 35%.",
            ],
            "tech_stack": ["React.js", "Bootstrap", "JavaScript", "HTML5", "CSS3"],
            "company_url": "",
            "order": 3,
        },
    ]

    for exp in experiences:
        await conn.execute(
            """
            INSERT INTO experience
              (company, role, location, start_date, end_date, is_current,
               description, tech_stack, company_url, "order", created_at, updated_at)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$11)
            """,
            exp["company"], exp["role"], exp["location"], exp["start_date"],
            exp.get("end_date"), exp["is_current"],
            json.dumps(exp["description"]), json.dumps(exp["tech_stack"]),
            exp["company_url"], exp["order"], now,
        )

    print("Seeding projects...")
    projects = [
        {
            "title": "EMBTalent", "slug": "embtalent",
            "description": "AI-powered B2B talent acquisition platform where companies post hiring requirements via a conversational AI chatbot powered by Claude Opus, and recruiters manage candidates through a drag-and-drop pipeline board.",
            "bullets": [
                "Conversational AI chatbot for client hiring requirements, reducing submission time by 60%.",
                "GenAI resume extraction parsing full candidate profiles in under 2 minutes (80% reduction from manual).",
                "Drag-and-drop candidate pipeline board with stages: Interview, Assignment, On Hold, and Rejected.",
                "Intervue.io skill-based assessments with detailed candidate performance reports.",
                "Client assignment flow for task evaluation before final hiring decisions.",
            ],
            "live_url": "https://embtalent.ai", "github_url": "",
            "tech_stack": ["Next.js 15", "React 19", "React Query", "Tailwind CSS", "Radix UI", "Generative AI", "Claude Opus", "dnd-kit", "Zod"],
            "category": "professional", "is_featured": True, "order": 0,
        },
        {
            "title": "Artha Platform", "slug": "artha-platform",
            "description": "Financial and project management platform for EMB Global with Role & Access Control, Currency Management, PI/CI workflows, and Milestone Generation.",
            "bullets": [
                "Reduced manual onboarding effort by 45% with RBAC, Currency Management, PI/CI workflows, and Milestone Generation modules.",
                "Integrated Razorpay for automated payment processing, cutting reconciliation time by 30%.",
                "Enhanced SSR and caching strategies, improving performance and load times across all devices.",
            ],
            "live_url": "https://artha.emb.global", "github_url": "",
            "tech_stack": ["Next.js", "React Query", "TypeScript", "Redux", "Tailwind CSS", "Radix UI", "Razorpay API"],
            "category": "professional", "is_featured": True, "order": 1,
        },
        {
            "title": "RA Tool - Recruitment Platform", "slug": "ra-tool",
            "description": "Multi-portal B2B recruitment SaaS connecting employers, recruiters, and vendor agencies through 3 dedicated dashboards — Client Portal, Admin Dashboard, and Vendor Portal.",
            "bullets": [
                "Client Portal: Full requirement management with custom templates, JD upload with AI extraction, and EMBTalent chatbot. Drag-and-drop candidate pipeline with shortlisting, interviews, assignments, and offers.",
                "Admin Dashboard: 19-state candidate lifecycle, vendor vetting & approval, contract management, JD converter, and currency rate management.",
                "Vendor Portal: Multi-step onboarding, bench profile management, receiving requirements from admin, and submitting matching candidates.",
            ],
            "live_url": "", "github_url": "",
            "tech_stack": ["Next.js 15", "React 19", "React Query", "Tailwind CSS", "Radix UI", "shadcn/ui", "React Hook Form", "Zod", "dnd-kit", "Framer Motion", "Mixpanel"],
            "category": "professional", "is_featured": True, "order": 2,
        },
        {
            "title": "Torrins", "slug": "torrins",
            "description": "Online music e-learning platform offering structured instructor-led video courses for Guitar, Piano, Bass, and Drums — serving 2,464+ active learners across 75+ countries.",
            "bullets": [
                "10,000+ video lessons and 1,000+ song tutorials in multiple languages.",
                "Personalized learning paths with 25+ professional instructors and multi-angle video production.",
                "Flexible subscription plans (₹1,150/month or ₹750/month annually) with progress tracking.",
            ],
            "live_url": "https://www.torrins.com", "github_url": "",
            "tech_stack": ["Next.js", "React.js", "Redux", "Bootstrap", "Material UI"],
            "category": "professional", "is_featured": False, "order": 3,
        },
        {
            "title": "StarQuik", "slug": "starquik",
            "description": "Online grocery and retail delivery platform offering same-day delivery of fresh produce, groceries, dairy, and household essentials.",
            "bullets": [
                "Location-based delivery slot selection with real-time availability tracking.",
                "Category-based navigation, rotating promotional banners, and mobile-responsive design.",
            ],
            "live_url": "https://www.starquik.com", "github_url": "",
            "tech_stack": ["HTML5", "CSS3", "JavaScript", "PHP (Blade)"],
            "category": "professional", "is_featured": False, "order": 4,
        },
        {
            "title": "SNKRS Cart", "slug": "snkrs-cart",
            "description": "Full-stack premium sneaker e-commerce platform featuring an AI-powered KickBot shopping assistant with dual-language support and automatic lead capture.",
            "bullets": [
                "AI-powered KickBot chatbot (Gemini 2.0 Flash + Groq fallback) with English + Hinglish support and prompt injection detection.",
                "Comprehensive admin panel: products, orders, users, reviews, blogs (TipTap editor), banners, sellers, chat leads.",
                "OTP-based customer auth + separate admin auth, multi-filter browsing, wishlist, order tracking, and restock alerts.",
                "Newsletter system, seller/consignment program, and Google Shopping RSS feed across 5 brands.",
            ],
            "live_url": "https://snkrs-kart.vercel.app",
            "github_url": "https://github.com/Gauravcoderr",
            "tech_stack": ["Next.js 14", "TypeScript", "Tailwind CSS", "React Query", "Node.js", "Express", "MongoDB", "Gemini AI", "Groq", "Cloudinary", "JWT"],
            "category": "personal", "is_featured": True, "order": 5,
        },
        {
            "title": "SneakerAuth", "slug": "sneakerauth",
            "description": "AI-powered sneaker authentication service where users upload guided photos and Google Gemini Vision analyzes 50+ checkpoints to determine authenticity.",
            "bullets": [
                "Guided photo capture with SVG ghost overlays for 8 angles (lateral, medial, top-down, heel, sole, tongue, toe box, box label).",
                "12 analysis categories with 50+ checkpoints including stitching density, logo proportions, sole patterns, and serial number format.",
                "Freemium model: 3 free checks/day without login, email OTP auth, 8 major brands supported.",
                "Background async processing with frontend polling, per-check confidence scores, and PWA support.",
            ],
            "live_url": "https://shoe-auth.vercel.app",
            "github_url": "https://github.com/Gauravcoderr",
            "tech_stack": ["Next.js 14", "TypeScript", "Tailwind CSS", "React Query", "FastAPI", "Python", "MongoDB", "Google Gemini", "Cloudinary", "JWT", "PWA"],
            "category": "personal", "is_featured": True, "order": 6,
        },
        {
            "title": "Portfolio", "slug": "portfolio",
            "description": "Open-source developer portfolio with FastAPI backend, PostgreSQL (Supabase) data store, admin CMS, theme customization, and resume management.",
            "bullets": [
                "Fully editable portfolio via admin panel with CRUD for all content sections.",
                "Runtime theme color customization with preset palettes and live preview.",
                "Resume upload and contact form with admin message management.",
            ],
            "live_url": "", "github_url": "https://github.com/Gauravcoderr",
            "tech_stack": ["Next.js 14", "TypeScript", "Tailwind CSS", "FastAPI", "PostgreSQL", "Supabase"],
            "category": "personal", "is_featured": False, "order": 7,
        },
    ]

    for proj in projects:
        await conn.execute(
            """
            INSERT INTO projects
              (title, slug, description, bullets, image_url, live_url, github_url,
               tech_stack, category, is_featured, "order", created_at, updated_at)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$12)
            """,
            proj["title"], proj["slug"], proj["description"],
            json.dumps(proj["bullets"]), "",
            proj["live_url"], proj["github_url"],
            json.dumps(proj["tech_stack"]),
            proj["category"], proj["is_featured"], proj["order"], now,
        )

    print("Seeding skills...")
    skills = [
        {
            "category": "Frontend",
            "items": [
                {"name": "React.js", "proficiency": 95}, {"name": "Next.js", "proficiency": 95},
                {"name": "TypeScript", "proficiency": 90}, {"name": "JavaScript (ES6+)", "proficiency": 95},
                {"name": "Redux", "proficiency": 85}, {"name": "React Query", "proficiency": 90},
                {"name": "Tailwind CSS", "proficiency": 95}, {"name": "HTML5", "proficiency": 95},
                {"name": "CSS3", "proficiency": 95}, {"name": "SCSS", "proficiency": 85},
                {"name": "Bootstrap", "proficiency": 85}, {"name": "Material UI", "proficiency": 80},
                {"name": "Radix UI", "proficiency": 90}, {"name": "shadcn/ui", "proficiency": 90},
                {"name": "React Hook Form", "proficiency": 85}, {"name": "Framer Motion", "proficiency": 80},
                {"name": "dnd-kit", "proficiency": 85},
            ],
            "order": 0,
        },
        {
            "category": "AI / GenAI",
            "items": [
                {"name": "Generative AI", "proficiency": 85}, {"name": "LLM Integration", "proficiency": 85},
                {"name": "Conversational AI", "proficiency": 85}, {"name": "AI-powered Resume Parsing", "proficiency": 80},
                {"name": "Prompt Engineering", "proficiency": 85}, {"name": "Google Gemini", "proficiency": 85},
                {"name": "Claude API", "proficiency": 80}, {"name": "Groq", "proficiency": 75},
            ],
            "order": 1,
        },
        {
            "category": "Backend & DevOps",
            "items": [
                {"name": "Node.js", "proficiency": 80}, {"name": "Express.js", "proficiency": 80},
                {"name": "FastAPI", "proficiency": 75}, {"name": "Python", "proficiency": 75},
                {"name": "Firebase", "proficiency": 80}, {"name": "MongoDB", "proficiency": 85},
                {"name": "PostgreSQL", "proficiency": 70}, {"name": "RESTful APIs", "proficiency": 90},
                {"name": "JWT Authentication", "proficiency": 85}, {"name": "Razorpay", "proficiency": 75},
                {"name": "Git", "proficiency": 90}, {"name": "Bitbucket", "proficiency": 80},
                {"name": "Vercel", "proficiency": 90}, {"name": "Render", "proficiency": 80},
                {"name": "GitHub Actions", "proficiency": 75}, {"name": "Cloudinary", "proficiency": 80},
                {"name": "Supabase", "proficiency": 75},
            ],
            "order": 2,
        },
        {
            "category": "Other",
            "items": [
                {"name": "Responsive Web Design", "proficiency": 95}, {"name": "Web Accessibility", "proficiency": 85},
                {"name": "Cross-device Compatibility", "proficiency": 90}, {"name": "SEO Optimization", "proficiency": 85},
                {"name": "Core Web Vitals", "proficiency": 85}, {"name": "Agile/Scrum", "proficiency": 85},
                {"name": "CI/CD", "proficiency": 80}, {"name": "Mixpanel Analytics", "proficiency": 75},
                {"name": "PWA", "proficiency": 75},
            ],
            "order": 3,
        },
    ]

    for skill in skills:
        await conn.execute(
            'INSERT INTO skills (category, items, "order", created_at, updated_at) VALUES ($1,$2,$3,$4,$4)',
            skill["category"], json.dumps(skill["items"]), skill["order"], now,
        )

    print("Seeding theme...")
    await conn.execute(
        "INSERT INTO theme (accent_color, accent_color_name, font_heading, font_body, updated_at) VALUES ($1,$2,$3,$4,$5)",
        "#6366f1", "Indigo", "Inter", "Inter", now,
    )

    print("Seeding admin user...")
    await conn.execute(
        "INSERT INTO admin_users (username, password_hash, created_at) VALUES ($1, $2, $3)",
        ADMIN_USERNAME,
        pwd_context.hash(ADMIN_PASSWORD),
        now,
    )

    await conn.close()
    print("\nSeed completed successfully!")
    print(f"Admin login → username: {ADMIN_USERNAME} | password: {ADMIN_PASSWORD}")


if __name__ == "__main__":
    asyncio.run(seed())
