from fastapi import Depends, HTTPException, Header
from sqlalchemy.orm import Session
from database import get_db
from models import User
from jose import jwt, JWTError
from core.security import decode_access_token

def get_current_user(
    authorization: str = Header(...),
    session: Session = Depends(get_db)
) -> User:
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid auth header")
    
    token = authorization.split(" ")[1]
    user = decode_access_token(token, session)
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user
