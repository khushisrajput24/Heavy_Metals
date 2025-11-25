from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import pickle

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the ML Model
with open("models/hmpi_api_basic.pkl", "rb") as f:
    model = pickle.load(f)

@app.post("/predict_hmpi")
def predict_hmpi(payload: dict):
    api_key = payload.get("api_key")

    # Replace this block with your real API logic later
    metals = {
        "Pb": 1.2,
        "Cd": 0.3,
        "Cr": 2.1,
        "As": 0.8,
        "Zn": 3.5,
        "Fe": 10.2,
        "Cu": 0.6,
    }

    features = [
        float(metals["Pb"]), float(metals["Cd"]), float(metals["Cr"]),
        float(metals["As"]), float(metals["Zn"]), float(metals["Fe"]),
        float(metals["Cu"])
    ]

    prediction = model.predict([features])[0]

    return {
        "prediction": float(prediction),
        "used_api_key": api_key,
        "metals_used": metals
    }

@app.get("/")
def read_root():
    return {"message": "Backend is running"}
