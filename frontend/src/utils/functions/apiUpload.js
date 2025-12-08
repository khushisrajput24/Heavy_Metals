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
  setError(null);
  setPrediction(null);

  const BASE_URL =
    window.location.hostname === "localhost"
      ? "http://127.0.0.1:8000"
      : import.meta.env.VITE_API_URL;

  try {
    const response = await axios.post(`${BASE_URL}/predict_api_hmpi`, {
      api_key: apiKey,
    });

    setPrediction(response.data);

    console.log("Response:", response.data);
  } catch (err) {
    console.error(err);
    setError("Backend not reachable");
    setPrediction(null);
  }

  setLoading(false);
};
