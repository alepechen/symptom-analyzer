from pydantic import BaseModel
from typing import Optional, List
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from datetime import date
from database import get_db
from services import doctor_service
import schemas

router = APIRouter(prefix="/doctors", tags=["doctors"])

@router.post("/", response_model=schemas.Doctor)
def create_doctor(doctor: schemas.DoctorCreate, db: Session = Depends(get_db)):
    return doctor_service.create_doctor(db, doctor)

@router.get("/", response_model=List[schemas.Doctor])
def get_doctors(db: Session = Depends(get_db)):
    return doctor_service.get_doctors(db)

""" @router.get("/{doctor_id}", response_model=Optional[schemas.Doctor])
def get_doctor(doctor_id: int, db: Session = Depends(get_db)):
    return doctor_service.get_doctor(db, doctor_id) """

@router.get("/{doctor_id}/available_slots/")
def get_available_slots(
    doctor_id: int, date: date = Query(...), db: Session = Depends(get_db)
):
    available_slots = doctor_service.get_available_slots(db, doctor_id, date)
    return {"available_slots": available_slots}