import os
from pathlib import Path

# Base directory for backend
BASE_DIR = Path(__file__).resolve().parent.parent

class Settings:
    APP_NAME: str = "PackVsFact API"
    APP_VERSION: str = "1.0.0"
    
    # xAI Grok API Configuration
    XAI_API_KEY: str = os.getenv("XAI_API_KEY", "")
    GROK_MODEL: str = os.getenv("GROK_MODEL", "grok-2-vision-1212")
    XAI_BASE_URL: str = "https://api.x.ai/v1"
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///../../database/packvsfact.db")
    
    # CORS
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "*"
    ]
    
    # JWT Auth
    SECRET_KEY: str = os.getenv("SECRET_KEY", "packvsfact_sih_super_secret_jwt_key_2026")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days

settings = Settings()
