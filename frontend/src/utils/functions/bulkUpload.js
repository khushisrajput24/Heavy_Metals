import axios from "axios";

export const handleFileSelect = (event, setFile) => {
  const file = event.target.files?.[0];
  if (file) {
    setFile(file);
  }
};

// Called when clicking Calculate HMPI
export const handleBulkUpload = async (
  event,
  file,
  setLoading,
  setPrediction
) => {
  event.preventDefault();

  if (!file) {
    alert("Please upload a file first!");
    return;
  }

  setLoading(true);
  setPrediction(null);

  try {
    const reader = new FileReader();

    reader.onload = async (e) => {
      const text = e.target.result;

      // TODO: Parse CSV into metal values (first row for now)
      const rows = text.split("\n").map((row) => row.split(","));
      const header = rows[0];
      const values = rows[1];

      // Build metals object for model
      const metals = {
        Pb: values[header.indexOf("pb")],
        Cd: values[header.indexOf("cd")],
        Cr: values[header.indexOf("cr")],
        As: values[header.indexOf("as")],
        Zn: values[header.indexOf("zn")],
        Fe: values[header.indexOf("fe")],
        Cu: values[header.indexOf("cu")],
      };

      // Call backend
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/predict_hmpi`,
        { data: metals }
      );

      setPrediction(response.data.prediction);
      setLoading(false);
    };

    reader.readAsText(file);
  } catch (error) {
    console.error(error);
    setPrediction("Backend not reachable");
    setLoading(false);
  }
};
