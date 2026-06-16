# QR-Based Player Testing and Identity Management MVP

This document outlines the implementation plan for the full-stack QR-based player testing and identity management MVP application requested by the user.

## Plan Details

- **Database**: We will generate raw SQL scripts for you to run in the Supabase SQL Editor. FastAPI will handle custom JWT authentication, using Supabase purely as a PostgreSQL database.
- **UI Components**: We will build clean, modern bespoke components from scratch to match the custom design, and use **Victory Native** for rendering graphs (e.g., test history/results).
- **Architecture**: The app will be a single mobile application with role-based routing (Admin vs. Player) governed by JWT claims or user roles in the database.

## Proposed Changes

We will create a multi-folder repository in `d:\PST` containing both the frontend and backend.

### Database Layer (Supabase PostgreSQL)

#### [NEW] `db/schema.sql`
A complete SQL script to set up:
- `players` table (id, name, email, phone, qr_token, profile_image, created_at, status)
- `test_sessions` table (id, player_id, status, started_at, ended_at, device_id)
- `scan_logs` table (id, player_id, device_id, ip_address, timestamp, success, reason)
- `test_results` table (id, session_id, score, metrics, created_at)
- Row Level Security (RLS) policies if needed (though FastAPI will likely bypass RLS using a service key for backend operations).

---

### Backend Layer (FastAPI)

#### [NEW] `backend/requirements.txt`
Dependencies including `fastapi`, `uvicorn`, `psycopg2-binary`, `sqlalchemy`, `python-jose[cryptography]`, `passlib[bcrypt]`, `pydantic`, `python-dotenv`.

#### [NEW] `backend/main.py`
The FastAPI application entry point, CORS configuration, and router inclusions.

#### [NEW] `backend/app/db/`
Database connection setup using SQLAlchemy/Supabase connection string.

#### [NEW] `backend/app/schemas/`
Pydantic models for request/response validation (Player, Session, Auth, Scan, etc.).

#### [NEW] `backend/app/routes/`
- `auth.py`: Registration, Login, Token generation.
- `player.py`: Get player profile, history.
- `qr.py`: Process scans, regenerate tokens.
- `test.py`: Start/end tests, fetch session.
- `admin.py`: Admin endpoints for monitoring and revoking.

#### [NEW] `backend/app/services/`
Business logic separating DB calls from route handlers. Includes QR token generation securely using the `secrets` module.

#### [NEW] `backend/app/middleware/`
Authentication dependencies (JWT validation, Role-based checks).

---

### Frontend Layer (React Native + Expo)

#### [NEW] `frontend/package.json`
Dependencies including `@react-navigation/native`, `@react-navigation/stack`, `axios`, `zustand`, `lucide-react-native`, `react-native-qrcode-svg`, `expo-camera` (for scanning).

#### [NEW] `frontend/App.tsx`
Main entry point, navigation container, and global providers.

#### [NEW] `frontend/src/navigation/`
Stack and Tab navigators for Auth, Player (Profile, QR Display, History), and Admin (Dashboard, Scanner, Session Monitoring) flows.

#### [NEW] `frontend/src/store/`
Zustand stores for Authentication state and active session management.

#### [NEW] `frontend/src/services/api/`
Axios instance configuration with interceptors for JWT injection and token refresh.

#### [NEW] `frontend/src/screens/`
- `Auth/`: Login, Register.
- `Player/`: Dashboard, Profile, QRIdentity.
- `Admin/`: Dashboard, QRScanner, SessionMonitor.
- `Shared/`: TestActive.

#### [NEW] `frontend/src/components/`
Reusable UI components: Buttons, Cards, Inputs, Loaders, Modals adhering to a clean, modern aesthetic.

#### [NEW] `frontend/src/utils/`
Helpers for date formatting, validation, and async storage.

---

### DevOps & Documentation

#### [NEW] `README.md`
Project overview, setup instructions for both frontend and backend, Supabase configuration guide, and Docker setup.

#### [NEW] `backend/Dockerfile` & `docker-compose.yml`
For containerized backend deployment.

#### [NEW] `.env.example` (for both frontend and backend)
Environment variable templates.

## Verification Plan

### Automated Tests
- We will provide basic Pytest setups for the backend routes to verify authentication and session creation rules (e.g., duplicate active session prevention).

### Manual Verification
- We will run the FastAPI server locally (`uvicorn app.main:app --reload`) and test endpoints using the built-in `/docs` Swagger UI.
- We will scaffold the Expo app, ensure it compiles, and verify the navigation structure and UI components render correctly.
- Ensure QR token generation creates secure, 32+ character tokens and is validated properly.
