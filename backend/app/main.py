from fastapi import FastAPI, HTTPException, Depends
from transformers import pipeline, AutoModelForSequenceClassification
import torch
from functools import lru_cache
import asyncio
from models import SymptomsRequest
import json

app = FastAPI()

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

def preprocess_symptoms(raw_symptoms: str, severity: str) -> str:
    text = raw_symptoms.lower().strip()
    
    # Replace commas with 'and' for better natural flow
    text = text.replace(",", " and")
    
    # Add a phrase prefix to make it sound more natural
    text = f"I have the following {severity.lower()} symptoms: {text}."
    return text


@app.post("/predict/")
async def predict_diagnosis(request: SymptomsRequest):
    try:
        if model is None:
            raise HTTPException(status_code=500, detail="Model not loaded")
        clean_text = preprocess_symptoms(request.symptoms, request.severity)
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
