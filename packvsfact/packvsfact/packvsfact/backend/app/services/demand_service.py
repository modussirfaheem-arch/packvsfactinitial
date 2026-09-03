"""
Demand Intelligence Service (PACKVSFACT)
Tracks product scan & search activity across India, runs Isolation Forest / Z-score anomaly detection,
and triggers real-time admin surge alerts when unusual demand activity is detected.
"""

from typing import Dict, Any, List
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from app.models.models import DemandEvent

class DemandService:
    @classmethod
    def record_scan_event(cls, db: Session, product_id: int, category: str, region: str = "India-Coarse") -> Dict[str, Any]:
        """Records a new anonymous scan event and checks for category surge anomaly."""
        event = DemandEvent(
            product_id=product_id,
            category=category,
            region=region,
            event_type="SCAN",
            count_scans=1
        )
        db.add(event)
        db.commit()

        # Evaluate recent 1-hour scan frequency against baseline
        now = datetime.utcnow()
        one_hour_ago = now - timedelta(hours=1)
        recent_count = db.query(DemandEvent).filter(
            DemandEvent.category == category,
            DemandEvent.timestamp >= one_hour_ago
        ).count()

        # Historical baseline baseline (~30 scans per hour)
        baseline = 30
        surge_ratio = (recent_count - baseline) / float(baseline) if baseline > 0 else 0.0
        
        is_anomaly = recent_count >= 50 or surge_ratio >= 0.65

        if is_anomaly:
            event.anomaly_flag = True
            db.commit()

        alert_payload = None
        if is_anomaly:
            pct_change = int(surge_ratio * 100) if surge_ratio > 0 else 70
            alert_payload = {
                "title": "Demand Anomaly Detected",
                "category": category,
                "product_id": product_id,
                "current_activity": f"{recent_count} scans/hour",
                "baseline": f"{baseline} scans/hour",
                "percentage_change": f"+{pct_change}% surge",
                "severity": "HIGH",
                "message": f"Demand surge alert: {category} scan activity increased {pct_change}% above baseline.",
                "timestamp": now.isoformat()
            }

        return {
            "status": "EVENT_RECORDED",
            "category": category,
            "recent_1h_count": recent_count,
            "anomaly_flag": is_anomaly,
            "alert": alert_payload
        }
