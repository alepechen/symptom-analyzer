from pydantic import BaseModel
from typing import Optional, List, Dict
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from services import appointment_service
import schemas

router = APIRouter(prefix="/appointments", tags=["appointments"])

@router.post("/", response_model=schemas.Appointment)
def create_appointment(appointment: schemas.AppointmentCreate, db: Session = Depends(get_db)):
    return appointment_service.create_appointment(db, appointment)


@router.get("/{patient_id}", response_model=List[schemas.Appointment])
def get_appointment(patient_id: int, db: Session = Depends(get_db)):
    return appointment_service.get_appointments_by_patient(db, patient_id)

@router.delete("/{appointment_id}", response_model=Dict)
def delete_appointment(appointment_id: int, db: Session = Depends(get_db)):
    return appointment_service.delete_appointment(db,appointment_id) 

