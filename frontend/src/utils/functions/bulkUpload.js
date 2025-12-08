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
    setError("Please upload a file first!");
    setPrediction(null);
    return;
  }

  setLoading(true);
  setPrediction(null);

  try {
    const reader = new FileReader();

    reader.onload = async (e) => {
      console.log("ONLOAD START"); // LOG 1

      try {
        const text = e.target.result.replace(/\r/g, "");
        const rows = text.split("\n").map((row) => row.split(","));
        console.log("ROWS:", rows); // LOG 2

        const rawHeader = rows[0];
        const values = rows[1];

        const normalizedHeader = rawHeader.map((h) =>
          h
            .trim()
            .toLowerCase()
            .replace(/[^a-z]/g, "")
        );

        const synonyms = { fe: ["iron"] };
        const expectedMetals = ["pb", "cr", "as", "zn", "fe", "cu"];

        const findColumn = (metal) => {
          const clean = metal.toLowerCase();
          for (let i = 0; i < normalizedHeader.length; i++) {
            if (normalizedHeader[i].includes(clean)) return i;
          }
          if (synonyms[clean]) {
            for (let s of synonyms[clean]) {
              const sClean = s.toLowerCase().replace(/[^a-z]/g, "");
              for (let i = 0; i < normalizedHeader.length; i++) {
                if (normalizedHeader[i].includes(sClean)) return i;
              }
            }
          }
          return -1;
        };

        const metals = {};
        expectedMetals.forEach((metal) => {
          const idx = findColumn(metal);
          const backendMap = {
            pb: "Pb",
            cr: "Cr",
            as: "As",
            zn: "Zn",
            fe: "Fe",
            cu: "Cu",
          };

          metals[backendMap[metal]] = values[idx];
        });
        console.log("METALS READY:", metals); // LOG 3

        for (let key in metals) {
          if (metals[key] === undefined) {
            setError(`Column for ${key} was not found.`);
            setLoading(false);
            return;
          }
        }

        const BASE_URL =
          window.location.hostname === "localhost"
            ? "http://127.0.0.1:8000"
            : import.meta.env.VITE_API_URL;

        console.log("SENDING TO API:", metals); // LOG 4
        const response = await axios.post(
          `${BASE_URL}/predict_bulk_json`,
          metals
        );

        console.log("RESPONSE RECEIVED:", response.data); // OPTIONAL LOG

        setPrediction(response.data.result);
      } catch (err) {
        console.error(err);
        setError("Error processing file or backend failure.");
      } finally {
        setLoading(false);
      }
    };

    reader.readAsText(file);
  } catch (error) {
    console.error(error);
    setError("Unable to read file");
    setLoading(false);
  }
};
