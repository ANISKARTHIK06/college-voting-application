from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime


# --- Sub-schemas ---
class PollOption(BaseModel):
    text: str


class PollOptionResponse(BaseModel):
    id: str = Field(alias="_id")
    text: str
    voteCount: int = 0

    class Config:
        populate_by_name = True


# --- Request Schemas ---
class PollCreate(BaseModel):
    title: str = Field(..., min_length=1)
    description: str = Field(..., min_length=1)
    type: str = Field(default="election", pattern="^(election|event|feedback|survey)$")
    options: List[PollOption] = Field(..., min_length=2)
    allowedRoles: List[str] = []
    endDate: datetime


class VoteRequest(BaseModel):
    optionId: str


# --- Response Schemas ---
class PollResponse(BaseModel):
    id: str = Field(alias="_id")
    title: str
    description: str
    type: str
    options: List[dict]
    createdBy: str
    allowedRoles: List[str]
    startDate: Optional[datetime] = None
    endDate: datetime
    isActive: bool
    voters: List[str] = []
    createdAt: Optional[datetime] = None
    updatedAt: Optional[datetime] = None

    class Config:
        populate_by_name = True
