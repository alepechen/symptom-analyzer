from sqlalchemy.orm import Session
from repositories import appointment_repository
import schemas

def create_appointment(session: Session, appointment: schemas.AppointmentCreate):
        return appointment_repository.create_appointment(session, appointment)

def get_appointments_by_patient(session: Session, patient_id: int):
        return appointment_repository.get_appointments_by_patient(session, patient_id)

def delete_appointment(session: Session, appointment_id: int):
     return appointment_repository.delete_appointment(session, appointment_id)   