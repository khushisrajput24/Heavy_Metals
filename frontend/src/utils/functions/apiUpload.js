import axios from "axios";

export const handleAPIUpload = async (
  event,
  apiKey,
  setLoading,
  setPrediction
) => {
  event.preventDefault();
  setLoading(true);
  setPrediction(null);

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/predict_hmpi`,
      { api_key: apiKey }
    );

    setPrediction(response.data.prediction);
  } catch (err) {
    console.error(err);
    setPrediction("Backend not reachable");
  }

  setLoading(false);
};
