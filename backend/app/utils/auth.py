from datetime import datetime, timedelta
import jwt, bcrypt
from fastapi import HTTPException, status
from ..core.config import settings

ALG = "HS256"
TTL_HOURS = 24

def hash_pw(pwd: str) -> str:
    return bcrypt.hashpw(pwd.encode(), bcrypt.gensalt()).decode()

def check_pw(pwd: str, hashed: str) -> bool:
    return bcrypt.checkpw(pwd.encode(), hashed.encode())

def create_token(sub: str, email: str) -> str:
    payload = {
        "sub": sub,
        "email": email,
        "exp": datetime.utcnow() + timedelta(hours=TTL_HOURS)
    }
    return jwt.encode(payload, settings().JWT_SECRET, algorithm=ALG)

def verify_token(tok: str) -> dict:
    try:
        return jwt.decode(tok, settings().JWT_SECRET, algorithms=[ALG])
    except jwt.PyJWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token invalid or expired")