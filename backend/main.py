from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np
import pickle
import os

app = FastAPI()

# CORS CONFIG
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

# PREDICT CONTROLLERS
from controllers.hmpiCalc import predict_api_hmpi as predict_api_hmpi_impl
# from controllers.hmpiCalc import predict_bulk_hmpi as predict_bulk_hmpi_impl

# API HMPI PREDICTION
@app.post("/predict_api_hmpi")
async def predict_api_hmpi(payload: dict):
    api_key = payload.get("api_key")
    # delegate to the controller implementation
    return predict_api_hmpi_impl(payload)

# BULK HMPI PREDICTION
# @app.post("/predict_bulk_hmpi")
# async def predict_bulk_hmpi(file: UploadFile = File(...)):
    # return await predict_bulk_hmpi_impl(file)


# SUGGESTIONS ROUTE
from controllers.suggestionsController import suggestionRouter as suggestions_router
app.include_router(suggestions_router, tags=["suggestions"])

# ROOT ROUTE
@app.get("/")
def home():
    return {"message": "Backend is running"}
