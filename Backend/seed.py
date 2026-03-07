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
    await db.polls.delete_many({})
    print("Data Cleared...")

    # Create Users
    admin = {
        "_id": ObjectId(),
        "name": "System Admin",
        "email": "admin@test.com",
        "password": pwd_context.hash("password123"),
        "role": "admin",
    }

    student = {
        "_id": ObjectId(),
        "name": "John Student",
        "email": "student@test.com",
        "password": pwd_context.hash("password123"),
        "role": "student",
    }

    staff = {
        "_id": ObjectId(),
        "name": "Dr. Professor",
        "email": "staff@test.com",
        "password": pwd_context.hash("password123"),
        "role": "staff",
    }

    await db.users.insert_many([admin, student, staff])
    print("Users Created...")

    # Create Polls
    now = datetime.now(timezone.utc)
    polls = [
        {
            "_id": ObjectId(),
            "title": "Student Body President Election 2026",
            "description": "Vote for the next student body president. Choose wisely!",
            "type": "election",
            "options": [
                {"_id": ObjectId(), "text": "Candidate A - Changes for Better", "voteCount": 0},
                {"_id": ObjectId(), "text": "Candidate B - Innovation First", "voteCount": 0},
                {"_id": ObjectId(), "text": "Candidate C - Tradition & Values", "voteCount": 0},
            ],
            "createdBy": admin["_id"],
            "allowedRoles": ["student"],
            "startDate": now,
            "endDate": now + timedelta(days=7),
            "isActive": True,
            "voters": [],
            "createdAt": now,
            "updatedAt": now,
        },
        {
            "_id": ObjectId(),
            "title": "Annual Tech Fest Theme",
            "description": "What should be the theme for this year's tech fest?",
            "type": "event",
            "options": [
                {"_id": ObjectId(), "text": "AI & Future", "voteCount": 0},
                {"_id": ObjectId(), "text": "Cyberpunk 2077", "voteCount": 0},
                {"_id": ObjectId(), "text": "Sustainable Tech", "voteCount": 0},
            ],
            "createdBy": staff["_id"],
            "allowedRoles": ["student", "staff"],
            "startDate": now,
            "endDate": now + timedelta(days=3),
            "isActive": True,
            "voters": [],
            "createdAt": now,
            "updatedAt": now,
        },
        {
            "_id": ObjectId(),
            "title": "Cafeteria Feedback",
            "description": "How would you rate the new menu?",
            "type": "feedback",
            "options": [
                {"_id": ObjectId(), "text": "Excellent", "voteCount": 0},
                {"_id": ObjectId(), "text": "Good", "voteCount": 0},
                {"_id": ObjectId(), "text": "Needs Improvement", "voteCount": 0},
                {"_id": ObjectId(), "text": "Poor", "voteCount": 0},
            ],
            "createdBy": admin["_id"],
            "allowedRoles": [],
            "startDate": now,
            "endDate": now + timedelta(days=14),
            "isActive": True,
            "voters": [],
            "createdAt": now,
            "updatedAt": now,
        },
    ]

    await db.polls.insert_many(polls)
    print("Polls Created...")

    print("Data Imported Successfully!")
    client.close()


if __name__ == "__main__":
    asyncio.run(seed())
