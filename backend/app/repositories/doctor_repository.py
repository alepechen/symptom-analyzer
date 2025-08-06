from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from typing import List
from models import Doctor
import schemas

def create_doctor(session: Session, doctor: schemas.DoctorCreate) -> Doctor:
    db_doctor = Doctor(**doctor.dict())
    session.add(db_doctor)
    try:
        session.commit()
        session.refresh(db_doctor)
    except IntegrityError:
        session.rollback()
        return
    return db_doctor

def get_doctor(session: Session, doctor_id: int) -> Doctor:
    return session.query(Doctor).filter(Doctor.id == doctor_id).first()

def get_doctors(session: Session) -> List[Doctor]:
    return session.query(Doctor).all()