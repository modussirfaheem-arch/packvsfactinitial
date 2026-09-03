from sqlalchemy import Column, Integer, String, Float, Boolean, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=True)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="USER") # USER, ADMIN, REVIEWER, LAB_VERIFIER
    created_at = Column(DateTime, default=datetime.utcnow)

    preferences = relationship("UserPreference", back_populates="user", uselist=False)
    scans = relationship("UserScan", back_populates="user")
    audit_logs = relationship("AuditLog", back_populates="user")


class AdminUser(Base):
    __tablename__ = "admin_users"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    privileges = Column(String, default="FULL_ADMIN")
    created_at = Column(DateTime, default=datetime.utcnow)


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    barcode = Column(String, index=True, nullable=True, unique=True)
    name = Column(String, index=True, nullable=False)
    brand = Column(String, index=True, nullable=True)
    category = Column(String, index=True, nullable=True)
    serving_size = Column(String, nullable=True)
    price = Column(Float, default=0.0)
    currency = Column(String, default="INR")
    image = Column(String, nullable=True)
    ingredients_text = Column(Text, nullable=True)
    
    nutri_score_grade = Column(String, default="C") # A, B, C, D, E
    nutri_score_value = Column(Integer, default=5)
    nova_group = Column(Integer, default=4) # 1, 2, 3, 4
    insight_score = Column(Integer, default=65) # 0-100 breakdown
    
    verification_status = Column(String, default="DEMO") # DEMO, USER SUBMITTED, UNVERIFIED, VERIFIED, LAB VERIFIED
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    nutrition = relationship("Nutrition", back_populates="product", uselist=False, cascade="all, delete-orphan")
    ingredients = relationship("Ingredient", back_populates="product", cascade="all, delete-orphan")
    claims = relationship("Claim", back_populates="product", cascade="all, delete-orphan")
    versions = relationship("ProductVersion", back_populates="product", cascade="all, delete-orphan")
    verification_records = relationship("VerificationRecord", back_populates="product", cascade="all, delete-orphan")
    lab_reports = relationship("LabReport", back_populates="product", cascade="all, delete-orphan")


class Nutrition(Base):
    __tablename__ = "nutrition"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    
    calories = Column(Float, default=0.0)
    energy_kj = Column(Float, default=0.0)
    sugar_g = Column(Float, default=0.0)
    added_sugar_g = Column(Float, default=0.0)
    protein_g = Column(Float, default=0.0)
    fibre_g = Column(Float, default=0.0)
    saturated_fat_g = Column(Float, default=0.0)
    total_fat_g = Column(Float, default=0.0)
    sodium_mg = Column(Float, default=0.0)
    salt_g = Column(Float, default=0.0)
    trans_fat_g = Column(Float, default=0.0)
    fruit_veg_pct = Column(Float, default=0.0)

    product = relationship("Product", back_populates="nutrition")


class Ingredient(Base):
    __tablename__ = "ingredients"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    
    name = Column(String, nullable=False)
    category = Column(String, nullable=True) # Sweetener, Preservative, Emulsifier, etc.
    purpose = Column(String, nullable=True)
    attention_level = Column(String, default="LOW CONCERN") # LOW CONCERN, ATTENTION, HIGH ATTENTION, ALLERGEN, INFORMATIONAL
    explanation = Column(Text, nullable=True)
    position = Column(Integer, default=0)

    product = relationship("Product", back_populates="ingredients")


class Brand(Base):
    __tablename__ = "brands"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    country = Column(String, default="India")
    rating = Column(Float, default=4.0)


class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    description = Column(Text, nullable=True)


class Barcode(Base):
    __tablename__ = "barcodes"

    id = Column(Integer, primary_key=True, index=True)
    barcode_number = Column(String, unique=True, index=True, nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    is_active = Column(Boolean, default=True)


class Price(Base):
    __tablename__ = "prices"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    price_inr = Column(Float, nullable=False)
    retailer = Column(String, default="MRP / General Store")
    recorded_at = Column(DateTime, default=datetime.utcnow)


class ProductVersion(Base):
    __tablename__ = "product_versions"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    version_num = Column(Integer, default=1)
    old_nutrition_json = Column(Text, nullable=True)
    new_nutrition_json = Column(Text, nullable=True)
    old_ingredients = Column(Text, nullable=True)
    new_ingredients = Column(Text, nullable=True)
    old_price = Column(Float, nullable=True)
    new_price = Column(Float, nullable=True)
    changed_at = Column(DateTime, default=datetime.utcnow)

    product = relationship("Product", back_populates="versions")


class Claim(Base):
    __tablename__ = "claims"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    
    claim_text = Column(String, nullable=False)
    claim_type = Column(String, nullable=True) # Fibre, Sugar, Protein, Natural
    status = Column(String, default="NEEDS VERIFICATION") # SUPPORTED BY AVAILABLE DATA, NEEDS VERIFICATION, NOT SUPPORTED BY CURRENT DATA
    reality_explanation = Column(Text, nullable=True)
    confidence = Column(Float, default=0.85)

    product = relationship("Product", back_populates="claims")


class VerificationRecord(Base):
    __tablename__ = "verification_records"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    lab_name = Column(String, nullable=True)
    test_date = Column(String, nullable=True)
    report_ref = Column(String, nullable=True)
    nutrients_tested_json = Column(Text, nullable=True)
    document_hash = Column(String, nullable=True)
    reviewer_id = Column(Integer, nullable=True)
    status = Column(String, default="SUBMITTED") # SUBMITTED, DOCUMENT REVIEW, LAB EVIDENCE, ADMIN REVIEW, APPROVED, REJECTED
    created_at = Column(DateTime, default=datetime.utcnow)

    product = relationship("Product", back_populates="verification_records")


class LabReport(Base):
    __tablename__ = "lab_reports"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    lab_name = Column(String, nullable=False)
    test_date = Column(String, nullable=True)
    package_sodium_mg = Column(Float, nullable=True)
    lab_sodium_mg = Column(Float, nullable=True)
    package_sugar_g = Column(Float, nullable=True)
    lab_sugar_g = Column(Float, nullable=True)
    report_url = Column(String, nullable=True)
    discrepancy_flag = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    product = relationship("Product", back_populates="lab_reports")


class UserPreference(Base):
    __tablename__ = "user_preferences"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, unique=True)
    dietary_pref = Column(String, default="BALANCED") # LOW_SUGAR, LOW_SODIUM, HIGH_PROTEIN, HIGH_FIBRE, VEGETARIAN, VEGAN
    allergies_json = Column(Text, default="[]")
    max_budget_inr = Column(Float, default=100.0)
    save_history = Column(Boolean, default=True)
    local_only = Column(Boolean, default=False)

    user = relationship("User", back_populates="preferences")


class UserScan(Base):
    __tablename__ = "user_scans"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=True)
    barcode = Column(String, nullable=True)
    front_image = Column(String, nullable=True)
    back_image = Column(String, nullable=True)
    ocr_text = Column(Text, nullable=True)
    score = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="scans")


class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    base_product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    recommended_product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    match_score = Column(Float, default=0.0)
    explanation_text = Column(Text, nullable=True)
    price_diff_inr = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)


class DemandEvent(Base):
    __tablename__ = "demand_events"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=True)
    category = Column(String, index=True, nullable=False)
    region = Column(String, default="India-Coarse")
    event_type = Column(String, default="SCAN") # SCAN, SEARCH, COMPARISON
    count_scans = Column(Integer, default=1)
    anomaly_flag = Column(Boolean, default=False)
    timestamp = Column(DateTime, default=datetime.utcnow)


class ModelVersion(Base):
    __tablename__ = "model_versions"

    id = Column(Integer, primary_key=True, index=True)
    model_name = Column(String, index=True, nullable=False)
    version = Column(String, nullable=False)
    accuracy = Column(Float, default=0.0)
    precision_val = Column(Float, default=0.0)
    recall_val = Column(Float, default=0.0)
    f1_score = Column(Float, default=0.0)
    is_active = Column(Boolean, default=True)
    dataset_size = Column(Integer, default=0)
    trained_at = Column(DateTime, default=datetime.utcnow)


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    action = Column(String, nullable=False)
    endpoint = Column(String, nullable=True)
    ip_address = Column(String, nullable=True)
    status_code = Column(Integer, default=200)
    timestamp = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="audit_logs")
