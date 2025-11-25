import { useState } from "react";
import { KeyRound } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function APIUpload() {
  const [apiKey, setApiKey] = useState("");
  const navigate = useNavigate();

  // -------------------------
  // HANDLE API UPLOAD (MODEL CALL)
  // -------------------------
  const handleAPIUpload = async (event) => {
    event.preventDefault();

    try {
      // Backend ko call
      const res = await fetch("http://localhost:8000/predict/hmpi_api_basic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          features: [12.5, 3.7, 5.9, 1.2],
          api_key: apiKey, // optional if needed
        }),
      });

      const data = await res.json();
      console.log("Model Prediction:", data);

      // Model result ko next page pe bhejna ho toh localStorage use karo:
      localStorage.setItem("hmpi_result", JSON.stringify(data));

      // Navigate to analysis page
      navigate("/analysis");
    } catch (error) {
      console.error("Error fetching prediction:", error);
    }
  };

  return (
    <div id="bulk-upload-form" className="tab-content active">
      <h2 className="card-title">
        <KeyRound size={24} strokeWidth={2.5} />
        Process API Data
      </h2>

      <div className="card">
        <div className="input-group">
          <label htmlFor="api_key">API Key</label>
          <input
            type="text"
            id="api_key"
            placeholder="Enter your Data API key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
        </div>
      </div>

      <div className="requirements-card">
        <h3 className="card-title">API Format Requirements:</h3>
        <ul>
          <li>Enter your API Key to connect your account</li>
          <li>Your API Key will be processed securely and is never shared.</li>
          <li>Keep this key safe - it works like a password.</li>
        </ul>
      </div>

      <div className="button-container">
        <button
          type="submit"
          className="btn calculate-btn"
          onClick={handleAPIUpload}
        >
          Calculate HMPI
        </button>
      </div>
    </div>
  );
}
