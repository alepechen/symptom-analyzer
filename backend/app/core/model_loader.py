import json
from transformers import pipeline
import torch

label_map = None
model = None

def load_label_map():
    global label_map
    if label_map is None:
        with open("data/label_map.json", "r") as f:
            label_map = json.load(f)
    return label_map

def load_model():
    global model
    if model is None:
        model_name = "shanover/symps_disease_bert_v3_c41"
        model = pipeline("text-classification", model=model_name)
    return model
