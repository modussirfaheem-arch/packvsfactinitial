"""
Comprehensive Test Suite (PACKVSFACT)
Executes unit, integration, ML model, Nutri-Score, NOVA, OCR, and API security tests using pytest.
"""

import sys
import os
import pytest
from fastapi.testclient import TestClient

# Ensure sys.path contains root and backend
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
BACKEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend"))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

from models.nutriscore.scoring import NutriScoreEngine
from models.nova.classifier import NovaClassifier
from app.services.security_service import SecurityService
from app.services.claim_engine import ClaimVerificationEngine
from app.services.assistant_service import AssistantService
from app.main import app

client = TestClient(app)

def test_nutriscore_calculation():
    res = NutriScoreEngine.calculate(
        energy_kj=1800.0,
        sugars_g=25.0,
        sat_fat_g=8.0,
        sodium_mg=900.0,
        fibre_g=1.0,
        protein_g=4.0
    )
    assert res["status"] == "CALCULATED"
    assert res["grade"] in ["D", "E"]
    assert "negative_points" in res["components"]
    assert "positive_points" in res["components"]

def test_nova_classification():
    res = NovaClassifier.classify("refined wheat flour, palm oil, ins 621 msg, ins 319 tbhq, artificial flavouring")
    assert res["nova"] == 4
    assert res["status"] == "MODEL PREDICTION"
    assert len(res["evidence"]) > 0

def test_security_hashing_and_jwt():
    hashed = SecurityService.hash_password("SecretPass123!")
    assert SecurityService.verify_password("SecretPass123!", hashed) is True
    assert SecurityService.verify_password("WrongPass", hashed) is False

    token = SecurityService.create_access_token({"sub": "1", "email": "test@packvsfact.in", "role": "USER"})
    decoded = SecurityService.decode_access_token(token)
    assert decoded["email"] == "test@packvsfact.in"

def test_claim_verification():
    res = ClaimVerificationEngine.verify_claim("High Fibre Snack", {"fibre_g": 7.5, "sugar_g": 2.0})
    assert res["status"] == "SUPPORTED BY AVAILABLE DATA"

    res_neg = ClaimVerificationEngine.verify_claim("High Protein bar", {"protein_g": 2.0})
    assert res_neg["status"] == "NOT SUPPORTED BY CURRENT DATA"

def test_multilingual_assistant():
    res_en = AssistantService.answer_query("What is NOVA?", lang="en")
    assert "NOVA classifies" in res_en["answer"]

    res_hi = AssistantService.answer_query("NOVA क्या है?", lang="hi")
    assert "NOVA" in res_hi["answer"]

def test_api_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "HEALTHY"

def test_api_product_search():
    response = client.get("/api/products/search?q=Noodles")
    assert response.status_code == 200
    data = response.json()
    assert data["count"] > 0
    assert "Maggi" in data["products"][0]["name"] or "Yippee" in data["products"][0]["name"] or "Noodles" in data["products"][0]["name"]

def test_api_barcode_lookup():
    response = client.get("/api/products/barcode/8901058000108")
    assert response.status_code == 200
    assert response.json()["found"] is True

    # Missing barcode strict check
    res_missing = client.get("/api/products/barcode/9999999999999")
    assert res_missing.status_code == 200
    assert res_missing.json()["found"] is False
    assert "not available" in res_missing.json()["message"]

def test_api_recommendations():
    # First search for a product ID
    p_res = client.get("/api/products/search?q=Noodles")
    pid = p_res.json()["products"][0]["id"]

    response = client.get(f"/api/recommendations/alternatives?product_id={pid}&max_budget_inr=30")
    assert response.status_code == 200
    data = response.json()
    assert "alternatives" in data

def test_api_product_comparison():
    response = client.get("/api/compare/products?ids=1,2,3")
    assert response.status_code == 200
    data = response.json()
    assert data["count"] == 3

def test_api_admin_overview():
    response = client.get("/api/admin/overview")
    assert response.status_code == 200
    data = response.json()
    assert "metrics" in data
    assert data["metrics"]["total_products"] >= 50
