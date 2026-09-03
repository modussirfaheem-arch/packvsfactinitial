# PACKVSFACT — Know What's Inside. Know What's Better.

PACKVSFACT is an India-first food intelligence platform that helps consumers understand packaged food products by calculating Nutri-Scores, classifying NOVA ultra-processing levels, analyzing ingredient risks, detecting allergens, verifying packaging marketing claims, and recommending budget-aware healthier alternatives.

## Core Features
1. **Nutri-Score Engine**: Official 2023/2024 EU Nutri-Score calculation (Grades A to E) with component score breakdown and explanations labeled `[CALCULATED]`.
2. **NOVA Classification Model**: Ultra-processing classifier (Groups 1 to 4) using TF-IDF text features, industrial additive detectors, and Scikit-Learn Random Forests labeled `[MODEL PREDICTION]`.
3. **6 Local Scikit-Learn ML Pipelines**:
   - NOVA Ultra-Processing Classifier
   - Food Health Recommender
   - Alternative Ranking Model
   - Ingredient Risk Classifier
   - Demand Anomaly Detector (Isolation Forest)
   - Product Similarity Model (Nearest Neighbors Cosine Similarity)
4. **50+ Indian Food Seed Dataset**: Grounded in ₹ INR pricing, barcodes, ingredient lists, and nutrition profiles across 15+ Indian food categories.
5. **Local OCR Label Scanner**: Extracts nutrition facts and ingredient statements locally via OpenCV, Pillow, and Tesseract, followed by an interactive user editing/confirmation UI.
6. **Local Multilingual AI Assistant**: Answers queries locally in 10 Indian languages (English, Hindi, Marathi, Tamil, Telugu, Bengali, Gujarati, Kannada, Malayalam, Punjabi) with zero paid API dependency.
7. **Claim vs Fact Verification**: Validates claims ("High Fibre", "Zero Added Sugar", "Low Sodium") against ICMR/FSSAI nutrient standards.
8. **Budget-Aware Healthier Alternatives**: Transparent composite scoring formula ranking options ≤ ₹30.
9. **Side-by-Side Product Comparison**: Compare 2 to 5 products with automated highlights.
10. **Demand Intelligence & Surge Alerts**: Isolation Forest anomaly detection for category scan surges with real-time admin popups.
11. **Admin Dashboard & Verification Workflow**: Complete overview, lab evidence discrepancy checker, model retraining dashboard, and security audit logs.
12. **Defense-in-Depth Security & Data Sovereignty**: JWT auth, salt+sha256 password hashing, RBAC, input validation, data export, and account deletion.

## Quick Start
```bash
# 1. Train ML Models
python ml/train_all_models.py

# 2. Seed Database
python backend/app/seed_db.py

# 3. Run Automated Tests
pytest tests/test_backend_and_ml.py

# 4. Start Backend Server
cd backend
uvicorn app.main:app --reload --port 8000

# 5. Start Frontend Dev Server
cd frontend
npm run dev
```

## Docker Deployment
```bash
docker-compose up --build
```
