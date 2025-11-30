from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
load_dotenv()

from controllers.hmpiCalc import predict_api_hmpi as predict_api_hmpi_impl
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

# API HMPI PREDICTION ROUTE
@app.post("/predict_api_hmpi")
async def predict_api_hmpi(payload: dict):
    return predict_api_hmpi_impl(payload)

# Suggestions Router
app.include_router(suggestions_router, tags=["suggestions"])

# Root Route
@app.get("/")
def home():
    return {"message": "HMPI Backend Running Successfully"}