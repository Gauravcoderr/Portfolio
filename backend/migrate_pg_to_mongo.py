"""
One-time migration: Neon PostgreSQL → MongoDB Atlas (portfolio db)
Usage: python migrate_pg_to_mongo.py
"""
import asyncio
import json
from datetime import datetime, timezone
from motor.motor_asyncio import AsyncIOMotorClient
import asyncpg
from dotenv import load_dotenv
import os

load_dotenv()

PG_URL = os.getenv("DATABASE_URL", "")
MONGO_URI = os.getenv("MONGODB_URI", "")


def pg_row_to_dict(row) -> dict:
    d = dict(row)
    for k, v in d.items():
        if isinstance(v, str):
            try:
                parsed = json.loads(v)
                if isinstance(parsed, (list, dict)):
                    d[k] = parsed
            except (json.JSONDecodeError, TypeError):
                pass
    # drop uuid id — MongoDB will assign _id
    d.pop("id", None)
    return d


async def migrate():
    if not PG_URL or not MONGO_URI:
        print("ERROR: DATABASE_URL and MONGODB_URI must both be set in .env")
        return

    print("Connecting to Neon PostgreSQL...")
    try:
        pg = await asyncpg.create_pool(
            PG_URL.split("?")[0],
            min_size=1, max_size=3,
            statement_cache_size=0,
            ssl="require",
            timeout=10,
        )
    except Exception as e:
        print(f"FAILED to connect to Neon: {e}")
        print("Neon DB may be paused/deleted. Seed data already in MongoDB is current.")
        return

    print("Connecting to MongoDB...")
    client = AsyncIOMotorClient(MONGO_URI)
    db = client["portfolio"]

    async with pg.acquire() as conn:
        # --- profile ---
        profile_row = await conn.fetchrow("SELECT * FROM profile LIMIT 1")
        if profile_row:
            doc = pg_row_to_dict(profile_row)
            await db.profile.delete_many({})
            await db.profile.insert_one(doc)
            print(f"  profile: migrated (name={doc.get('name')})")
        else:
            print("  profile: empty in PG, skipping")

        # --- experience ---
        exp_rows = await conn.fetch('SELECT * FROM experience ORDER BY "order" ASC')
        if exp_rows:
            await db.experience.delete_many({})
            await db.experience.insert_many([pg_row_to_dict(r) for r in exp_rows])
            print(f"  experience: {len(exp_rows)} records migrated")
        else:
            print("  experience: empty in PG, skipping")

        # --- projects ---
        proj_rows = await conn.fetch('SELECT * FROM projects ORDER BY "order" ASC')
        if proj_rows:
            await db.projects.delete_many({})
            await db.projects.insert_many([pg_row_to_dict(r) for r in proj_rows])
            print(f"  projects: {len(proj_rows)} records migrated")
        else:
            print("  projects: empty in PG, skipping")

        # --- skills ---
        skill_rows = await conn.fetch('SELECT * FROM skills ORDER BY "order" ASC')
        if skill_rows:
            await db.skills.delete_many({})
            await db.skills.insert_many([pg_row_to_dict(r) for r in skill_rows])
            print(f"  skills: {len(skill_rows)} records migrated")
        else:
            print("  skills: empty in PG, skipping")

        # --- theme ---
        theme_row = await conn.fetchrow("SELECT * FROM theme LIMIT 1")
        if theme_row:
            doc = pg_row_to_dict(theme_row)
            await db.theme.delete_many({})
            await db.theme.insert_one(doc)
            print(f"  theme: migrated (accent={doc.get('accent_color')})")
        else:
            print("  theme: empty in PG, skipping")

        # --- contact_messages ---
        msg_rows = await conn.fetch("SELECT * FROM contact_messages ORDER BY created_at DESC")
        if msg_rows:
            await db.contact_messages.delete_many({})
            await db.contact_messages.insert_many([pg_row_to_dict(r) for r in msg_rows])
            print(f"  contact_messages: {len(msg_rows)} records migrated")
        else:
            print("  contact_messages: empty in PG, skipping")

    await pg.close()
    client.close()
    print("\nMigration complete.")


if __name__ == "__main__":
    asyncio.run(migrate())
