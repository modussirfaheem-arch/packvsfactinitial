from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

# --- Grok Vision Analysis Models ---

class ProductIdentitySchema(BaseModel):
    name: Optional[str] = None
    brand: Optional[str] = None
    category: Optional[str] = None
    variant: Optional[str] = None
    package_size: Optional[str] = None
    barcode: Optional[str] = None

class ClaimItemSchema(BaseModel):
    text: str
    type: Optional[str] = "General"
    confidence: Optional[float] = 0.9

class NutritionFactsSchema(BaseModel):
    serving_size: Optional[str] = "100g"
    calories: Optional[float] = None
    sugar_g: Optional[float] = None
    added_sugar_g: Optional[float] = None
    protein_g: Optional[float] = None
    fiber_g: Optional[float] = None
    fat_g: Optional[float] = None
    saturated_fat_g: Optional[float] = None
    trans_fat_g: Optional[float] = None
    sodium_mg: Optional[float] = None
    salt_g: Optional[float] = None
    carbohydrates_g: Optional[float] = None

class IngredientItemSchema(BaseModel):
    name: str
    role: Optional[str] = "Ingredient"
    context: Optional[str] = "Standard food component"
    attention_level: Optional[str] = "LOW" # LOW, MODERATE, ATTENTION

class GrokAnalysisResponse(BaseModel):
    product: ProductIdentitySchema
    claims: List[ClaimItemSchema] = []
    nutrition: NutritionFactsSchema
    ingredients: List[IngredientItemSchema] = []
    allergens: List[str] = []
    positive_attributes: List[str] = []
    attention_points: List[str] = []
    uncertainties: List[str] = []
    confidence: float = 0.85

# --- PackVsFact Deterministic Engine Output Models ---

class ClaimVerificationSchema(BaseModel):
    claim_text: str
    claim_type: str
    status: str # SUPPORTED, PARTIALLY SUPPORTED, NEEDS CONTEXT, MISLEADING
    reality_explanation: str

class ScoreBreakdownSchema(BaseModel):
    nutrition_quality: int
    ingredient_profile: int
    sugar_impact: int
    protein_content: int
    fiber_content: int
    sodium_level: int
    marketing_reality: int
    claim_transparency: int

class DetailedScoreSchema(BaseModel):
    total_score: int
    grade: str # EXCELLENT, GOOD, MODERATE, LOW, VERY LOW
    breakdown: ScoreBreakdownSchema
    health_halo_detected: bool
    health_halo_reason: Optional[str] = None
    positive_attributes: List[str] = []
    attention_points: List[str] = []

class AlternativeProductSchema(BaseModel):
    id: int
    name: str
    brand: str
    category: str
    score: int
    image_url: Optional[str] = None
    why_better: str

class FullProductResponse(BaseModel):
    id: Optional[int] = None
    name: str
    brand: Optional[str] = None
    category: Optional[str] = None
    variant: Optional[str] = None
    package_size: Optional[str] = None
    barcode: Optional[str] = None
    image_url: Optional[str] = None
    score: int
    grade: str
    marketing_reality_score: int
    health_halo_detected: bool
    health_halo_reason: Optional[str] = None
    
    score_breakdown: ScoreBreakdownSchema
    nutrition: NutritionFactsSchema
    ingredients: List[IngredientItemSchema]
    claims: List[ClaimVerificationSchema]
    positive_attributes: List[str]
    attention_points: List[str]
    alternatives: List[AlternativeProductSchema] = []
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# --- API Interaction Schemas ---

class ProductSearchItem(BaseModel):
    id: int
    name: str
    brand: Optional[str]
    category: Optional[str]
    score: int
    grade: str
    image_url: Optional[str]
    health_halo_detected: bool

    class Config:
        from_attributes = True

class CompareRequest(BaseModel):
    product_ids: List[int]

class CompareResponse(BaseModel):
    products: List[FullProductResponse]
    metrics_comparison: dict

class FoodWatchAlertSchema(BaseModel):
    id: int
    title: str
    source: str
    source_url: Optional[str]
    alert_date: str
    location: str
    category: str
    severity: str
    details: str
    is_verified: bool

    class Config:
        from_attributes = True

class AnalyticsOverviewResponse(BaseModel):
    total_scans: int
    total_products_indexed: int
    average_score: float
    health_halo_percentage: float
    top_claims: List[dict]
    category_distribution: List[dict]
    attention_triggers: List[dict]
    recent_alerts_count: int

# --- Auth Schemas ---

class UserCreate(BaseModel):
    email: str
    password: str
    full_name: Optional[str] = None

class UserLogin(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict
