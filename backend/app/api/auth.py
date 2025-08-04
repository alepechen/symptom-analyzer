from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer

from database import get_db
from schemas import Token, UserRegister, UserLogin
from services import auth_service
from core.security import decode_access_token

router = APIRouter(prefix="/auth",tags=["auth"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/token")

@router.post("/register", response_model=Token)
def register_user(payload: UserRegister, session: Session = Depends(get_db)):
    user = auth_service.register_user(session, payload.name, payload.email, payload.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username or email already in use"
        )
    token = auth_service.generate_token_for_user(user)
    return {"access_token": token, "token_type": "bearer"}

@router.post("/login", response_model=Token)
def login_user(payload: UserLogin, session: Session = Depends(get_db)):
    user = auth_service.authenticate_user(session, payload.email, payload.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username/email or password"
        )
    token = auth_service.generate_token_for_user(user)
    return {"access_token": token, "token_type": "bearer"}

@router.get("/users/me")
def read_users_me(token: str = Depends(oauth2_scheme), session: Session = Depends(get_db)):
    user = decode_access_token(token, session)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not authorized")
    return {"description": f"{user.name} authorized"}

@router.post("/token", response_model=Token)
def login_token(form_data: OAuth2PasswordRequestForm = Depends(), session: Session = Depends(get_db)):
    user = auth_service.authenticate_user(session, email=form_data.username, password=form_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = auth_service.generate_token_for_user(user)
    return {"access_token": token, "token_type": "bearer"}



