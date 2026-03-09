from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime


# --- Request Schemas ---
class UserRegister(BaseModel):
    name: str = Field(..., min_length=1)
    email: EmailStr
    password: str = Field(..., min_length=6)
    role: str = Field(default="user", pattern="^(admin|user)$")
    userType: str = Field(default="student", pattern="^(student|staff)$")
    department: Optional[str] = None
    position: Optional[str] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


# --- Response Schemas ---
class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    role: str
    userType: str
    department: Optional[str] = None
    position: Optional[str] = None


class AuthResponse(BaseModel):
    success: bool = True
    token: str
    user: UserResponse
