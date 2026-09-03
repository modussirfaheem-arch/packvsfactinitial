"""
Healthier Alternative Engine (PACKVSFACT)
Finds and ranks budget-aware healthier alternative products.
Calculates transparent ranking scores based on:
1. Nutritional improvement (lower sugar/sat fat/sodium, higher fibre/protein)
2. Processing improvement (lower NOVA group)
3. Price advantage (staying within user budget ≤ ₹30)
4. Category similarity
"""

from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.models.models import Product, Nutrition

class AlternativeEngine:
    @classmethod
    def find_alternatives(cls, db: Session, target_product: Product, max_budget_inr: float = 100.0, limit: int = 5) -> List[Dict[str, Any]]:
        target_nutr = db.query(Nutrition).filter(Nutrition.product_id == target_product.id).first()
        if not target_nutr:
            return []

        # Find candidate products in same or similar category
        candidates = db.query(Product).filter(
            Product.id != target_product.id,
            Product.category == target_product.category
        ).all()

        if not candidates:
            # Fallback to general category search
            candidates = db.query(Product).filter(Product.id != target_product.id).all()

        scored_alternatives = []

        for cand in candidates:
            cand_nutr = db.query(Nutrition).filter(Nutrition.product_id == cand.id).first()
            if not cand_nutr:
                continue

            # Price check
            price_adv = target_product.price - cand.price # Positive means alternative is cheaper
            
            # Skip candidates exceeding maximum budget filter if budget filter is active
            if max_budget_inr > 0 and cand.price > max_budget_inr:
                continue

            # Health improvement
            health_score_diff = cand.insight_score - target_product.insight_score
            nova_diff = target_product.nova_group - cand.nova_group # Positive means candidate is less processed
            sugar_diff = target_nutr.sugar_g - cand_nutr.sugar_g # Positive means candidate has less sugar
            sodium_diff = target_nutr.sodium_mg - cand_nutr.sodium_mg # Positive means candidate has less sodium
            fibre_diff = cand_nutr.fibre_g - target_nutr.fibre_g # Positive means candidate has more fibre

            # Candidate must provide genuine health improvement or price advantage
            if health_score_diff < -5 and price_adv <= 0:
                continue

            # Composite alternative rank score
            total_rank_score = (
                (health_score_diff * 1.5)
                + (nova_diff * 8.0)
                + (price_adv * 1.0)
                + (fibre_diff * 3.0)
                + (sugar_diff * 0.8)
                + (20 if cand.category == target_product.category else 0)
            )

            # Build human-readable explanations
            reasons = []
            if price_adv > 0:
                reasons.append(f"₹{price_adv:.0f} cheaper")
            elif price_adv == 0:
                reasons.append("Same price")
            if sugar_diff > 1.0:
                reasons.append(f"{sugar_diff:.1f}g lower sugar")
            if sodium_diff > 50.0:
                reasons.append(f"{sodium_diff:.0f}mg lower sodium")
            if fibre_diff > 1.0:
                reasons.append(f"{fibre_diff:.1f}g higher fibre")
            if nova_diff > 0:
                reasons.append(f"Lower processing (NOVA {cand.nova_group} vs {target_product.nova_group})")
            if health_score_diff > 0:
                reasons.append(f"Higher PackVsFact score ({cand.insight_score} vs {target_product.insight_score})")

            if not reasons:
                reasons.append("Similar nutritional profile with better value balance")

            explanation_str = "Recommended because: " + ", ".join(reasons)

            scored_alternatives.append({
                "product_id": cand.id,
                "name": cand.name,
                "brand": cand.brand,
                "category": cand.category,
                "price": cand.price,
                "image": cand.image,
                "nutri_score_grade": cand.nutri_score_grade,
                "nova_group": cand.nova_group,
                "insight_score": cand.insight_score,
                "price_difference_inr": round(price_adv, 2),
                "health_score_difference": round(health_score_diff, 1),
                "composite_rank_score": round(total_rank_score, 2),
                "explanation": explanation_str,
                "status": "MODEL RECOMMENDATION"
            })

        # Sort descending by composite score
        scored_alternatives.sort(key=lambda x: x["composite_rank_score"], reverse=True)
        return scored_alternatives[:limit]
