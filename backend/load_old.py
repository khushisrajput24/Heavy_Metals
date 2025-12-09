import sklearn.compose._column_transformer as ct
import joblib

class _RemainderColsList(list):
    pass

setattr(ct, "_RemainderColsList", _RemainderColsList)

bulk = joblib.load("models/bulk_upload.pkl")

joblib.dump(bulk, "models/bulk_upload_fixed.pkl")

print("Bulk upload model fixed successfully.")

pre = joblib.load("models/preprocessor.pkl")
model = joblib.load("models/model.pkl")
joblib.dump(pre, "models/preprocessor_fixed.pkl")
joblib.dump(model, "models/model_fixed.pkl")
