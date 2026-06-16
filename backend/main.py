from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="QR Player Testing API",
    description="Backend API for QR-based player testing and identity management system.",
    version="1.0.0"
)

# CORS Configuration
origins = [
    "*" # For MVP/dev. In prod, restrict to specific domains/app origins
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to QR Player Testing API"}

from app.routes import auth, player, qr, test, admin

app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(player.router, prefix="/player", tags=["Player"])
app.include_router(qr.router, prefix="/qr", tags=["QR"])
app.include_router(test.router, prefix="/test", tags=["Test Session"])
app.include_router(admin.router, prefix="/admin", tags=["Admin"])
