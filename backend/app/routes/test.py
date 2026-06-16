from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import Player, TestSession
from app.schemas.schemas import TestSessionResponse, TestSessionCreate
from app.middleware.auth import get_current_active_user, get_current_admin_user
from app.services.session import end_session, check_active_session

router = APIRouter()

@router.post("/start", response_model=TestSessionResponse)
def start_test(session_req: TestSessionCreate, db: Session = Depends(get_db), current_admin: Player = Depends(get_current_admin_user)):
    # Logic usually handled via scan, but manual start for admins
    from app.services.session import create_session
    try:
        session = create_session(db, str(session_req.player_id), session_req.device_id)
        return session
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/end/{session_id}", response_model=TestSessionResponse)
def end_test(session_id: str, db: Session = Depends(get_db), current_admin: Player = Depends(get_current_admin_user)):
    try:
        session = end_session(db, session_id)
        return session
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{session_id}", response_model=TestSessionResponse)
def get_session(session_id: str, db: Session = Depends(get_db), current_user: Player = Depends(get_current_active_user)):
    session = db.query(TestSession).filter(TestSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session
