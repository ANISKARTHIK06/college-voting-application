from fastapi import APIRouter, HTTPException, Depends
from app.database import get_db
from app.models.poll import PollCreate, VoteRequest
from app.middleware.auth import get_current_user, authorize
from bson import ObjectId
from datetime import datetime, timezone

router = APIRouter(prefix="/api/polls", tags=["Polls"])


def serialize_poll(poll: dict) -> dict:
    """Convert MongoDB poll document to JSON-serializable format."""
    poll["_id"] = str(poll["_id"])
    poll["createdBy"] = str(poll["createdBy"])
    poll["voters"] = [str(v) for v in poll.get("voters", [])]
    for opt in poll.get("options", []):
        opt["_id"] = str(opt["_id"])
    return poll


@router.get("")
async def get_polls(user: dict = Depends(get_current_user)):
    """Get all active polls filtered by user role."""
    db = get_db()
    user_role = user["role"]

    query = {"isActive": True}

    if user_role != "admin":
        query["$or"] = [
            {"allowedRoles": user_role},
            {"allowedRoles": {"$size": 0}},
        ]

    polls = await db.polls.find(query).sort("createdAt", -1).to_list(100)
    serialized = [serialize_poll(p) for p in polls]

    return {"success": True, "count": len(serialized), "data": serialized}


@router.post("")
async def create_poll(poll_data: PollCreate, user: dict = Depends(authorize("admin", "staff"))):
    """Create a new poll (Admin/Staff only)."""
    db = get_db()

    options = []
    for opt in poll_data.options:
        options.append({
            "_id": ObjectId(),
            "text": opt.text,
            "voteCount": 0,
        })

    poll_doc = {
        "title": poll_data.title,
        "description": poll_data.description,
        "type": poll_data.type,
        "options": options,
        "createdBy": ObjectId(user["_id"]),
        "allowedRoles": poll_data.allowedRoles,
        "startDate": datetime.now(timezone.utc),
        "endDate": poll_data.endDate,
        "isActive": True,
        "voters": [],
        "createdAt": datetime.now(timezone.utc),
        "updatedAt": datetime.now(timezone.utc),
    }

    result = await db.polls.insert_one(poll_doc)
    poll_doc["_id"] = result.inserted_id

    return {"success": True, "data": serialize_poll(poll_doc)}


@router.get("/{poll_id}")
async def get_poll(poll_id: str, user: dict = Depends(get_current_user)):
    """Get a single poll by ID."""
    db = get_db()

    try:
        poll = await db.polls.find_one({"_id": ObjectId(poll_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid poll ID")

    if not poll:
        raise HTTPException(status_code=404, detail="Poll not found")

    return {"success": True, "data": serialize_poll(poll)}


@router.post("/{poll_id}/vote")
async def vote(poll_id: str, vote_data: VoteRequest, user: dict = Depends(get_current_user)):
    """Vote on a poll."""
    db = get_db()

    try:
        poll = await db.polls.find_one({"_id": ObjectId(poll_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid poll ID")

    if not poll:
        raise HTTPException(status_code=404, detail="Poll not found")

    # Check if poll is active
    if not poll["isActive"] or datetime.now(timezone.utc) > poll["endDate"]:
        raise HTTPException(status_code=400, detail="This poll is closed")

    # Check if user already voted
    user_oid = ObjectId(user["_id"])
    if user_oid in poll.get("voters", []):
        raise HTTPException(status_code=400, detail="You have already voted")

    # Check allowed roles
    allowed = poll.get("allowedRoles", [])
    if len(allowed) > 0 and user["role"] not in allowed:
        raise HTTPException(status_code=403, detail="Not authorized to vote in this poll")

    # Find option and increment vote count
    option_found = False
    for opt in poll["options"]:
        if str(opt["_id"]) == vote_data.optionId:
            opt["voteCount"] = opt.get("voteCount", 0) + 1
            option_found = True
            break

    if not option_found:
        raise HTTPException(status_code=400, detail="Invalid option")

    # Update poll in database
    await db.polls.update_one(
        {"_id": ObjectId(poll_id)},
        {
            "$set": {"options": poll["options"]},
            "$push": {"voters": user_oid},
        }
    )

    # Fetch updated poll
    updated = await db.polls.find_one({"_id": ObjectId(poll_id)})
    return {"success": True, "data": serialize_poll(updated)}


@router.delete("/{poll_id}")
async def delete_poll(poll_id: str, user: dict = Depends(authorize("admin"))):
    """Delete a poll (Admin only)."""
    db = get_db()

    try:
        poll = await db.polls.find_one({"_id": ObjectId(poll_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid poll ID")

    if not poll:
        raise HTTPException(status_code=404, detail="Poll not found")

    await db.polls.delete_one({"_id": ObjectId(poll_id)})

    return {"success": True, "data": {}}
