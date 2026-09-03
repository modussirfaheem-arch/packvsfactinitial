from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database import get_db
from app.models.models import FoodWatchAlert
from app.schemas.schemas import FoodWatchAlertSchema

router = APIRouter(prefix="", tags=["Food Watch India"])

@router.get("/api/news", response_model=List[FoodWatchAlertSchema])
@router.get("/api/alerts", response_model=List[FoodWatchAlertSchema])
def get_food_watch_alerts(
    location: Optional[str] = Query(None, description="Filter by city/state"),
    category: Optional[str] = Query(None, description="Filter by alert category"),
    severity: Optional[str] = Query(None, description="Filter by severity: LOW, MEDIUM, HIGH"),
    db: Session = Depends(get_db)
):
    """
    Retrieve verified food safety alerts, recalls, and regulatory updates across India.
    """
    query = db.query(FoodWatchAlert)
    if location:
        query = query.filter(FoodWatchAlert.location.ilike(f"%{location}%"))
    if category:
        query = query.filter(FoodWatchAlert.category == category)
    if severity:
        query = query.filter(FoodWatchAlert.severity == severity)

    alerts = query.order_by(FoodWatchAlert.created_at.desc()).all()
    return alerts
