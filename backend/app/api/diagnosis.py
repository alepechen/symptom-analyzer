from fastapi import APIRouter, HTTPException
from typing import List
from models import SymptomsRequest
from services.diagnosis_service import predict_diagnosis

router = APIRouter()

@router.post("/predict/")
async def predict(request: List[SymptomsRequest]):
    try:
        return await predict_diagnosis(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/")
async def root():
    return {"message": "Symptom-to-Diagnosis API is running!"}
