import pandas as pd
from fastapi import File, UploadFile
from io import BytesIO
import pickle
import os

# load models here so controllers are self-contained
MODEL_DIR = "models"
api_model = None
bulk_model = None

api_path = os.path.join(MODEL_DIR, "hmpi_api_basic.pkl")
# bulk_path = os.path.join(MODEL_DIR, "hmpi_bulk.pkl")  # optional

if os.path.exists(api_path):
    with open(api_path, "rb") as f:
        api_model = pickle.load(f)

# if os.path.exists(bulk_path):
    # with open(bulk_path, "rb") as f:
    #     bulk_model = pickle.load(f)


# API HMPI PREDICTION
def predict_api_hmpi(payload: dict):
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

# BULK HMPI PREDICTION
# async def predict_bulk_hmpi(file: UploadFile = File(...)):
#     contents = await file.read()

#     # Detect file type
#     if file.filename.endswith(".csv"):
#         df = pd.read_csv(BytesIO(contents))
#     elif file.filename.endswith(".xlsx"):
#         df = pd.read_excel(BytesIO(contents))
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
