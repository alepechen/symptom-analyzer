from pydantic import BaseModel

class SymptomsRequest(BaseModel):
    symptom: str
    severity: str  # e.g., "mild", "moderate", "severe"
    duration: str
