from pydantic import BaseModel, EmailStr
from typing import List, Dict
from datetime import datetime

class UserBase(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserCreate(UserBase):
    pass

class UserRegister(UserBase):
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class User(UserBase):
    id: int

    class Config:
        orm_mode = True
        
class Token(BaseModel):
    access_token: str
    token_type: str

class Doctor(BaseModel):
    id: int
    name: str
    available_days: List[str]  # e.g., ["Monday", "Wednesday", "Friday"]
    working_hours: Dict[str, str]  # e.g., {"start": "09:00", "end": "17:00"}

    class Config:
        orm_mode = True


class DoctorCreate(Doctor):
    pass

class Appointment(BaseModel):
    id: int
    appointment_time: datetime
    status: str
    doctor: Doctor
    
    class Config:
        orm_mode = True


class AppointmentCreate(Appointment):
    patient_id: int
    doctor_id: int


