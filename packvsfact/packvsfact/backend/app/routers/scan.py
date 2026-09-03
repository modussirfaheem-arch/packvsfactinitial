from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Optional
import json
import logging

from app.database import get_db
from app.schemas.schemas import FullProductResponse, GrokAnalysisResponse, AlternativeProductSchema, ScoreBreakdownSchema, NutritionFactsSchema, IngredientItemSchema, ClaimVerificationSchema
from app.services.grok_service import analyze_package_images_with_grok
from app.services.scoring_service import calculate_packvsfact_score, evaluate_claims
from app.models.models import Product, Nutrition, Ingredient, Claim, Scan

router = APIRouter(prefix="/api/scan", tags=["Scanner"])
logger = logging.getLogger(__name__)

@router.post("", response_model=FullProductResponse)
async def scan_product_label(
    front_image: Optional[UploadFile] = File(None),
    back_image: Optional[UploadFile] = File(None),
    product_name: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):
    """
    Core AI Scanner endpoint:
    1. Accepts front & back package images.
    2. Sends image payloads to Grok Vision API (xAI).
    3. Executes deterministic PackVsFact scoring engine.
    4. Persists analysis result into SQLite database.
    5. Returns structured comparison & alternatives.
    """
    if not front_image and not back_image and not product_name:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please provide at least one package image (front or back) or a product name."
        )

    front_bytes = await front_image.read() if front_image else None
    back_bytes = await back_image.read() if back_image else None

    # Step 1: Run Grok Vision Analysis
    grok_res, used_live_grok = await analyze_package_images_with_grok(
        front_bytes=front_bytes,
        back_bytes=back_bytes,
        product_name_hint=product_name
    )

    # Step 2: Run PackVsFact Deterministic Scoring Engine
    detailed_score = calculate_packvsfact_score(
        nutrition=grok_res.nutrition,
        ingredients=grok_res.ingredients,
        claims=grok_res.claims
    )

    # Evaluate Claims
    verified_claims, mkt_score, halo_detected, halo_reason = evaluate_claims(
        claims=grok_res.claims,
        nutrition=grok_res.nutrition,
        ingredients=grok_res.ingredients
    )

    # Step 3: Save to Database
    p_name = grok_res.product.name or product_name or "Scanned Food Product"
    p_brand = grok_res.product.brand or "Unknown Brand"
    p_cat = grok_res.product.category or "Packaged Foods"

    db_product = Product(
        name=p_name,
        brand=p_brand,
        category=p_cat,
        variant=grok_res.product.variant or "Standard",
        package_size=grok_res.product.package_size or "Packaged",
        barcode=grok_res.product.barcode,
        score=detailed_score.total_score,
        marketing_reality_score=detailed_score.breakdown.marketing_reality,
        health_halo_detected=detailed_score.health_halo_detected,
        health_halo_reason=detailed_score.health_halo_reason,
        summary=f"Analysis of {p_name} by {p_brand}. Overall score: {detailed_score.total_score}/100."
    )
    db.add(db_product)
    db.flush()

    # Save Nutrition
    nutr_db = Nutrition(
        product_id=db_product.id,
        serving_size=grok_res.nutrition.serving_size,
        calories=grok_res.nutrition.calories,
        sugar_g=grok_res.nutrition.sugar_g,
        added_sugar_g=grok_res.nutrition.added_sugar_g,
        protein_g=grok_res.nutrition.protein_g,
        fiber_g=grok_res.nutrition.fiber_g,
        fat_g=grok_res.nutrition.fat_g,
        saturated_fat_g=grok_res.nutrition.saturated_fat_g,
        trans_fat_g=grok_res.nutrition.trans_fat_g,
        sodium_mg=grok_res.nutrition.sodium_mg,
        salt_g=grok_res.nutrition.salt_g,
        carbohydrates_g=grok_res.nutrition.carbohydrates_g
    )
    db.add(nutr_db)

    # Save Ingredients
    for idx, ing in enumerate(grok_res.ingredients):
        db.add(Ingredient(
            product_id=db_product.id,
            name=ing.name,
            role=ing.role,
            context=ing.context,
            attention_level=ing.attention_level or "LOW",
            position=idx + 1
        ))

    # Save Claims
    for cl in verified_claims:
        db.add(Claim(
            product_id=db_product.id,
            claim_text=cl.claim_text,
            claim_type=cl.claim_type,
            status=cl.status,
            reality_explanation=cl.reality_explanation,
            confidence=0.9
        ))

    # Save Scan Record
    scan_rec = Scan(
        product_id=db_product.id,
        score=detailed_score.total_score,
        raw_grok_json=json.dumps(grok_res.model_dump())
    )
    db.add(scan_rec)
    db.commit()

    # Step 4: Fetch Healthier Alternatives in same category or general DB
    alternatives = []
    better_prods = db.query(Product).filter(
        Product.id != db_product.id,
        Product.score > detailed_score.total_score
    ).limit(3).all()

    for bp in better_prods:
        alternatives.append(AlternativeProductSchema(
            id=bp.id,
            name=bp.name,
            brand=bp.brand or "Alternative",
            category=bp.category or "Packaged Foods",
            score=bp.score,
            image_url=bp.image_url,
            why_better=f"Higher PackVsFact score ({bp.score}/100) with better balanced nutritional profile."
        ))

    return FullProductResponse(
        id=db_product.id,
        name=db_product.name,
        brand=db_product.brand,
        category=db_product.category,
        variant=db_product.variant,
        package_size=db_product.package_size,
        barcode=db_product.barcode,
        image_url=db_product.image_url,
        score=detailed_score.total_score,
        grade=detailed_score.grade,
        marketing_reality_score=detailed_score.breakdown.marketing_reality,
        health_halo_detected=detailed_score.health_halo_detected,
        health_halo_reason=detailed_score.health_halo_reason,
        score_breakdown=detailed_score.breakdown,
        nutrition=grok_res.nutrition,
        ingredients=grok_res.ingredients,
        claims=verified_claims,
        positive_attributes=detailed_score.positive_attributes,
        attention_points=detailed_score.attention_points,
        alternatives=alternatives,
        created_at=db_product.created_at
    )
