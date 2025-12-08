from fastapi import HTTPException, UploadFile
from pydantic import BaseModel
import joblib
import pandas as pd
import traceback
import numpy as np
import json
import sys


class HMPIModel:
    def _init_(self):
        self.scaler = None
        self.reg_model = None
        self.clf_model = None

        # support both names for compatibility with old PKL
        self.label_encoder = None
        self.encoder = None

        self.metal_cols = ["Cr", "Fe", "Cu", "Zn", "As", "Pb"]

    @staticmethod
    def to_float(v):
        try:
            return float(v)
        except Exception:
            return 0.0

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
            except Exception:
                val = 0.0

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
        """
        row: dict like {"Cr": "...", "Fe": "...", "Cu": "...", "Zn": "...", "As": "...", "Pb": "..."}
        """

        # --- clean inputs ---
        clean_row = {m: HMPIModel.to_float(row.get(m)) for m in self.metal_cols}

        values = np.array([[clean_row[m] for m in self.metal_cols]])

        # --- regression (HMPI_ML) ---
        ml_pred = None
        if self.scaler is not None and self.reg_model is not None:
            scaled = self.scaler.transform(values)
            ml_pred = float(self.reg_model.predict(scaled)[0])
        else:
            ml_pred = 0.0  # or None, but 0 is simpler for frontend

        # --- classification (Category) with backward compatibility ---
        encoder = getattr(self, "label_encoder", None) or getattr(self, "encoder", None)
        if self.clf_model is not None and encoder is not None:
            class_id = int(self.clf_model.predict(values)[0])
            category = encoder.inverse_transform([class_id])[0]
        else:
            # Fallback: use formula-based category
            hmpi_formula, _, _, _, _ = self.calculate_hmpi(clean_row)
            category = self.classify_pollution(hmpi_formula)

        # --- formula-based HMPI family ---
        HMPI, HEI, Cd_excess, MI, CI = self.calculate_hmpi(clean_row)

        return {
            "HMPI_formula": HMPI,
            "HMPI_ML": ml_pred,
            "HEI": HEI,
            "Cd_excess": Cd_excess,
            "MI": MI,
            "CI": CI,
            "Category": category,
        }


# Backward compatibility: FinalHMPIModel behaves like HMPIModel
class FinalHMPIModel(HMPIModel):
    pass


# Register both classes to _main_ for unpickling
sys.modules["__main__"].HMPIModel = HMPIModel
sys.modules["__main__"].FinalHMPIModel = FinalHMPIModel

# (Optional) local load check – not used directly by main.py, but harmless
MODEL_PATH_V2 = "models/bulk_upload.pkl"
try:
    engine_v2 = joblib.load(MODEL_PATH_V2)
    print("bulk_upload model loaded successfully.")
except Exception as e:
    print("ERROR: Failed to load bulk_upload.pkl")
    # don't raise here; main.py will load its own model