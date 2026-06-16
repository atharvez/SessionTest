from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import Player, ScanLog
from app.schemas.schemas import ScanRequest, ScanResponse
from app.middleware.auth import get_current_active_user, get_current_admin_user
from app.services.qr import assign_qr_token_to_player, validate_qr_token
from app.services.session import create_session

router = APIRouter()

@router.post("/regenerate", response_model=dict)
def regenerate_qr(db: Session = Depends(get_db), current_user: Player = Depends(get_current_active_user)):
    try:
        new_token = assign_qr_token_to_player(db, str(current_user.id))
        return {"qr_token": new_token}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/scan", response_model=ScanResponse)
def process_scan(scan_req: ScanRequest, db: Session = Depends(get_db), current_admin: Player = Depends(get_current_admin_user)):
    # Verify token
    player = validate_qr_token(db, scan_req.qr_token)
    
    # Log scan
    log = ScanLog(
        player_id=player.id if player else None,
        device_id=scan_req.device_id,
        ip_address="0.0.0.0", # Could be passed from request
        success=bool(player),
        reason="Success" if player else "Invalid QR Token"
    )
    db.add(log)
    db.commit()

    if not player:
        raise HTTPException(status_code=404, detail="Invalid QR Identity")

    if player.status != "active":
        raise HTTPException(status_code=400, detail="Player account is not active")

    try:
        session = create_session(db, str(player.id), scan_req.device_id)
        return ScanResponse(
            success=True,
            message="Scan successful, session created.",
            player=player,
            session=session
        )
    except Exception as e:
        # If active session exists
        return ScanResponse(
            success=False,
            message=str(e),
            player=player,
            session=None
        )
