from app.schemas.schemas import (
    NutritionFactsSchema,
    IngredientItemSchema,
    ClaimItemSchema,
    ClaimVerificationSchema,
    DetailedScoreSchema,
    ScoreBreakdownSchema
)
from typing import List, Tuple

def calculate_packvsfact_score(
    nutrition: NutritionFactsSchema,
    ingredients: List[IngredientItemSchema],
    claims: List[ClaimItemSchema]
) -> DetailedScoreSchema:
    """
    Deterministic scoring engine calculating PackVsFact Consumer Awareness Index (0-100).
    Evaluates Nutrition Quality, Ingredient Integrity, Claim Transparency, and Marketing Reality.
    """
    # 1. Nutrition Component Scoring
    sugar_score = 100
    if nutrition.sugar_g is not None:
        if nutrition.sugar_g > 25:
            sugar_score = 30
        elif nutrition.sugar_g > 15:
            sugar_score = 50
        elif nutrition.sugar_g > 8:
            sugar_score = 75
        else:
            sugar_score = 95

    protein_score = 50
    if nutrition.protein_g is not None:
        if nutrition.protein_g >= 15:
            protein_score = 95
        elif nutrition.protein_g >= 8:
            protein_score = 80
        elif nutrition.protein_g >= 3:
            protein_score = 65
        else:
            protein_score = 45

    fiber_score = 50
    if nutrition.fiber_g is not None:
        if nutrition.fiber_g >= 6:
            fiber_score = 95
        elif nutrition.fiber_g >= 3:
            fiber_score = 75
        elif nutrition.fiber_g >= 1:
            fiber_score = 60
        else:
            fiber_score = 40

    sodium_score = 100
    if nutrition.sodium_mg is not None:
        if nutrition.sodium_mg > 600:
            sodium_score = 25
        elif nutrition.sodium_mg > 400:
            sodium_score = 50
        elif nutrition.sodium_mg > 200:
            sodium_score = 75
        else:
            sodium_score = 90

    # Composite Nutrition Quality Score (0-100)
    nutrition_quality = int(
        (sugar_score * 0.35) + 
        (sodium_score * 0.25) + 
        (protein_score * 0.20) + 
        (fiber_score * 0.20)
    )

    # 2. Ingredient Profile Scoring
    ingredient_profile = 85
    high_attn_count = 0
    mod_attn_count = 0

    for ing in ingredients:
        level = (ing.attention_level or "LOW").upper()
        if level == "ATTENTION":
            high_attn_count += 1
        elif level == "MODERATE":
            mod_attn_count += 1

    ingredient_profile -= (high_attn_count * 15) + (mod_attn_count * 5)
    ingredient_profile = max(20, min(100, ingredient_profile))

    # 3. Claim Transparency & Marketing Reality Analysis
    verified_claims, marketing_reality_score, health_halo_detected, health_halo_reason = evaluate_claims(
        claims=claims,
        nutrition=nutrition,
        ingredients=ingredients
    )

    claim_transparency = int(marketing_reality_score * 0.9 + 10)

    # 4. Total Score Calculation
    total_score = int(
        (nutrition_quality * 0.35) +
        (ingredient_profile * 0.25) +
        (marketing_reality_score * 0.25) +
        (claim_transparency * 0.15)
    )
    total_score = max(5, min(100, total_score))

    # Grade determination
    if total_score >= 85:
        grade = "EXCELLENT"
    elif total_score >= 70:
        grade = "GOOD"
    elif total_score >= 50:
        grade = "MODERATE"
    elif total_score >= 30:
        grade = "LOW"
    else:
        grade = "VERY LOW"

    # Positive attributes & Attention points synthesis
    positive_attributes = []
    attention_points = []

    if nutrition.protein_g and nutrition.protein_g >= 6:
        positive_attributes.append(f"Good protein content ({nutrition.protein_g}g per serving)")
    if nutrition.fiber_g and nutrition.fiber_g >= 3:
        positive_attributes.append(f"Useful dietary fiber ({nutrition.fiber_g}g per serving)")
    if sugar_score >= 80:
        positive_attributes.append("Low sugar formulation")
    if sodium_score >= 80:
        positive_attributes.append("Moderate sodium level")

    if nutrition.sugar_g and nutrition.sugar_g > 12:
        attention_points.append(f"High sugar level ({nutrition.sugar_g}g per 100g/serving)")
    if nutrition.sodium_mg and nutrition.sodium_mg > 400:
        attention_points.append(f"Elevated sodium content ({nutrition.sodium_mg}mg)")
    if health_halo_detected:
        attention_points.append("Health Halo: Front packaging emphasizes health claims while back facts warrant scrutiny")
    if high_attn_count > 0:
        attention_points.append(f"Contains {high_attn_count} ultra-processed additive(s) or sweetener(s)")

    breakdown = ScoreBreakdownSchema(
        nutrition_quality=nutrition_quality,
        ingredient_profile=ingredient_profile,
        sugar_impact=sugar_score,
        protein_content=protein_score,
        fiber_content=fiber_score,
        sodium_level=sodium_score,
        marketing_reality=marketing_reality_score,
        claim_transparency=claim_transparency
    )

    return DetailedScoreSchema(
        total_score=total_score,
        grade=grade,
        breakdown=breakdown,
        health_halo_detected=health_halo_detected,
        health_halo_reason=health_halo_reason,
        positive_attributes=positive_attributes if positive_attributes else ["Basic nutrition profile"],
        attention_points=attention_points if attention_points else ["Standard commercial packaged product"]
    )


def evaluate_claims(
    claims: List[ClaimItemSchema],
    nutrition: NutritionFactsSchema,
    ingredients: List[IngredientItemSchema]
) -> Tuple[List[ClaimVerificationSchema], int, bool, str]:
    """
    Evaluates Front-of-Pack claims against Back-of-Pack actual nutrition and ingredient facts.
    Detects 'Health Halo' discrepancies.
    """
    verified_claims = []
    supported_count = 0
    total_claims = max(1, len(claims))
    health_halo_triggers = []

    sugar = nutrition.sugar_g or 0
    protein = nutrition.protein_g or 0
    fiber = nutrition.fiber_g or 0
    sodium = nutrition.sodium_mg or 0

    for c in claims:
        txt = c.text.upper()
        status = "NEEDS CONTEXT"
        explanation = "The front-of-pack claim was evaluated against back-label facts."

        if "PROTEIN" in txt:
            if protein >= 10:
                status = "SUPPORTED"
                explanation = f"Supported: Product delivers {protein}g protein per serving."
                supported_count += 1
            elif protein >= 4:
                status = "PARTIALLY SUPPORTED"
                explanation = f"Partially Supported: Delivers {protein}g protein, which is moderate rather than high."
                supported_count += 0.5
            else:
                status = "NEEDS CONTEXT"
                explanation = f"Needs Context: Protein is only {protein}g per serving, lower than implied."
                if sugar > 10:
                    health_halo_triggers.append("Promotes high protein while containing significant sugar.")

        elif "SUGAR" in txt or "NO ADDED SUGAR" in txt:
            if sugar == 0:
                status = "SUPPORTED"
                explanation = "Supported: 0g sugar indicated on label."
                supported_count += 1
            elif sugar > 10:
                status = "NEEDS CONTEXT"
                explanation = f"Needs Context: Label states '{c.text}', but contains {sugar}g total sugars (natural/sweetener sources)."
                health_halo_triggers.append("Highlights no added sugar while total sugar content remains high.")
            else:
                status = "PARTIALLY SUPPORTED"
                explanation = f"Partially Supported: Total sugar is {sugar}g per serving."
                supported_count += 0.7

        elif "WHOLE GRAIN" in txt or "MULTIGRAIN" in txt:
            if fiber >= 5:
                status = "SUPPORTED"
                explanation = f"Supported: Product contains {fiber}g fiber supporting whole grain claim."
                supported_count += 1
            else:
                status = "NEEDS CONTEXT"
                explanation = f"Needs Context: Advertised as {c.text}, but dietary fiber is only {fiber}g."
                health_halo_triggers.append(f"Advertises {c.text} but fiber level is lower than expected.")

        elif "HEALTHY" in txt or "FITNESS" in txt or "IMMUNITY" in txt or "NATURAL" in txt:
            if sugar < 8 and sodium < 300:
                status = "SUPPORTED"
                explanation = f"Supported: Balanced profile matches wellness positioning."
                supported_count += 1
            else:
                status = "NEEDS CONTEXT"
                explanation = f"Needs Context: Promotes wellness, but back label reveals {sugar}g sugar and {sodium}mg sodium."
                health_halo_triggers.append(f"Uses wellness term '{c.text}' despite elevated sugar/sodium levels.")
        else:
            status = "PARTIALLY SUPPORTED"
            explanation = "Claim observed on front package; general consumer claim."
            supported_count += 0.6

        verified_claims.append(ClaimVerificationSchema(
            claim_text=c.text,
            claim_type=c.type or "General",
            status=status,
            reality_explanation=explanation
        ))

    marketing_reality_score = int((supported_count / total_claims) * 100)
    marketing_reality_score = max(25, min(95, marketing_reality_score))

    health_halo_detected = len(health_halo_triggers) > 0
    health_halo_reason = " | ".join(health_halo_triggers) if health_halo_detected else None

    return verified_claims, marketing_reality_score, health_halo_detected, health_halo_reason
