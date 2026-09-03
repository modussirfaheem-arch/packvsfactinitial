"""
Product Management Router (PACKVSFACT)
Handles searching, barcode lookup, category filtering, detailed view, and user submissions.
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import Optional, List

from app.database import get_db
from app.models.models import Product, Nutrition, Ingredient, Claim, Barcode, VerificationRecord
from models.nutriscore.scoring import NutriScoreEngine
from models.nova.classifier import NovaClassifier
from app.services.claim_engine import ClaimVerificationEngine

router = APIRouter(prefix="/api/products", tags=["Products"])

class ProductSubmitSchema(BaseModel):
    name: str
    brand: Optional[str] = None
    category: Optional[str] = "General Food"
    barcode: Optional[str] = None
    price: Optional[float] = 0.0
    serving_size: Optional[str] = "100g"
    ingredients_text: str
    calories: float = 0.0
    sugar_g: float = 0.0
    saturated_fat_g: float = 0.0
    sodium_mg: float = 0.0
    fibre_g: float = 0.0
    protein_g: float = 0.0

@router.get("/search")
def search_products(
    q: Optional[str] = Query(None, description="Query string for product name, brand, ingredient, or barcode"),
    category: Optional[str] = None,
    min_score: Optional[int] = None,
    max_price: Optional[float] = None,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    query = db.query(Product)

    if q and len(q.strip()) > 0:
        term = f"%{q.strip()}%"
        query = query.filter(
            or_(
                Product.name.ilike(term),
                Product.brand.ilike(term),
                Product.barcode.ilike(term),
                Product.category.ilike(term),
                Product.ingredients_text.ilike(term)
            )
        )

    if category:
        query = query.filter(Product.category.ilike(f"%{category}%"))

    if min_score is not None:
        query = query.filter(Product.insight_score >= min_score)

    if max_price is not None:
        query = query.filter(Product.price <= max_price)

    products = query.limit(limit).all()

    results = []
    for p in products:
        results.append({
            "id": p.id,
            "barcode": p.barcode,
            "name": p.name,
            "brand": p.brand,
            "category": p.category,
            "price": p.price,
            "currency": p.currency,
            "image": p.image,
            "nutri_score_grade": p.nutri_score_grade,
            "nova_group": p.nova_group,
            "insight_score": p.insight_score,
            "verification_status": p.verification_status
        })

    return {"count": len(results), "products": results}

@router.get("/barcode/{barcode_str}")
def get_by_barcode(barcode_str: str, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.barcode == barcode_str).first()
    if not product:
        # Strict rule enforcement: Do not invent fake data if barcode is missing
        return {
            "found": False,
            "barcode": barcode_str,
            "message": "Product not available in the current verified dataset.",
            "action": "Submit product for verification",
            "status": "UNVERIFIED"
        }

    return {"found": True, "product_id": product.id}

@router.get("/{product_id}")
def get_product_detail(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found.")

    nutrition = db.query(Nutrition).filter(Nutrition.product_id == product.id).first()
    claims = db.query(Claim).filter(Claim.product_id == product.id).all()

    # Recalculate Nutri-Score to generate explanation breakdown
    nutri_details = NutriScoreEngine.calculate(
        energy_kj=nutrition.energy_kj if nutrition else 0.0,
        sugars_g=nutrition.sugar_g if nutrition else 0.0,
        sat_fat_g=nutrition.saturated_fat_g if nutrition else 0.0,
        sodium_mg=nutrition.sodium_mg if nutrition else 0.0,
        fibre_g=nutrition.fibre_g if nutrition else 0.0,
        protein_g=nutrition.protein_g if nutrition else 0.0,
        is_beverage="Juices" in (product.category or "") or "Soft Drinks" in (product.category or "")
    )

    # Recalculate NOVA classification details
    nova_details = NovaClassifier.classify(product.ingredients_text or "", product.category or "")

    # Parse claims
    claims_evaluated = []
    nutr_dict = {
        "sugar_g": nutrition.sugar_g if nutrition else 0.0,
        "added_sugar_g": nutrition.added_sugar_g if nutrition else 0.0,
        "protein_g": nutrition.protein_g if nutrition else 0.0,
        "fibre_g": nutrition.fibre_g if nutrition else 0.0,
        "saturated_fat_g": nutrition.saturated_fat_g if nutrition else 0.0,
        "sodium_mg": nutrition.sodium_mg if nutrition else 0.0,
    }
    for c in claims:
        claims_evaluated.append(ClaimVerificationEngine.verify_claim(c.claim_text, nutr_dict))

    return {
        "id": product.id,
        "barcode": product.barcode,
        "name": product.name,
        "brand": product.brand,
        "category": product.category,
        "serving_size": product.serving_size,
        "price": product.price,
        "currency": product.currency,
        "image": product.image,
        "ingredients_text": product.ingredients_text,
        "verification_status": product.verification_status,
        "scores": {
            "nutri_score": nutri_details,
            "nova_model": nova_details,
            "packvsfact_insight_score": product.insight_score
        },
        "nutrition": {
            "calories": nutrition.calories if nutrition else 0.0,
            "sugar_g": nutrition.sugar_g if nutrition else 0.0,
            "added_sugar_g": nutrition.added_sugar_g if nutrition else 0.0,
            "protein_g": nutrition.protein_g if nutrition else 0.0,
            "fibre_g": nutrition.fibre_g if nutrition else 0.0,
            "saturated_fat_g": nutrition.saturated_fat_g if nutrition else 0.0,
            "total_fat_g": nutrition.total_fat_g if nutrition else 0.0,
            "sodium_mg": nutrition.sodium_mg if nutrition else 0.0,
        },
        "claims_analysis": claims_evaluated
    }

@router.post("/submit")
def submit_new_product(payload: ProductSubmitSchema, db: Session = Depends(get_db)):
    nutri_res = NutriScoreEngine.calculate(
        energy_kj=payload.calories * 4.184,
        sugars_g=payload.sugar_g,
        sat_fat_g=payload.saturated_fat_g,
        sodium_mg=payload.sodium_mg,
        fibre_g=payload.fibre_g,
        protein_g=payload.protein_g
    )
    nova_res = NovaClassifier.classify(payload.ingredients_text, payload.category)
    insight_score = int(max(10, min(98, 100 - (payload.sugar_g * 0.8) - (payload.saturated_fat_g * 1.8) - (payload.sodium_mg / 35.0) + (payload.fibre_g * 2.5) + (payload.protein_g * 1.5) - ((nova_res["nova"] - 1) * 7))))

    p = Product(
        name=payload.name,
        brand=payload.brand,
        category=payload.category,
        barcode=payload.barcode,
        price=payload.price,
        serving_size=payload.serving_size,
        ingredients_text=payload.ingredients_text,
        nutri_score_grade=nutri_res["grade"],
        nutri_score_value=nutri_res["score"],
        nova_group=nova_res["nova"],
        insight_score=insight_score,
        verification_status="USER SUBMITTED"
    )
    db.add(p)
    db.commit()
    db.refresh(p)

    nutr = Nutrition(
        product_id=p.id,
        calories=payload.calories,
        energy_kj=payload.calories * 4.184,
        sugar_g=payload.sugar_g,
        protein_g=payload.protein_g,
        fibre_g=payload.fibre_g,
        saturated_fat_g=payload.saturated_fat_g,
        sodium_mg=payload.sodium_mg
    )
    db.add(nutr)

    rec = VerificationRecord(product_id=p.id, status="SUBMITTED")
    db.add(rec)
    db.commit()

    return {
        "status": "SUBMITTED",
        "product_id": p.id,
        "message": "Product submitted successfully and placed in verification queue.",
        "verification_status": "USER SUBMITTED"
    }
