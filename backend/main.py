from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import joblib
import numpy as np
import io
import os
import sys

# Import pickle classes
from controllers.hmpiCalc import predict_from_api_key as predict_api_hmpi_impl, APIKeyInput
from controllers.bulk import HMPIModel, FinalHMPIModel
from controllers.suggestionsController import suggestionRouter as suggestions_router

app = FastAPI(title="HMPI Backend")

FRONTEND_URL = os.getenv("CORS_ORIGIN")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        FRONTEND_URL,  # deployed frontend from .env
    ],
    allow_origin_regex="https?://.*",   # fallback for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register classes so pickle can load correctly
sys.modules['__main__'].HMPIModel = HMPIModel
sys.modules['__main__'].FinalHMPIModel = FinalHMPIModel

# LOAD PKL MODEL

MODEL_PATH = "models/bulk_upload.pkl"
model = joblib.load(MODEL_PATH)
metal_cols = model.metal_cols
print("PKL Loaded. Metals:", metal_cols)


# CSV UPLOAD + PROCESSING

@app.post("/process_csv")
async def process_csv(file: UploadFile = File(...)):
    content = await file.read()
    df = pd.read_csv(io.BytesIO(content))

    # 1. CLEANING (same as training)
    COLUMN_MAP = {
        "Cr (PPM)": "Cr",
        "Mn (PPM)": "Mn",
        "Fe (PPM)": "Fe",
        "Ni (PPM)": "Ni",
        "Cu (PPM)": "Cu",
        "Zn (PPM)": "Zn",
        "As (PPM)": "As",
        "Pb (PPB)": "Pb"
    }

    df = df.rename(columns=COLUMN_MAP)

    # Convert metals to numeric
    for col in COLUMN_MAP.values():
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors="coerce")

    # Convert Pb PPB → mg/L
    if "Pb" in df.columns:
        df["Pb"] = df["Pb"] / 1000.0

    # Apply BDL Limits
    BDL_LIMITS = {
        "As": 0.001,
        "Cd": 0.0001,
        "Cr": 0.001,
        "Cu": 0.001,
        "Fe": 0.005,
        "Pb": 0.0005,
        "Mn": 0.001,
        "Ni": 0.001,
        "Zn": 0.001,
    }

    for metal, bdl in BDL_LIMITS.items():
        if metal in df.columns:
            df[metal] = df[metal].replace(["BDL", "BDL ", "0", 0, None], bdl / 2)
            df[metal] = pd.to_numeric(df[metal], errors="coerce").fillna(bdl / 2)

    # 2. VERIFY REQUIRED METALS
    missing = [m for m in metal_cols if m not in df.columns]
    if missing:
        return {
            "status": "error",
            "message": f"Missing required metal columns in CSV: {missing}"
        }

    # 3. PROCESS EACH ROW WITH PKL MODEL
    final_output = []

    for idx, row in df.iterrows():
        # input metals for PKL
        metal_input = {m: float(row[m]) for m in metal_cols}

        # run PKL model prediction
        result = model.predict_from_row(metal_input)

        # merge full row
        merged_row = {}

        # original dataset row
        for col in df.columns:
            merged_row[col] = (row[col] 
                               if pd.notna(row[col]) 
                               else None)

        # append ML + formula outputs
        merged_row.update({
            "HPI": result["HMPI_formula"],
            "HEI": result["HEI"],
            "MI": result["MI"],
            "CI": result["CI"],
            "Category": result["Category"]
        })

        final_output.append(merged_row)

    # 4. RETURN ALL ROWS + RESULT
    return {
        "status": "success",
        "total_rows": len(final_output),
        "results": final_output
    }

# HMPI API Prediction Route
@app.post("/predict_api_hmpi")
async def predict_api_hmpi(payload: dict):
    return predict_api_hmpi_impl(APIKeyInput(**payload))


# Suggestions Router
app.include_router(suggestions_router, tags=["suggestions"])

@app.get("/")
def home():
    return {"message": "HMPI Backend Running Successfully!"}