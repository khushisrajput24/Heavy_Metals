from fastapi import HTTPException
from pydantic import BaseModel
import joblib
import pandas as pd
import base64
import json
import io
from threading import Lock

# --- REQUIRED PATCH FOR OLD SKLEARN PICKLES ---
import sklearn.compose._column_transformer as ct
import sys

class _RemainderColsList(list):
    pass

# Register in sklearn module
setattr(ct, "_RemainderColsList", _RemainderColsList)

# ALSO register in __main__ because the pickle references it!
sys.modules['__main__']._RemainderColsList = _RemainderColsList

# FIXED MODEL PATHS
MODEL_PATH = "models/model_fixed.pkl"
PREPROCESSOR_PATH = "models/preprocessor_fixed.pkl"

# Lazy-loaded variables
model = None
preprocessor = None
load_lock = Lock()

def load_models():
    global model, preprocessor
    if model is None or preprocessor is None:
        with load_lock:
            if model is None:
                model = joblib.load(MODEL_PATH)
            if preprocessor is None:
                preprocessor = joblib.load(PREPROCESSOR_PATH)

# HMPI LOGIC
STANDARD_LIMITS = {
    "Pb": 0.01,
    "Cd": 0.003,
    "Cr": 0.05,
    "As": 0.01,
    "Zn": 3.0,
    "Fe": 0.3,
    "Cu": 2.0,
}

def calculate_hmpi(metals):
    HEI = Cd_excess = MI = CI = 0

    for metal, limit in STANDARD_LIMITS.items():
        val = metals.get(metal)
        if val is None:
            continue

        val = float(val)
        Ci = val / limit
        HEI += Ci
        CI += Ci

        if val > limit:
            MI += Ci
            Cd_excess += (val - limit)

    HMPI = CI
    return HMPI, HEI, Cd_excess, MI, CI

def classify_pollution(hmpi):
    if hmpi < 10:
        return "Safe", "Low Risk"
    elif hmpi < 20:
        return "Moderate Pollution", "Medium Risk"
    return "High Pollution", "High Risk"

class APIKeyInput(BaseModel):
    api_key: str

def extract_metals_from_key(api_key: str):
    try:
        decoded_bytes = base64.b64decode(api_key)
        decoded_text = decoded_bytes.decode("utf-8")
    except:
        raise HTTPException(status_code=400, detail="Invalid Base64 API Key")

    # Try JSON
    try:
        return json.loads(decoded_text)
    except:
        pass

    # Try CSV
    try:
        df = pd.read_csv(io.StringIO(decoded_text))
        if set(STANDARD_LIMITS.keys()).issubset(df.columns):
            return df.iloc[0].to_dict()
    except:
        pass

    raise HTTPException(
        status_code=400,
        detail="API Key does not contain valid JSON or CSV with metal values."
    )

def predict_from_api_key(data: APIKeyInput):

    # Load models only when needed
    load_models()

    metals = extract_metals_from_key(data.api_key)

    for m in STANDARD_LIMITS.keys():
        if m not in metals:
            raise HTTPException(status_code=400, detail=f"Missing metal value: {m}")

    df = pd.DataFrame([metals])
    X = preprocessor.transform(df)
    ml_pred = float(model.predict(X)[0])

    HMPI, HEI, Cd_excess, MI, CI = calculate_hmpi(metals)
    status, risk = classify_pollution(HMPI)
    # print("DF before preprocess:", df)
    # print("DF after preprocess:", X)

    return {
        "Decoded_Input": metals,
        "ML_Predicted_HMPI": ml_pred,
        "Formula_HMPI": HMPI,
        "HEI": HEI,
        "Cd_Excess": Cd_excess,
        "MI": MI,
        "CI": CI,
        "Pollution_Status": status,
        "Risk_Level": risk
    }
    
