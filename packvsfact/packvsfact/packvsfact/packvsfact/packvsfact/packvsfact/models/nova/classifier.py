"""
NOVA Ultra-Processing Classification Model (PACKVSFACT)
Classifies food products into NOVA Groups 1, 2, 3, or 4 based on ingredient list,
presence of industrial additives, emulsifiers, preservatives, and processing indicators.
"""

import re
from typing import Dict, Any, List, Tuple

class NovaClassifier:
    VERSION = "1.2.0 (Hybrid Rule + NLP Feature Extraction)"
    
    # Ultra-processed industrial additive keywords & INS codes
    ULTRA_PROCESSED_INDICATORS = [
        # Emulsifiers & Stabilizers
        "emulsifier", "stabilizer", "lecithin", "soy lecithin", "ins 322", "ins 471", "ins 472", "ins 412", "guar gum", "xanthan gum", "carrageenan",
        # Flavour Enhancers
        "flavour enhancer", "msg", "monosodium glutamate", "ins 621", "ins 627", "ins 631", "disodium inosinate", "disodium guanylate", "yeast extract",
        # Artificial Sweeteners
        "sweetener", "sucralose", "aspartame", "acesulfame k", "ins 950", "ins 951", "ins 955", "stevia", "ins 960", "high fructose corn syrup", "maltodextrin",
        # Artificial Colours & Flavours
        "artificial flavour", "nature identical flavour", "synthetic colour", "caramel color", "ins 150d", "tartrazine", "ins 102", "sunset yellow", "ins 110",
        # Preservatives
        "preservative", "sodium benzoate", "ins 211", "potassium sorbate", "ins 202", "sodium metabisulfite", "ins 223", "tbhq", "ins 319",
        # Industrial Fats & Oils
        "palm oil", "palmolein", "hydrogenated vegetable oil", "partially hydrogenated oil", "interesterified fat", "margarine",
        # Chemical Bulking / Acidity Regulators
        "acidity regulator", "ins 330", "citric acid", "ins 500", "sodium bicarbonate", "ins 450", "pyrophosphate"
    ]
    
    CULINARY_INGREDIENT_INDICATORS = [
        "sugar", "salt", "iodised salt", "vegetable oil", "sunflower oil", "mustard oil", "butter", "ghee", "vinegar"
    ]

    @classmethod
    def classify(cls, ingredients_text: str, category: str = "") -> Dict[str, Any]:
        """
        Classify product into NOVA Group 1 to 4 with evidence list and confidence level.
        """
        if not ingredients_text or len(ingredients_text.strip()) < 3:
            return {
                "nova": 1 if "raw" in category.lower() or "fruit" in category.lower() else 3,
                "confidence": 0.50,
                "status": "MODEL PREDICTION (LIMITED DATA)",
                "evidence": ["Short or missing ingredient statement"],
                "explanation": "Insufficient ingredient details provided. Assigned default conservative group based on category."
            }

        text = ingredients_text.lower()
        
        # Extract detected evidence
        detected_upf_indicators = [ind for ind in cls.ULTRA_PROCESSED_INDICATORS if ind in text]
        detected_culinary = [ind for ind in cls.CULINARY_INGREDIENT_INDICATORS if ind in text]
        
        # Tokenize ingredients by comma/semicolon
        raw_list = [i.strip() for i in re.split(r'[,;()]+', text) if i.strip()]
        ingredient_count = len(raw_list)

        evidence = []
        
        # Classification Logic
        if len(detected_upf_indicators) >= 2 or ingredient_count >= 10 or any(kw in text for kw in ["hydrogenated", "palmolein", "ins 621", "ins 319", "nature identical"]):
            nova_group = 4
            confidence = min(0.95, 0.75 + 0.05 * len(detected_upf_indicators))
            evidence.append(f"Identified {len(detected_upf_indicators)} industrial additive/processing indicators")
            evidence.extend([f"Detected industrial component: {ind.upper()}" for ind in detected_upf_indicators[:4]])
            if ingredient_count >= 8:
                evidence.append(f"High ingredient complexity ({ingredient_count} listed ingredients)")
            explanation = f"Classified as NOVA 4 (Ultra-Processed Food) due to presence of industrial additives ({', '.join(detected_upf_indicators[:3])}) and chemical processing indicators."
        
        elif len(detected_culinary) >= 1 and ingredient_count > 3:
            nova_group = 3
            confidence = 0.85
            evidence.append(f"Contains processed culinary ingredients ({', '.join(detected_culinary[:2])}) combined with primary foods")
            explanation = "Classified as NOVA 3 (Processed Food): Manufactured by adding culinary ingredients (salt, oil, sugar) to unprocessed foods."
            
        elif ingredient_count <= 2 and any(kw in text for kw in ["oil", "butter", "sugar", "salt", "ghee"]):
            nova_group = 2
            confidence = 0.90
            evidence.append("Single or dual culinary substance extracted from natural food")
            explanation = "Classified as NOVA 2 (Processed Culinary Ingredient): Obtained directly from nature by pressing, refining, or milling."
            
        else:
            nova_group = 1
            confidence = 0.88
            evidence.append("Unprocessed or minimally processed raw ingredients")
            explanation = "Classified as NOVA 1 (Unprocessed or Minimally Processed Food): Whole food subjected to cleaning, grinding, drying, or refrigeration without industrial additives."

        return {
            "nova": nova_group,
            "confidence": round(confidence, 2),
            "status": "MODEL PREDICTION",
            "evidence": evidence,
            "detected_additives_count": len(detected_upf_indicators),
            "ingredient_count": ingredient_count,
            "explanation": explanation
        }
