import secrets
from sqlalchemy.orm import Session
from app.db.models import Player

def generate_secure_qr_token() -> str:
    # Generates a 32-byte (64 character) hex string
    return secrets.token_hex(32)

def assign_qr_token_to_player(db: Session, player_id: str) -> str:
    player = db.query(Player).filter(Player.id == player_id).first()
    if not player:
        raise ValueError("Player not found")
    
    new_token = generate_secure_qr_token()
    player.qr_token = new_token
    db.commit()
    return new_token

def validate_qr_token(db: Session, token: str) -> Player:
    player = db.query(Player).filter(Player.qr_token == token).first()
    return player
