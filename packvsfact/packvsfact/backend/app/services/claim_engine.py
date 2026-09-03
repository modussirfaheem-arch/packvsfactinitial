"""
Claim vs Fact Verification Engine (PACKVSFACT)
Validates packaging marketing claims against official nutritional data and FSSAI/ICMR standards.
Statuses: SUPPORTED BY AVAILABLE DATA, NEEDS VERIFICATION, NOT SUPPORTED BY CURRENT DATA.
"""

from typing import Dict, Any, List

class ClaimVerificationEngine:
    @classmethod
    def verify_claim(cls, claim_text: str, nutrition: Dict[str, float]) -> Dict[str, Any]:
        text = claim_text.lower().strip()
        
        sugar_g = nutrition.get("sugar_g", 0.0)
        added_sugar_g = nutrition.get("added_sugar_g", 0.0)
        protein_g = nutrition.get("protein_g", 0.0)
        fibre_g = nutrition.get("fibre_g", 0.0)
        sat_fat_g = nutrition.get("saturated_fat_g", 0.0)
        sodium_mg = nutrition.get("sodium_mg", 0.0)
        
        status = "NEEDS VERIFICATION"
        explanation = "Claim requires additional laboratory documentation or batch certification."
        
        # High Fibre claim (FSSAI standard: >3g/100g source, >6g/100g high fibre)
        if any(w in text for w in ["high fibre", "rich in fibre", "fibre rich", "fiber"]):
            if fibre_g >= 6.0:
                status = "SUPPORTED BY AVAILABLE DATA"
                explanation = f"High fibre claim is supported: Product contains {fibre_g:.1f}g fibre per 100g (exceeds FSSAI 6.0g threshold)."
            elif fibre_g >= 3.0:
                status = "SUPPORTED BY AVAILABLE DATA"
                explanation = f"Source of fibre supported: Product contains {fibre_g:.1f}g fibre per 100g."
            else:
                status = "NOT SUPPORTED BY CURRENT DATA"
                explanation = f"Fibre claim not supported: Product contains only {fibre_g:.1f}g fibre per 100g (below FSSAI 3.0g threshold)."

        # Zero Sugar / Low Sugar claim (FSSAI standard: <0.5g/100g zero sugar, <5.0g/100g low sugar)
        elif any(w in text for w in ["zero sugar", "no added sugar", "low sugar", "sugar free"]):
            if "zero" in text or "free" in text or "no added" in text:
                if added_sugar_g <= 0.5 and sugar_g <= 0.5:
                    status = "SUPPORTED BY AVAILABLE DATA"
                    explanation = f"Zero/No added sugar claim supported: Total sugar is {sugar_g:.1f}g per 100g."
                elif added_sugar_g <= 0.5:
                    status = "SUPPORTED BY AVAILABLE DATA"
                    explanation = f"No added sugar supported: Zero added sugar detected, though naturally occurring sugars are {sugar_g:.1f}g."
                else:
                    status = "NOT SUPPORTED BY CURRENT DATA"
                    explanation = f"Sugar claim not supported: Product contains {added_sugar_g:.1f}g added sugar per 100g."
            elif sugar_g <= 5.0:
                status = "SUPPORTED BY AVAILABLE DATA"
                explanation = f"Low sugar claim supported: Product contains {sugar_g:.1f}g sugar per 100g (under 5.0g threshold)."

        # High Protein claim (FSSAI standard: >6g/100g source, >12g/100g high protein)
        elif any(w in text for w in ["protein", "high protein", "protein rich", "rich in protein"]):
            if protein_g >= 12.0:
                status = "SUPPORTED BY AVAILABLE DATA"
                explanation = f"High protein claim supported: Product contains {protein_g:.1f}g protein per 100g (exceeds 12.0g high protein standard)."
            elif protein_g >= 6.0:
                status = "SUPPORTED BY AVAILABLE DATA"
                explanation = f"Protein claim supported: Product contains {protein_g:.1f}g protein per 100g."
            else:
                status = "NOT SUPPORTED BY CURRENT DATA"
                explanation = f"Protein claim not supported: Product contains only {protein_g:.1f}g protein per 100g."

        # Low Sodium / Low Salt
        elif any(w in text for w in ["low sodium", "low salt"]):
            if sodium_mg <= 120.0:
                status = "SUPPORTED BY AVAILABLE DATA"
                explanation = f"Low sodium claim supported: Product contains {sodium_mg:.0f}mg sodium per 100g (under 120mg threshold)."
            else:
                status = "NOT SUPPORTED BY CURRENT DATA"
                explanation = f"Low sodium claim not supported: Product contains {sodium_mg:.0f}mg sodium per 100g."

        return {
            "claim": claim_text,
            "status": status,
            "explanation": explanation
        }
