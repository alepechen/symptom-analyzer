from fastapi import APIRouter, HTTPException, Depends
from typing import List
from models import SymptomsRequest, User
from services.diagnosis_service import predict_diagnosis
from dependencies.auth import get_current_user

router = APIRouter()

@router.post("/predict/")
async def predict(request: List[SymptomsRequest],user: User = Depends(get_current_user)):
    try:
        return await predict_diagnosis(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/")
async def root():
    return {"message": "Symptom-to-Diagnosis API is running!"}
