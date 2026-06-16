from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import Player, TestSession
from app.schemas.schemas import PlayerResponse, TestSessionResponse
from app.middleware.auth import get_current_active_user
from typing import List

router = APIRouter()

@router.get("/me", response_model=PlayerResponse)
def get_player_profile(current_user: Player = Depends(get_current_active_user)):
    return current_user

@router.get("/{player_id}", response_model=PlayerResponse)
def get_player(player_id: str, db: Session = Depends(get_db), current_user: Player = Depends(get_current_active_user)):
    if str(current_user.id) != player_id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
        
    player = db.query(Player).filter(Player.id == player_id).first()
    if not player:
        raise HTTPException(status_code=404, detail="Player not found")
    return player

@router.get("/history", response_model=List[TestSessionResponse])
def get_player_history(db: Session = Depends(get_db), current_user: Player = Depends(get_current_active_user)):
    sessions = db.query(TestSession).filter(TestSession.player_id == current_user.id).order_by(TestSession.started_at.desc()).all()
    return sessions
