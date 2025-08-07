from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class Appointment(Base):
    __tablename__ = 'appointments'

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey('users.id'))
    doctor_id = Column(Integer, ForeignKey('doctors.id'))
    appointment_time = Column(DateTime, default=datetime.utcnow)
    status = Column(String)

    patient = relationship("User", back_populates="appointments")
    doctor = relationship("Doctor", back_populates="appointments")