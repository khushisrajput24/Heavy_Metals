from fastapi import HTTPException, UploadFile
from pydantic import BaseModel
import joblib
import pandas as pd
import traceback
import numpy as np
import json
import sys

# HMPI MODEL CLASS 

class HMPIModel:
    def __init__(self):
        self.scaler = None
        self.reg_model = None
        self.clf_model = None
        self.label_encoder = None
        self.metal_cols = ["Cr", "Fe", "Cu", "Zn", "As", "Pb"]

    @staticmethod
    def to_float(v):
        try:
            return float(v)
        except:
            return 0.0   # treat BDL, "", None as 0
    
    def calculate_hmpi(self, metals):
        STANDARD_LIMITS = {
            "Pb": 0.01,
            "Cd": 0.003,
            "Cr": 0.05,
            "As": 0.01,
            "Zn": 3.0,
            "Fe": 0.3,
            "Cu": 2.0,
        }

        HEI = Cd_excess = MI = CI = 0

        for metal, limit in STANDARD_LIMITS.items():
            val = metals.get(metal, 0)
            try:
                val = float(val)
            except:
                val = 0

            Ci = val / limit
            HEI += Ci
            CI += Ci

            if val > limit:
                MI += Ci
                Cd_excess += (val - limit)

        HMPI = CI
        return HMPI, HEI, Cd_excess, MI, CI

    def classify_pollution(self, hmpi):
        if hmpi < 10:
            return "Safe"
        elif hmpi < 20:
            return "Moderate Pollution"
        return "High Pollution"

    def predict_from_row(self, row):
        clean_row = {m: HMPIModel.to_float(row.get(m)) for m in self.metal_cols}

        values = np.array([[clean_row[m] for m in self.metal_cols]])
        scaled = self.scaler.transform(values)

        ml_pred = float(self.reg_model.predict(scaled)[0])
        class_id = int(self.clf_model.predict(values)[0])
        category = self.label_encoder.inverse_transform([class_id])[0]

        HMPI, HEI, Cd_excess, MI, CI = self.calculate_hmpi(clean_row)

        return {
            "HMPI_formula": HMPI,
            "HMPI_ML": ml_pred,
            "HEI": HEI,
            "Cd_excess": Cd_excess,
            "MI": MI,
            "CI": CI,
            "Category": category
        }

# MAKE PICKLE COMPATIBLE (REGISTER CLASS IN __main__) 

sys.modules['__main__'].HMPIModel = HMPIModel

# LOAD PKL

MODEL_PATH_V2 = "models/bulk_upload.pkl"

try:
    engine_v2 = joblib.load(MODEL_PATH_V2)
    print("bulk_upload model loaded successfully.")
except Exception as e:
    print("ERROR: Failed to load bulk_upload.pkl")
    raise e



# INPUT SCHEMA

class MetalsInput(BaseModel):
    Cr: float
    Fe: float
    Cu: float
    Zn: float
    As: float
    Pb: float

# JSON PREDICTION ENDPOINT

def predict_bulk_json(payload: dict):
    try:
        metals = payload
        result = engine_v2.predict_from_row(metals)

        return {"status": "success", "input": metals, "result": result}

    except Exception as e:
        return {"status": "error", "message": str(e), "trace": traceback.format_exc()}


# CSV PREDICTION ENDPOINT

def predict_bulk_csv(file: UploadFile):
    try:
        df = pd.read_csv(file.file)

        required = engine_v2.metal_cols

        for col in required:
            if col not in df.columns:
                df[col] = 0

        results = []
        for _, row in df.iterrows():
            row_data = {m: float(row[m]) for m in required}
            results.append(engine_v2.predict_from_row(row_data))

        return {"status": "success", "count": len(results), "results": results}

    except Exception as e:
        return {"status": "error", "message": str(e), "trace": traceback.format_exc()}