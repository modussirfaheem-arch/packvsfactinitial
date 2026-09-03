"""
Data Privacy Router (PACKVSFACT)
Provides Data Export, Clear History, and Account Data Deletion endpoints.
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import User, UserScan, UserPreference

router = APIRouter(prefix="/api/privacy", tags=["Privacy"])

@router.get("/export/{user_id}")
def export_user_data(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    scans = db.query(UserScan).filter(UserScan.user_id == user.id).all()
    pref = db.query(UserPreference).filter(UserPreference.user_id == user.id).first()

    return {
        "user_profile": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "created_at": user.created_at.isoformat()
        },
        "preferences": {
            "dietary_pref": pref.dietary_pref if pref else "BALANCED",
            "max_budget_inr": pref.max_budget_inr if pref else 100.0,
            "save_history": pref.save_history if pref else True
        },
        "scans_history": [{"id": s.id, "barcode": s.barcode, "date": s.created_at.isoformat()} for s in scans]
    }

@router.delete("/delete-data/{user_id}")
def delete_user_data(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    db.query(UserScan).filter(UserScan.user_id == user.id).delete()
    db.query(UserPreference).filter(UserPreference.user_id == user.id).delete()
    db.query(User).filter(User.id == user.id).delete()
    db.commit()

    return {
        "status": "DATA_DELETED",
        "message": f"All data associated with user {user_id} has been permanently deleted."
    }
