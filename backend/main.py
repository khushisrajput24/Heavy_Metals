from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Body
import os
from dotenv import load_dotenv
load_dotenv()

from controllers.bulk import (
    predict_bulk_json,
    predict_bulk_csv
)
from controllers.suggestionsController import suggestionRouter as suggestions_router

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

# Bulk Prediction Routes
@app.post("/predict_bulk_json")
async def predict_bulk_json_route(payload: dict = Body(...)):
    try:
        metals = {
            "Cr": payload.get("Cr"),
            "Fe": payload.get("Fe"),
            "Cu": payload.get("Cu"),
            "Zn": payload.get("Zn"),
            "As": payload.get("As"),
            "Pb": payload.get("Pb"),
        }

        return predict_bulk_json(metals)

    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.post("/predict_bulk_csv")
async def predict_bulk_csv_route(file: UploadFile = File(...)):
    return predict_bulk_csv(file)

# Suggestions Router
app.include_router(suggestions_router, tags=["suggestions"])

# Root Route
@app.get("/")
def home():
    return {"message": "HMPI Backend Running Successfully"}