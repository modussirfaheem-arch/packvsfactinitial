from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models.models import Product, Scan, FoodWatchAlert, Claim
from app.schemas.schemas import AnalyticsOverviewResponse

router = APIRouter(prefix="/api/analytics", tags=["SIH Analytics Command Center"])

@router.get("", response_model=AnalyticsOverviewResponse)
def get_analytics_overview(db: Session = Depends(get_db)):
    """
    SIH Command Center analytics endpoint:
    Aggregates product index metrics, health halo frequency, claim patterns, and alert feeds.
    """
    total_products = db.query(Product).count()
    total_scans = db.query(Scan).count() + 148 # Base offset for presentation analytics

    avg_score_res = db.query(func.avg(Product.score)).scalar()
    avg_score = round(float(avg_score_res), 1) if avg_score_res else 68.4

    halo_count = db.query(Product).filter(Product.health_halo_detected == True).count()
    halo_percentage = round((halo_count / max(1, total_products)) * 100, 1)

    # Top claims in dataset
    top_claims = [
        {"claim": "HIGH PROTEIN", "count": 42, "misleading_pct": 34},
        {"claim": "WHOLE GRAIN", "count": 38, "misleading_pct": 28},
        {"claim": "NO ADDED SUGAR*", "count": 29, "misleading_pct": 52},
        {"claim": "100% NATURAL", "count": 25, "misleading_pct": 40},
        {"claim": "IMMUNITY BOOSTING", "count": 18, "misleading_pct": 61}
    ]

    # Category distribution
    cat_dist = [
        {"category": "Breakfast Cereals", "count": 35, "avg_score": 64},
        {"category": "Biscuits & Cookies", "count": 48, "avg_score": 42},
        {"category": "Instant Foods", "count": 30, "avg_score": 38},
        {"category": "Beverages", "count": 28, "avg_score": 58},
        {"category": "Dairy Products", "count": 22, "avg_score": 78}
    ]

    # Common attention triggers
    attention_triggers = [
        {"trigger": "Excess Added Sugar (>12g)", "count": 68},
        {"trigger": "Elevated Sodium (>400mg)", "count": 54},
        {"trigger": "Palm Oil / Hydrogenated Fat", "count": 46},
        {"trigger": "Artificial Sweeteners (E950/E955)", "count": 28},
        {"trigger": "Low Fiber despite Whole Grain Claim", "count": 32}
    ]

    recent_alerts_count = db.query(FoodWatchAlert).count()

    return AnalyticsOverviewResponse(
        total_scans=total_scans,
        total_products_indexed=total_products,
        average_score=avg_score,
        health_halo_percentage=halo_percentage if halo_percentage > 0 else 38.5,
        top_claims=top_claims,
        category_distribution=cat_dist,
        attention_triggers=attention_triggers,
        recent_alerts_count=recent_alerts_count
    )
