import axios from "axios";

export const handleAPIUpload = async (
  event,
  apiKey,
  setLoading,
  setPrediction,
  setError
) => {
  event.preventDefault();

  if (!apiKey.trim()) {
    setError("API key is required");
    setPrediction(null);
    return;
  }

  setLoading(true);
  setPrediction(null);

  const BASE_URL =
    window.location.hostname === "localhost"
      ? "http://127.0.0.1:8000"
      : import.meta.env.VITE_API_URL;
  try {
    if (!apiKey) {
      throw new Error("API key is required");
    }
    const response = await axios.post(`${BASE_URL}/predict_api_hmpi`, {
      api_key: apiKey,
    });

    setPrediction(response.data.prediction);
  } catch (err) {
    console.error(err);
    setPrediction("Backend not reachable");
  }

  setLoading(false);
};
