from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import Player, TestSession
from app.schemas.schemas import PlayerResponse, TestSessionResponse
from app.middleware.auth import get_current_admin_user
from typing import List

router = APIRouter()

@router.get("/players", response_model=List[PlayerResponse])
def get_all_players(db: Session = Depends(get_db), current_admin: Player = Depends(get_current_admin_user)):
    players = db.query(Player).filter(Player.role == "player").all()
    return players

@router.get("/sessions", response_model=List[TestSessionResponse])
def get_all_sessions(db: Session = Depends(get_db), current_admin: Player = Depends(get_current_admin_user)):
    sessions = db.query(TestSession).order_by(TestSession.started_at.desc()).all()
    return sessions

@router.post("/revoke-qr/{player_id}")
def revoke_qr(player_id: str, db: Session = Depends(get_db), current_admin: Player = Depends(get_current_admin_user)):
    player = db.query(Player).filter(Player.id == player_id).first()
    if not player:
        raise HTTPException(status_code=404, detail="Player not found")
    
    player.qr_token = None
    db.commit()
    return {"message": "QR identity revoked"}
