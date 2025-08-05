from pydantic import BaseModel
from typing import Optional
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from services import user_service
import schemas

router = APIRouter(prefix="/users", tags=["users"])

""" @router.post("/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    return user_service.create_user(db, user) """

""" @router.get("/{user_email}", response_model=Optional[schemas.User])
def read_user(user_email: str, db: Session = Depends(get_db)):
    return user_service.get_user_by_email(db, user_email) """

