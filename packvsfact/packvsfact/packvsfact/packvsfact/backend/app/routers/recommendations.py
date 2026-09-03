"""
Healthier Alternatives & Recommendations Router (PACKVSFACT)
Finds and ranks healthier budget-filtered alternative food products.
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import Product
from app.services.alternative_engine import AlternativeEngine

router = APIRouter(prefix="/api/recommendations", tags=["Recommendations"])

@router.get("/alternatives")
def get_alternatives(
    product_id: int = Query(..., description="Target product ID"),
    max_budget_inr: float = Query(100.0, description="Max budget in INR"),
    limit: int = Query(5, description="Max number of recommendations"),
    db: Session = Depends(get_db)
):
    target = db.query(Product).filter(Product.id == product_id).first()
    if not target:
        raise HTTPException(status_code=404, detail="Target product not found.")

    alternatives = AlternativeEngine.find_alternatives(db, target, max_budget_inr=max_budget_inr, limit=limit)
    return {
        "target_product": {
            "id": target.id,
            "name": target.name,
            "brand": target.brand,
            "price": target.price,
            "nutri_score_grade": target.nutri_score_grade,
            "nova_group": target.nova_group,
            "insight_score": target.insight_score
        },
        "max_budget_inr": max_budget_inr,
        "count": len(alternatives),
        "alternatives": alternatives
    }
