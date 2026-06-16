from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from app.db.database import get_db
from app.db.models import Player
from app.schemas.schemas import PlayerCreate, PlayerResponse, Token
from app.services.auth import get_password_hash, verify_password, create_access_token

router = APIRouter()

@router.post("/register", response_model=PlayerResponse, status_code=status.HTTP_201_CREATED)
def register(player_in: PlayerCreate, db: Session = Depends(get_db)):
    db_player = db.query(Player).filter(Player.email == player_in.email).first()
    if db_player:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(player_in.password)
    new_player = Player(
        name=player_in.name,
        email=player_in.email,
        password_hash=hashed_password,
        phone=player_in.phone,
        role=player_in.role
    )
    db.add(new_player)
    db.commit()
    db.refresh(new_player)
    return new_player

@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(Player).filter(Player.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if user.status != "active":
        raise HTTPException(status_code=400, detail="Inactive user")

    access_token = create_access_token(data={"sub": str(user.id), "role": user.role})
    return {"access_token": access_token, "token_type": "bearer"}
