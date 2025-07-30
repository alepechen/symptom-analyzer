from fastapi import FastAPI, HTTPException, Depends
from transformers import pipeline, AutoModelForSequenceClassification
import torch
from functools import lru_cache
from typing import List
import asyncio
from models import SymptomsRequest
import json
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:3000",  
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,            
    allow_credentials=True,
    allow_methods=["*"],              
    allow_headers=["*"],              
)

with open("data/label_map.json", "r") as f:
    label_map = json.load(f)

model = None

@app.on_event("startup")
def load_model():
    global model
    if model is None:
        model_name = "shanover/symps_disease_bert_v3_c41"
        model = pipeline("text-classification", model=model_name)

# Async-compatible inference using asyncio.to_thread
async def run_prediction(model, symptoms: str):
    return await asyncio.to_thread(model, symptoms)

def preprocess_symptoms(symptom_entries: List[SymptomsRequest]) -> str:
    formatted_symptoms = []
    
    for entry in symptom_entries:
        symptom = entry.symptom.lower().strip()
        severity = entry.severity.lower().strip()
        duration = entry.duration.lower().strip()
        symptom_text = f"{symptom} for {duration} ({severity})"
        formatted_symptoms.append(symptom_text)
    symptom_summary = " and ".join(formatted_symptoms)
    return f"I have the following symptoms: {symptom_summary}."


@app.post("/predict/")
async def predict_diagnosis(request: List[SymptomsRequest]):
    try:
        if model is None:
            raise HTTPException(status_code=500, detail="Model not loaded")
        clean_text = preprocess_symptoms(request)
        prediction = await run_prediction(model, clean_text)
        label = prediction[0]['label']
        confidence = prediction[0]['score']
        diagnosis = label_map.get(label, label)
        return {"diagnosis": diagnosis, "confidence": confidence}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
async def read_root():
    return {"message": "Symptom-to-Diagnosis API is running!"}
