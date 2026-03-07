from fastapi import Request, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.utils.security import decode_access_token
from app.database import get_db
from bson import ObjectId

security = HTTPBearer()


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Extract and verify user from JWT token."""
    token = credentials.credentials
    payload = decode_access_token(token)

    if payload is None:
        raise HTTPException(status_code=401, detail="Not authorized to access this route")

    user_id = payload.get("id")
    if not user_id:
        raise HTTPException(status_code=401, detail="Not authorized to access this route")

    db = get_db()
    user = await db.users.find_one({"_id": ObjectId(user_id)})

    if not user:
        raise HTTPException(status_code=401, detail="Not authorized to access this route")

    # Convert ObjectId to string for convenience
    user["_id"] = str(user["_id"])
    return user


def authorize(*roles):
    """Dependency factory to restrict access by role."""
    async def role_checker(user: dict = Depends(get_current_user)):
        if user["role"] not in roles:
            raise HTTPException(
                status_code=403,
                detail=f"User role {user['role']} is not authorized to access this route"
            )
        return user
    return role_checker
