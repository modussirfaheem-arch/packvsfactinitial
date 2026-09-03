import os
import sys

# Add backend directory to sys.path so app.main can be imported natively by Vercel
root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
backend_dir = os.path.join(root_dir, "backend")
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from backend.app.database import engine, Base
from backend.app.main import app

# Ensure SQLite database tables are created on Vercel cold-start
try:
    Base.metadata.create_all(bind=engine)
    from backend.app.seed_db import seed_database
    seed_database()
except Exception as e:
    print(f"Vercel DB Init Warning: {e}")
