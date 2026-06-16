from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional, List, Dict, Any
from datetime import datetime
from uuid import UUID
from app.db.models import UserRole, PlayerStatus, SessionStatus

# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    id: Optional[str] = None
    role: Optional[str] = None

# Player Schemas
class PlayerBase(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None

class PlayerCreate(PlayerBase):
    password: str
    role: UserRole = UserRole.player

class PlayerResponse(PlayerBase):
    id: UUID
    qr_token: Optional[str] = None
    profile_image: Optional[str] = None
    role: UserRole
    status: PlayerStatus
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

# Auth Schemas
class UserLogin(BaseModel):
    email: EmailStr
    password: str

# Session Schemas
class TestSessionBase(BaseModel):
    device_id: Optional[str] = None

class TestSessionCreate(TestSessionBase):
    player_id: UUID

class TestSessionResponse(TestSessionBase):
    id: UUID
    player_id: UUID
    status: SessionStatus
    started_at: datetime
    ended_at: Optional[datetime] = None
    model_config = ConfigDict(from_attributes=True)

# Scan Schemas
class ScanRequest(BaseModel):
    qr_token: str
    device_id: Optional[str] = None

class ScanResponse(BaseModel):
    success: bool
    message: str
    player: Optional[PlayerResponse] = None
    session: Optional[TestSessionResponse] = None

# Result Schemas
class TestResultCreate(BaseModel):
    session_id: UUID
    score: float
    metrics: Optional[Dict[str, Any]] = None

class TestResultResponse(TestResultCreate):
    id: UUID
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)
