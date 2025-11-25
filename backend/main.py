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

from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import pickle
import numpy as np

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load bulk model
with open("models/hmpi_bulk.pkl", "rb") as f:
    bulk_model = pickle.load(f)

@app.post("/predict_bulk_hmpi")
async def predict_bulk_hmpi(file: UploadFile = File(...)):
    # Read uploaded file
    contents = await file.read()

    # Detect file type
    if file.filename.endswith(".csv"):
        df = pd.read_csv(pd.io.common.BytesIO(contents))
    elif file.filename.endswith(".xlsx"):
        df = pd.read_excel(pd.io.common.BytesIO(contents))
    else:
        return {"error": "Unsupported file type"}

    # EXPECTED columns:
    metals = ["pb", "cd", "hg", "as", "cr", "cu", "zn", "ni"]

    if not all(col in df.columns for col in metals):
        return {"error": "Missing required columns"}

    X = df[metals]

    # Bulk ML predictions
    preds = bulk_model.predict(X)

    df["HMPI"] = preds

    # Return results as JSON
    return {
        "rows": len(df),
        "predictions": preds.tolist(),
        "table": df.to_dict(orient="records")
    }

@app.get("/")
def home():
    return {"msg": "Backend running"}
