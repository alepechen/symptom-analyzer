from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from sqlalchemy import func
from typing import List
from datetime import date
from models import Appointment
import schemas

def create_appointment(session: Session, appointment: schemas.AppointmentCreate):
    db_appointment = Appointment(**appointment.dict())
    session.add(db_appointment)
    try:
        session.commit()
        session.refresh(db_appointment)
    except IntegrityError:
        session.rollback()
        return
    return db_appointment

def get_appointment(session: Session, appointment_id: int) -> Appointment:
        return session.query(Appointment).filter(Appointment.id == appointment_id).first()

def get_appointments_by_patient(session: Session, patient_id: int)-> List[Appointment]:
        return session.query(Appointment).filter(Appointment.patient_id == patient_id).all()

def get_appointments_by_doctor_date(session: Session, doctor_id: int, appointment_date: date)-> List[Appointment]:
        return session.query(Appointment).filter(Appointment.doctor_id == doctor_id,func.date(Appointment.appointment_time) == appointment_date).all()

def delete_appointment(session: Session, appointment_id: int) -> dict:
    db_appointment = session.query(Appointment).filter(Appointment.id == appointment_id).first()
    if db_appointment:
        try:
            session.delete(db_appointment)
            session.commit()
            return {"success": True}
        except SQLAlchemyError as e:
            session.rollback()
            raise e