from pydantic import BaseModel

class SymptomsRequest(BaseModel):
    symptoms: str
    severity: str  # e.g., "mild", "moderate", "severe"
