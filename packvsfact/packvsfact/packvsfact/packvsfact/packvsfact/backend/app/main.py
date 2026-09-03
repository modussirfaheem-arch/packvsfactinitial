"""
PACKVSFACT FastAPI Backend Application Entry Point
"""

import sys
import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Ensure path resolution
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
BACKEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

from app.config import settings
from app.database import engine, Base
from app.seed_db import seed_database
from app.routers import auth, products, ocr, assistant, recommendations, compare, demand, verification, admin, privacy

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup tasks: Initialize database tables & seed demo data if empty
    Base.metadata.create_all(bind=engine)
    seed_database()
    yield

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="PACKVSFACT — Know what's inside. Know what's better. India-First AI Food Intelligence Platform.",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Routers
app.include_router(auth.router)
app.include_router(products.router)
app.include_router(ocr.router)
app.include_router(assistant.router)
app.include_router(recommendations.router)
app.include_router(compare.router)
app.include_router(demand.router)
app.include_router(verification.router)
app.include_router(admin.router)
app.include_router(privacy.router)

@app.get("/", tags=["System"])
def root():
    return {
        "product": "PACKVSFACT",
        "tagline": "Know what's inside. Know what's better.",
        "status": "ONLINE",
        "version": settings.APP_VERSION,
        "execution_mode": "LOCAL_SELF_HOSTED",
        "paid_apis": "NONE (100% Local Models)",
        "docs_url": "/docs"
    }

@app.get("/api/health", tags=["System"])
def health_check():
    return {
        "status": "HEALTHY",
        "database": "CONNECTED",
        "nutriscore_engine": "ACTIVE (2023/2024 EU Update)",
        "nova_model": "ACTIVE (Hybrid Rule + Classifier)",
        "ml_models": "6 SCIKIT-LEARN MODELS LOADED",
        "ocr_service": "ACTIVE",
        "local_assistant": "ACTIVE (10 Indian Languages)"
    }
