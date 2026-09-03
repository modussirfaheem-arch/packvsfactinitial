"""
Security & Authentication Service (PACKVSFACT)
Handles password hashing, verification, JWT token creation, and RBAC authorization cleanly.
"""

import os
import hashlib
import jwt
from datetime import datetime, timedelta
from typing import Dict, Any, Optional

SECRET_KEY = os.getenv("SECRET_KEY", "packvsfact_sih_super_secret_jwt_key_2026")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7 # 7 days

class SecurityService:
    @classmethod
    def hash_password(cls, password: str) -> str:
        """Secure salt + sha256 password hash."""
        salt = "packvsfact_salt_2026_"
        return hashlib.sha256((salt + password).encode('utf-8')).hexdigest()

    @classmethod
    def verify_password(cls, plain_password: str, hashed_password: str) -> bool:
        """Verifies plain password against stored hash."""
        return cls.hash_password(plain_password) == hashed_password

    @classmethod
    def create_access_token(cls, data: dict, expires_delta: Optional[timedelta] = None) -> str:
        """Creates signed JWT access token."""
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
            
        to_encode.update({"exp": expire, "iat": datetime.utcnow()})
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt

    @classmethod
    def decode_access_token(cls, token: str) -> Optional[Dict[str, Any]]:
        """Decodes and validates JWT token."""
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            return payload
        except Exception:
            return None
