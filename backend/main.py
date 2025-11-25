from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import pickle

app = FastAPI()

# --------------------------
# CORS (Allow frontend to call backend)
# --------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # In production put your Vercel domain here
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------------------
# Load the ML Model
# --------------------------
with open("models/hmpi_api_basic.pkl", "rb") as f:
    model = pickle.load(f)

# --------------------------
# Predict Endpoint
# --------------------------
@app.post("/predict_hmpi")
def predict_hmpi(payload: dict):
    data = payload["data"]

    features = [
        float(data["Pb"]), float(data["Cd"]), float(data["Cr"]),
        float(data["As"]), float(data["Zn"]), float(data["Fe"]),
        float(data["Cu"])
    ]

    prediction = model.predict([features])[0]

    return {"prediction": float(prediction)}

@app.get("/")
def read_root():
    return {"message": "Backend is running"}
