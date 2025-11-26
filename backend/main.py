from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np
import pickle
import os

app = FastAPI()

# -------------------------
# CORS CONFIG
# -------------------------
origins = [
    os.getenv("CORS_ORIGIN"),
    "http://localhost:5173",   # optional for local development
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



# -------------------------
# LOAD MODELS
# -------------------------
with open("models/hmpi_api_basic.pkl", "rb") as f:
    api_model = pickle.load(f)

# with open("models/hmpi_bulk.pkl", "rb") as f:
#     bulk_model = pickle.load(f)

# -------------------------
# BASIC HMPI PREDICTION
# -------------------------
@app.post("/predict_hmpi")
def predict_hmpi(payload: dict):
    api_key = payload.get("api_key")

    # Replace later with real inputs
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
        metals["Pb"], metals["Cd"], metals["Cr"],
        metals["As"], metals["Zn"], metals["Fe"],
        metals["Cu"]
    ]

    prediction = api_model.predict([features])[0]

    return {
        "prediction": float(prediction),
        "used_api_key": api_key,
        "metals_used": metals,
    }

# -------------------------
# BULK HMPI PREDICTION
# -------------------------
# @app.post("/predict_bulk_hmpi")
# async def predict_bulk_hmpi(file: UploadFile = File(...)):
#     contents = await file.read()

#     # Detect file type
#     if file.filename.endswith(".csv"):
#         df = pd.read_csv(pd.io.common.BytesIO(contents))
#     elif file.filename.endswith(".xlsx"):
#         df = pd.read_excel(pd.io.common.BytesIO(contents))
#     else:
#         return {"error": "Unsupported file type"}

#     expected_cols = ["pb", "cd", "hg", "as", "cr", "cu", "zn", "ni"]

#     if not all(col in df.columns for col in expected_cols):
#         return {"error": f"Missing required columns. Expected: {expected_cols}"}

#     X = df[expected_cols]

#     preds = bulk_model.predict(X)
#     df["HMPI"] = preds

#     return {
#         "rows": len(df),
#         "predictions": preds.tolist(),
#         "table": df.to_dict(orient="records")
#     }

# -------------------------
# ROOT ROUTE
# -------------------------
@app.get("/")
def home():
    return {"message": "Backend is running"}
