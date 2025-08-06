from sqlalchemy import Column, Integer, String, JSON
from sqlalchemy.orm import relationship
from database import Base

class Doctor(Base):
    __tablename__ = 'doctors'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    specialty = Column(String)
    
    available_days = Column(JSON)  # List of available days like ["Monday", "Wednesday", "Friday"]
    working_hours = Column(JSON)  # Dictionary with start and end working hours like {"start": "09:00", "end": "17:00"}

    appointments = relationship("Appointment", back_populates="doctor")
