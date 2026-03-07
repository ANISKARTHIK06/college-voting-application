from fastapi import APIRouter, HTTPException, Depends
from app.database import get_db
from app.models.user import UserRegister, UserLogin, UserResponse, AuthResponse
from app.utils.security import hash_password, verify_password, create_access_token
from app.middleware.auth import get_current_user

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post("/register", response_model=AuthResponse)
async def register(user_data: UserRegister):
    """Register a new user."""
    db = get_db()

    # Check if user already exists
    existing = await db.users.find_one({"email": user_data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Hash password and create user
    user_doc = {
        "name": user_data.name,
        "email": user_data.email,
        "password": hash_password(user_data.password),
        "role": user_data.role,
    }

    result = await db.users.insert_one(user_doc)
    user_id = str(result.inserted_id)

    # Generate JWT token
    token = create_access_token({"id": user_id, "role": user_data.role})

    return AuthResponse(
        success=True,
        token=token,
        user=UserResponse(
            id=user_id,
            name=user_data.name,
            email=user_data.email,
            role=user_data.role,
        )
    )


@router.post("/login", response_model=AuthResponse)
async def login(credentials: UserLogin):
    """Login an existing user."""
    db = get_db()

    # Find user by email
    user = await db.users.find_one({"email": credentials.email})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Verify password
    if not verify_password(credentials.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    user_id = str(user["_id"])

    # Generate JWT token
    token = create_access_token({"id": user_id, "role": user["role"]})

    return AuthResponse(
        success=True,
        token=token,
        user=UserResponse(
            id=user_id,
            name=user["name"],
            email=user["email"],
            role=user["role"],
        )
    )


@router.get("/me")
async def get_me(user: dict = Depends(get_current_user)):
    """Get current logged in user."""
    return {
        "success": True,
        "data": {
            "id": user["_id"],
            "name": user["name"],
            "email": user["email"],
            "role": user["role"],
        }
    }
