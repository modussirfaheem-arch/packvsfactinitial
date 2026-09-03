"""
Nutri-Score Calculation Engine (PACKVSFACT)
Official methodology implementation (2023/2024 update standard) for solid foods and beverages.
Calculates N-points (energy, sugars, saturated fat, sodium) and P-points (fibre, protein, fruits/vegetables/legumes/nuts).
"""

from typing import Dict, Any, List, Tuple

class NutriScoreEngine:
    VERSION = "2023-2024 (Official EU Update)"
    
    # Energy thresholds in kJ per 100g (1 kcal = 4.184 kJ)
    ENERGY_THRESHOLDS = [335, 670, 1005, 1340, 1675, 2010, 2345, 2680, 3015, 3350]
    
    # Sugars thresholds in g per 100g
    SUGAR_THRESHOLDS = [3.4, 6.8, 10.0, 14.0, 17.0, 21.0, 24.0, 28.0, 31.0, 35.0, 38.0, 42.0, 45.0, 49.0, 53.0]
    
    # Saturated fat thresholds in g per 100g
    SAT_FAT_THRESHOLDS = [1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0]
    
    # Sodium thresholds in mg per 100g (Sodium mg = Salt g * 400)
    SODIUM_THRESHOLDS = [90, 180, 270, 360, 450, 540, 630, 720, 810, 900, 990, 1080, 1170, 1260, 1350, 1440, 1530, 1620, 1710, 1800]
    
    # Fibre thresholds in g per 100g
    FIBRE_THRESHOLDS = [0.9, 1.9, 2.8, 3.7, 4.7]
    
    # Protein thresholds in g per 100g
    PROTEIN_THRESHOLDS = [2.4, 4.8, 7.2, 9.6, 12.0, 14.4, 16.8]

    @classmethod
    def get_points(cls, value: float, thresholds: List[float]) -> int:
        points = 0
        for thresh in thresholds:
            if value > thresh:
                points += 1
            else:
                break
        return points

    @classmethod
    def calculate(cls, 
                  energy_kj: float, 
                  sugars_g: float, 
                  sat_fat_g: float, 
                  sodium_mg: float, 
                  fibre_g: float = 0.0, 
                  protein_g: float = 0.0, 
                  fruit_veg_pct: float = 0.0,
                  is_beverage: bool = False) -> Dict[str, Any]:
        """
        Calculate official Nutri-Score score and grade.
        Inputs are normalized per 100g or 100ml.
        """
        # Ensure non-negative input values
        energy_kj = max(0.0, float(energy_kj or 0.0))
        sugars_g = max(0.0, float(sugars_g or 0.0))
        sat_fat_g = max(0.0, float(sat_fat_g or 0.0))
        sodium_mg = max(0.0, float(sodium_mg or 0.0))
        fibre_g = max(0.0, float(fibre_g or 0.0))
        protein_g = max(0.0, float(protein_g or 0.0))
        fruit_veg_pct = max(0.0, min(100.0, float(fruit_veg_pct or 0.0)))

        # Calculate Negative (N) Points
        n_energy = cls.get_points(energy_kj, cls.ENERGY_THRESHOLDS)
        n_sugars = cls.get_points(sugars_g, cls.SUGAR_THRESHOLDS)
        n_sat_fat = cls.get_points(sat_fat_g, cls.SAT_FAT_THRESHOLDS)
        n_sodium = cls.get_points(sodium_mg, cls.SODIUM_THRESHOLDS)

        total_n = n_energy + n_sugars + n_sat_fat + n_sodium

        # Calculate Positive (P) Points
        p_fibre = cls.get_points(fibre_g, cls.FIBRE_THRESHOLDS)
        p_protein = cls.get_points(protein_g, cls.PROTEIN_THRESHOLDS)
        
        # Fruits, Vegetables, Legumes & Nuts points
        if fruit_veg_pct > 80.0:
            p_fv = 5
        elif fruit_veg_pct > 60.0:
            p_fv = 2
        elif fruit_veg_pct > 40.0:
            p_fv = 1
        else:
            p_fv = 0

        total_p_all = p_fibre + p_protein + p_fv

        # Protein rule constraint: if N >= 11 and FV points < 5, protein points are excluded
        if total_n >= 11 and p_fv < 5:
            final_score = total_n - (p_fibre + p_fv)
            protein_applied = False
        else:
            final_score = total_n - total_p_all
            protein_applied = True

        # Determine Grade based on Category
        if is_beverage:
            if final_score <= 0:
                grade = "B"
            elif final_score <= 5:
                grade = "C"
            elif final_score <= 9:
                grade = "D"
            else:
                grade = "E"
        else:
            if final_score <= -1:
                grade = "A"
            elif final_score <= 2:
                grade = "B"
            elif final_score <= 10:
                grade = "C"
            elif final_score <= 18:
                grade = "D"
            else:
                grade = "E"

        # Generate Explanations
        pos_explanations = []
        neg_explanations = []

        if p_fibre > 0:
            pos_explanations.append(f"Good dietary fibre content ({fibre_g:.1f}g/100g -> +{p_fibre} pts)")
        if p_protein > 0 and protein_applied:
            pos_explanations.append(f"Contains protein ({protein_g:.1f}g/100g -> +{p_protein} pts)")
        elif p_protein > 0 and not protein_applied:
            neg_explanations.append(f"Protein score (+{p_protein} pts) capped due to high saturated fat/sugar/sodium levels")
        if p_fv > 0:
            pos_explanations.append(f"High fruit/vegetable/pulse ratio ({fruit_veg_pct:.0f}% -> +{p_fv} pts)")

        if n_sugars >= 4:
            neg_explanations.append(f"Elevated sugar content ({sugars_g:.1f}g/100g -> -{n_sugars} pts)")
        if n_sat_fat >= 3:
            neg_explanations.append(f"High saturated fat ({sat_fat_g:.1f}g/100g -> -{n_sat_fat} pts)")
        if n_sodium >= 4:
            neg_explanations.append(f"High sodium level ({sodium_mg:.0f}mg/100g -> -{n_sodium} pts)")
        if n_energy >= 5:
            neg_explanations.append(f"High energy density ({energy_kj:.0f} kJ/100g -> -{n_energy} pts)")

        if not pos_explanations:
            pos_explanations.append("Low in positive nutrients (low fibre, protein, or fruit/veg content)")
        if not neg_explanations:
            neg_explanations.append("Low levels of sugars, saturated fats, and sodium")

        return {
            "grade": grade,
            "score": final_score,
            "status": "CALCULATED",
            "algorithm_version": cls.VERSION,
            "methodology": "Official Nutri-Score standard (2023/2024 update)",
            "components": {
                "negative_points": {
                    "energy": n_energy,
                    "sugars": n_sugars,
                    "sat_fat": n_sat_fat,
                    "sodium": n_sodium,
                    "total": total_n
                },
                "positive_points": {
                    "fibre": p_fibre,
                    "protein": p_protein,
                    "fruit_veg": p_fv,
                    "protein_applied": protein_applied,
                    "total": total_p_all
                }
            },
            "explanation": {
                "positive": pos_explanations,
                "negative": neg_explanations
            }
        }
