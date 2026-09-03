"""
Product Comparison Router (PACKVSFACT)
Compares 2 to 5 products side-by-side highlighting nutrient differences, Nutri-Score, NOVA, and value metrics.
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.models import Product, Nutrition

router = APIRouter(prefix="/api/compare", tags=["Compare"])

@router.get("/products")
def compare_products(ids: str = Query(..., description="Comma-separated product IDs (e.g. 1,2,3)"), db: Session = Depends(get_db)):
    id_list = [int(i.strip()) for i in ids.split(",") if i.strip().isdigit()]
    if len(id_list) < 2 or len(id_list) > 5:
        raise HTTPException(status_code=400, detail="Comparison requires between 2 and 5 product IDs.")

    products = db.query(Product).filter(Product.id.in_(id_list)).all()
    if len(products) < len(id_list):
        raise HTTPException(status_code=404, detail="One or more specified products could not be found.")

    comparison_items = []
    min_sugar = float('inf')
    max_protein = -1.0
    min_price = float('inf')

    for p in products:
        n = db.query(Nutrition).filter(Nutrition.product_id == p.id).first()
        item = {
            "id": p.id,
            "name": p.name,
            "brand": p.brand,
            "category": p.category,
            "price": p.price,
            "image": p.image,
            "nutri_score_grade": p.nutri_score_grade,
            "nova_group": p.nova_group,
            "insight_score": p.insight_score,
            "nutrition": {
                "calories": n.calories if n else 0.0,
                "sugar_g": n.sugar_g if n else 0.0,
                "protein_g": n.protein_g if n else 0.0,
                "fibre_g": n.fibre_g if n else 0.0,
                "sat_fat_g": n.saturated_fat_g if n else 0.0,
                "sodium_mg": n.sodium_mg if n else 0.0,
            }
        }
        comparison_items.append(item)
        if item["nutrition"]["sugar_g"] < min_sugar:
            min_sugar = item["nutrition"]["sugar_g"]
        if item["nutrition"]["protein_g"] > max_protein:
            max_protein = item["nutrition"]["protein_g"]
        if item["price"] < min_price:
            min_price = item["price"]

    # Highlights
    for item in comparison_items:
        highlights = []
        if item["nutrition"]["sugar_g"] == min_sugar:
            highlights.append("Lowest Sugar")
        if item["nutrition"]["protein_g"] == max_protein and max_protein > 0:
            highlights.append("Highest Protein")
        if item["price"] == min_price:
            highlights.append("Best Price")
        if item["insight_score"] >= 80:
            highlights.append("Top Health Score")
        item["highlights"] = highlights

    return {
        "count": len(comparison_items),
        "comparison": comparison_items,
        "disclaimer": "This comparison highlights nutritional trade-offs and is intended as a consumer filtering aid, not medical advice."
    }
