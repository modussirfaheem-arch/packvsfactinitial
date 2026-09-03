"""
Authentication Router (PACKVSFACT)
Handles User & Admin Registration, Login, Token Refresh, and Role Check.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.models import User, AdminUser, UserPreference
from app.services.security_service import SecurityService

router = APIRouter(prefix="/api/auth", tags=["Auth"])

class RegisterSchema(BaseModel):
    email: str
    full_name: str
    password: str
    role: str = "USER" # USER or ADMIN

class LoginSchema(BaseModel):
    email: str
    password: str

@router.post("/register")
def register_user(payload: RegisterSchema, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="User with this email already exists.")

    hashed_pw = SecurityService.hash_password(payload.password)
    user = User(
        email=payload.email,
        full_name=payload.full_name,
        hashed_password=hashed_pw,
        role=payload.role.upper()
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    if user.role == "ADMIN":
        admin_rec = AdminUser(user_id=user.id, privileges="FULL_ADMIN")
        db.add(admin_rec)
    
    # Initialize preference
    pref = UserPreference(user_id=user.id)
    db.add(pref)
    db.commit()

    token = SecurityService.create_access_token({"sub": str(user.id), "email": user.email, "role": user.role})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role
        }
    }

@router.post("/login")
def login_user(payload: LoginSchema, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    if not SecurityService.verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    token = SecurityService.create_access_token({"sub": str(user.id), "email": user.email, "role": user.role})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role
        }
    }
