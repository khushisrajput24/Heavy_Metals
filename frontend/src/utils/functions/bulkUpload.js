// bulkUpload.js
import axios from "axios";

// Handle file selection
export const handleFileSelect = (event, setFile) => {
  const file = event.target.files?.[0];
  if (file) setFile(file);
};

// Handle bulk upload
export const handleBulkUpload = async (
  event,
  file,
  setLoading,
  setPrediction,
  setError
) => {
  event.preventDefault();

  if (!file) {
    setError("Please upload a CSV file first!");
    setPrediction(null);
    return;
  }

  setLoading(true);
  setError(null);
  setPrediction(null);

  try {
    const formData = new FormData();
    formData.append("file", file);

    // Auto-detect backend URL
    const BASE_URL =
      window.location.hostname === "localhost"
        ? "http://127.0.0.1:8000" // FastAPI backend
        : import.meta.env.VITE_API_URL;

    // Correct endpoint (change if needed)
    const ENDPOINT = "/process_csv"; // or "/predict-bulk"

    const response = await axios.post(`${BASE_URL}${ENDPOINT}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    console.log("API RESPONSE:", response.data);

    // If backend returns status
    if (response.data.status && response.data.status !== "success") {
      setError(response.data.message || "Backend error occurred!");
      return;
    }

    // Set prediction
    setPrediction(response.data);
  } catch (error) {
    console.error("UPLOAD ERROR:", error);
    setError("Backend error or network failure.");
  } finally {
    setLoading(false);
  }
};
