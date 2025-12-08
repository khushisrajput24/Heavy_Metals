import sklearn.compose._column_transformer as ct

class _RemainderColsList(list):
    pass

setattr(ct, "_RemainderColsList", _RemainderColsList)

import joblib

bulk = joblib.load("models/bulk_upload.pkl")

joblib.dump(bulk, "models/bulk_upload_fixed.pkl")

print("Bulk upload model fixed successfully.")
