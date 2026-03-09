import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from datetime import datetime, timedelta, timezone
from dotenv import load_dotenv
import os

load_dotenv()

# Password hashing (using passlib)
from passlib.context import CryptContext
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

MONGO_URI = os.getenv("MONGO_URI", "mongodb://127.0.0.1:27017")
DB_NAME = os.getenv("DB_NAME", "college_voting_db")


async def seed():
    client = AsyncIOMotorClient(MONGO_URI)
    db = client[DB_NAME]

    # Clear existing data
    await db.users.delete_many({})
    await db.votes.delete_many({})
    await db.votescast.delete_many({})
    print("Data Cleared...")

    # ── Users ──────────────────────────────────────────────────────────
    # Admin: a staff member (e.g. Election Coordinator)
    admin = {
        "_id": ObjectId(),
        "name": "System Admin",
        "email": "admin@test.com",
        "password": pwd_context.hash("password123"),
        "role": "admin",
        "userType": "staff",
        "department": "Administration",
        "position": "Election Coordinator",
        "createdAt": datetime.now(timezone.utc),
    }

    # Admin: a student representative (e.g. Class Representative)
    cr_admin = {
        "_id": ObjectId(),
        "name": "Alice CR",
        "email": "cr@test.com",
        "password": pwd_context.hash("password123"),
        "role": "admin",
        "userType": "student",
        "department": "Computer Science",
        "position": "Class Representative",
        "createdAt": datetime.now(timezone.utc),
    }

    # Regular user – student
    student_user = {
        "_id": ObjectId(),
        "name": "John Student",
        "email": "student@test.com",
        "password": pwd_context.hash("password123"),
        "role": "user",
        "userType": "student",
        "department": "Computer Science",
        "position": "3rd Year",
        "createdAt": datetime.now(timezone.utc),
    }

    # Regular user – staff
    staff_user = {
        "_id": ObjectId(),
        "name": "Dr. Professor",
        "email": "staff@test.com",
        "password": pwd_context.hash("password123"),
        "role": "user",
        "userType": "staff",
        "department": "Computer Science",
        "position": "Professor",
        "createdAt": datetime.now(timezone.utc),
    }

    await db.users.insert_many([admin, cr_admin, student_user, staff_user])
    print("Users Created...")

    # ── Votes ───────────────────────────────────────────────────────────
    now = datetime.now(timezone.utc)
    votes = [
        {
            "_id": ObjectId(),
            "title": "Student Body President Election 2026",
            "description": "Vote for the next student body president. Choose wisely!",
            "createdBy": admin["_id"],
            "votingType": "Election",
            "candidates": [
                {"name": "Candidate A", "description": "Changes for Better", "image": ""},
                {"name": "Candidate B", "description": "Innovation First", "image": ""},
                {"name": "Candidate C", "description": "Tradition & Values", "image": ""},
            ],
            "eligibleGroup": "All Users",
            "eligibleValues": [],
            "startTime": now,
            "endTime": now + timedelta(days=7),
            "status": "active",
            "createdAt": now,
        },
        {
            "_id": ObjectId(),
            "title": "Annual Tech Fest Theme",
            "description": "What should be the theme for this year's tech fest?",
            "createdBy": cr_admin["_id"],
            "votingType": "Approval",
            "candidates": [
                {"name": "AI & Future", "description": "", "image": ""},
                {"name": "Cyberpunk 2077", "description": "", "image": ""},
                {"name": "Sustainable Tech", "description": "", "image": ""},
            ],
            "eligibleGroup": "Department",
            "eligibleValues": ["Computer Science"],
            "startTime": now,
            "endTime": now + timedelta(days=3),
            "status": "active",
            "createdAt": now,
        },
        {
            "_id": ObjectId(),
            "title": "Cafeteria Feedback",
            "description": "How would you rate the new menu?",
            "createdBy": admin["_id"],
            "votingType": "Approval",
            "candidates": [
                {"name": "Excellent", "description": "", "image": ""},
                {"name": "Good", "description": "", "image": ""},
                {"name": "Needs Improvement", "description": "", "image": ""},
                {"name": "Poor", "description": "", "image": ""},
            ],
            "eligibleGroup": "All Users",
            "eligibleValues": [],
            "startTime": now,
            "endTime": now + timedelta(days=14),
            "status": "active",
            "createdAt": now,
        },
    ]

    await db.votes.insert_many(votes)
    print("Votes Created...")

    print("Data Imported Successfully!")
    client.close()


if __name__ == "__main__":
    asyncio.run(seed())

