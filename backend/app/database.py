import os
from pathlib import Path
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Database path setup (Handle Vercel read-only filesystem by storing in /tmp)
if os.environ.get("VERCEL"):
    DB_PATH = Path("/tmp/packvsfact.db")
else:
    DB_DIR = Path(__file__).resolve().parent.parent.parent / "database"
    DB_DIR.mkdir(parents=True, exist_ok=True)
    DB_PATH = DB_DIR / "packvsfact.db"

SQLALCHEMY_DATABASE_URL = os.environ.get("DATABASE_URL", f"sqlite:///{DB_PATH}")
if SQLALCHEMY_DATABASE_URL.startswith("sqlite") and os.environ.get("VERCEL"):
    SQLALCHEMY_DATABASE_URL = "sqlite:////tmp/packvsfact.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, 
    connect_args={"check_same_thread": False} if SQLALCHEMY_DATABASE_URL.startswith("sqlite") else {}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
