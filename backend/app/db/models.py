import enum
from sqlalchemy import Column, String, Boolean, ForeignKey, DateTime, Enum, Numeric, Text, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid

from .database import Base

class UserRole(str, enum.Enum):
    admin = "admin"
    player = "player"

class SessionStatus(str, enum.Enum):
    active = "active"
    completed = "completed"
    terminated = "terminated"

class PlayerStatus(str, enum.Enum):
    active = "active"
    suspended = "suspended"
    inactive = "inactive"

class Player(Base):
    __tablename__ = "players"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    phone = Column(String(50))
    qr_token = Column(String(255), unique=True, index=True)
    profile_image = Column(Text)
    role = Column(Enum(UserRole), default=UserRole.player, nullable=False)
    status = Column(Enum(PlayerStatus), default=PlayerStatus.active, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    sessions = relationship("TestSession", back_populates="player", cascade="all, delete-orphan")
    scan_logs = relationship("ScanLog", back_populates="player")

class TestSession(Base):
    __tablename__ = "test_sessions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    player_id = Column(UUID(as_uuid=True), ForeignKey("players.id", ondelete="CASCADE"), nullable=False)
    status = Column(Enum(SessionStatus), default=SessionStatus.active, nullable=False)
    device_id = Column(String(255))
    started_at = Column(DateTime(timezone=True), server_default=func.now())
    ended_at = Column(DateTime(timezone=True))

    player = relationship("Player", back_populates="sessions")
    results = relationship("TestResult", back_populates="session", cascade="all, delete-orphan")

class ScanLog(Base):
    __tablename__ = "scan_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    player_id = Column(UUID(as_uuid=True), ForeignKey("players.id", ondelete="SET NULL"))
    device_id = Column(String(255))
    ip_address = Column(String(45))
    success = Column(Boolean, nullable=False)
    reason = Column(Text)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

    player = relationship("Player", back_populates="scan_logs")

class TestResult(Base):
    __tablename__ = "test_results"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id = Column(UUID(as_uuid=True), ForeignKey("test_sessions.id", ondelete="CASCADE"), nullable=False)
    score = Column(Numeric(10, 2))
    metrics = Column(JSON)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    session = relationship("TestSession", back_populates="results")
