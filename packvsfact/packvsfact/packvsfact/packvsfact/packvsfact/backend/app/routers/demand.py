"""
Demand Intelligence Router (PACKVSFACT)
Handles scan tracking, anomaly detection, and surge notifications.
"""

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.demand_service import DemandService
from app.models.models import DemandEvent

router = APIRouter(prefix="/api/demand", tags=["Demand Intelligence"])

@router.post("/record")
def record_scan_event(product_id: int, category: str, db: Session = Depends(get_db)):
    res = DemandService.record_scan_event(db, product_id, category)
    return res

@router.get("/alerts")
def get_demand_alerts(db: Session = Depends(get_db)):
    anomalies = db.query(DemandEvent).filter(DemandEvent.anomaly_flag == True).order_by(DemandEvent.timestamp.desc()).limit(10).all()
    alerts = []
    for a in anomalies:
        alerts.append({
            "id": a.id,
            "category": a.category,
            "product_id": a.product_id,
            "region": a.region,
            "count_scans": a.count_scans,
            "timestamp": a.timestamp.isoformat(),
            "status": "SURGE ANOMALY DETECTED"
        })
    return {"count": len(alerts), "alerts": alerts}
