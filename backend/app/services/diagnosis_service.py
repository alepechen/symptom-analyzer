import asyncio
from typing import List
from models import SymptomsRequest
from core.model_loader import load_model, load_label_map

model = load_model()
label_map = load_label_map()

async def run_prediction(symptoms: str):
    return await asyncio.to_thread(model, symptoms)

def preprocess_symptoms(symptom_entries: List[SymptomsRequest]) -> str:
    formatted = [
        f"{entry.symptom.lower().strip()} for {entry.duration.lower().strip()} ({entry.severity.lower().strip()})"
        for entry in symptom_entries
    ]
    return f"I have the following symptoms: {' and '.join(formatted)}."

async def predict_diagnosis(symptoms: List[SymptomsRequest]):
    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded")
    clean_text = preprocess_symptoms(symptoms)
    prediction = await run_prediction(clean_text)
    label = prediction[0]['label']
    confidence = prediction[0]['score']
    diagnosis = label_map.get(label, label)
    return {"diagnosis": diagnosis, "confidence": confidence}
    
