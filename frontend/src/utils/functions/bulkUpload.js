import axios from "axios";

export const handleFileSelect = (event, setFile) => {
  const file = event.target.files?.[0];
  if (file) setFile(file);
};

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

    const BASE_URL =
      window.location.hostname === "localhost"
        ? "http://127.0.0.1:8000"
        : import.meta.env.VITE_API_URL;

    const response = await axios.post(`${BASE_URL}/process_csv`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("API RESPONSE:", response.data);

    if (response.data.status !== "success") {
      setError(response.data.message || "Backend error occurred.");
      return;
    }

    // Show output from first row only
    setPrediction(response.data.results[0].output);
  } catch (error) {
    console.error(error);
    setError("Backend error or network failure.");
  }

  setLoading(false);
};
