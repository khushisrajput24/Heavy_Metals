from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import joblib
import numpy as np
import io
import os

from controllers.bulk import HMPIModel, FinalHMPIModel

# FASTAPI APP SETUP

app = FastAPI(title="HMPI Backend")

# CORS
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

import sys
sys.modules['__main__'].HMPIModel = HMPIModel
sys.modules['__main__'].FinalHMPIModel = FinalHMPIModel

# LOAD PKL MODEL
model = joblib.load("models/bulk_upload.pkl")
metal_cols = model.metal_cols   # metals required by the model

# CSV FILE UPLOAD + PROCESSING
@app.post("/process_csv")
async def process_csv(file: UploadFile = File(...)):
    import io

    # ===============================
    # 1. Load CSV Into DataFrame
    # ===============================
    content = await file.read()
    df = pd.read_csv(io.BytesIO(content))

    # ===============================
    # 2. APPLY SAME ML CLEANING LOGIC
    # ===============================

    # ---- COLUMN MAP (From your ML code) ----
    COLUMN_MAP = {
        "Cr (PPM)": "Cr",
        "Mn (PPM)": "Mn",
        "Fe (PPM)": "Fe",
        "Ni (PPM)": "Ni",
        "Cu (PPM)": "Cu",
        "Zn (PPM)": "Zn",
        "As (PPM)": "As",
        "Pb (PPB)": "Pb"   # Pb needs unit conversion
    }

    df = df.rename(columns=COLUMN_MAP)

    # ---- Convert all metals to numeric ----
    for col in COLUMN_MAP.values():
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors="coerce")

    # ---- Pb: convert PPB → mg/L ----
    if "Pb" in df.columns:
        df["Pb"] = df["Pb"] / 1000.0

    # ---- BDL replacement using your exact values ----
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
            df[metal] = df[metal].replace(["BDL", "BDL ", 0, None, "0"], bdl / 2)
            df[metal] = pd.to_numeric(df[metal], errors="coerce").fillna(bdl / 2)

    # ===============================
    # 3. VERIFY REQUIRED METALS
    # ===============================
    missing = [m for m in model.metal_cols if m not in df.columns]
    if missing:
        return {
            "status": "error",
            "message": f"CSV missing required metal columns after cleaning: {missing}"
        }

    # ===============================
    # 4. PROCESS EACH ROW WITH PKL MODEL
    # ===============================
    output_rows = []

    for idx, row in df.iterrows():

        metal_input = {m: float(row[m]) for m in model.metal_cols}

        result = model.predict_from_row(metal_input)

        output_rows.append({
            "row_index": idx,
            "location": row.get("Location", f"Row {idx+1}"),
            "input_metals": metal_input,
            "output": result
        })

    return {
        "status": "success",
        "total_rows": len(output_rows),
        "results": output_rows
    }


# ROOT ENDPOINT
@app.get("/")
def home():
    return {"message": "HMPI Backend Running!"}