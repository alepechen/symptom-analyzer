from sqlalchemy.orm import Session
from repositories import doctor_repository, appointment_repository
import schemas
from datetime import date, datetime, timedelta
from typing import List

def create_doctor(session: Session, doctor: schemas.DoctorCreate):
    return doctor_repository.create_doctor(session, doctor)

def get_doctor(session: Session, doctor_id: int):
    return doctor_repository.get_doctor(session, doctor_id)

def get_doctors(session: Session):
    return doctor_repository.get_doctors(session)

def is_slot_booked(appointments: List[schemas.Appointment], current_time: datetime) -> bool: 
    return any(
        appointment.appointment_time <= current_time < (appointment.appointment_time + timedelta(minutes=30))
        for appointment in appointments
    )

def get_available_slots(session: Session, doctor_id: int, date: date):
        doctor = doctor_repository.get_doctor(session, doctor_id)
        if not doctor:
            return []
        day_of_week = date.strftime("%A")  # Get the day of the week (e.g., "Monday")
        if day_of_week not in doctor.available_days:
            return []

        # Generate the available time slots based on working hours
        working_start = datetime.strptime(doctor.working_hours['start'], "%H:%M").time()
        working_end = datetime.strptime(doctor.working_hours['end'], "%H:%M").time()
        appointments = appointment_repository.get_appointments_by_doctor_date(session, doctor_id, date)
        
        available_slots = []
        current_time = datetime.combine(date, working_start)
        end_time = datetime.combine(date, working_end)
        while current_time < end_time:
            slot = current_time.strftime("%H:%M")
            if not is_slot_booked(appointments, current_time):
                available_slots.append(current_time.strftime("%H:%M"))
            current_time += timedelta(minutes=30)

        return available_slots
