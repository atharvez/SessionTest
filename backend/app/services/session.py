from sqlalchemy.orm import Session
from app.db.models import TestSession, SessionStatus
from datetime import datetime

def check_active_session(db: Session, player_id: str) -> TestSession:
    return db.query(TestSession).filter(
        TestSession.player_id == player_id,
        TestSession.status == SessionStatus.active
    ).first()

def create_session(db: Session, player_id: str, device_id: str) -> TestSession:
    # Check if there's already an active session
    active_session = check_active_session(db, player_id)
    if active_session:
        raise ValueError("Player already has an active session")
    
    new_session = TestSession(
        player_id=player_id,
        device_id=device_id,
        status=SessionStatus.active
    )
    db.add(new_session)
    db.commit()
    db.refresh(new_session)
    return new_session

def end_session(db: Session, session_id: str) -> TestSession:
    session = db.query(TestSession).filter(TestSession.id == session_id).first()
    if not session:
        raise ValueError("Session not found")
    
    if session.status != SessionStatus.active:
        raise ValueError("Session is not active")

    session.status = SessionStatus.completed
    session.ended_at = datetime.utcnow()
    db.commit()
    db.refresh(session)
    return session
