import axios from "axios";

export const handleFileSelect = (event, setFile) => {
  const file = event.target.files?.[0];
  if (file) {
    setFile(file);
  }
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
    setError("Please upload a file first!");
    setPrediction(null);
    return;
  }

  setLoading(true);
  setPrediction(null);

  try {
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const text = e.target.result;

        // Parse CSV
        const rows = text.split("\n").map((row) => row.split(","));
        const header = rows[0].map((h) => h.trim().toLowerCase());
        const values = rows[1];

        // Metals object
        const metals = {
          Pb: values[header.indexOf("pb")],
          Cd: values[header.indexOf("cd")],
          Cr: values[header.indexOf("cr")],
          As: values[header.indexOf("as")],
          Zn: values[header.indexOf("zn")],
          Fe: values[header.indexOf("fe")],
          Cu: values[header.indexOf("cu")],
        };

        // Auto URL selection
        const BASE_URL =
          window.location.hostname === "localhost"
            ? "http://127.0.0.1:8000"
            : import.meta.env.VITE_API_URL;

        const response = await axios.post(`${BASE_URL}/predict_bulk_hmpi`, {
          data: metals,
        });

        setPrediction(response.data.prediction);
      } catch (err) {
        console.error(err);
        setPrediction("Error processing file or backend failure");
      } finally {
        setLoading(false);
      }
    };

    reader.readAsText(file);
  } catch (error) {
    console.error(error);
    setPrediction("Unable to read file");
    setLoading(false);
  }
};
