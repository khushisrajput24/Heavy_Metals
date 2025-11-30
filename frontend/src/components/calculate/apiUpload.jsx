import { useState } from "react";
import { KeyRound } from "lucide-react";
import { Button } from "../ui/button";
import { handleAPIUpload } from "../../utils/functions/apiUpload";
import { useViewReport } from "../../utils/functions/utility";

export default function APIUpload() {
  const [apiKey, setApiKey] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);

  const viewReport = useViewReport();

  const onChangeApiKey = (e) => {
    setApiKey(e.target.value);
    setError(null); // type karte hi error hata do (optional)
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
            onChange={onChangeApiKey}
          />
          {error && <p className="text-xs mt-1 !text-red-500">{error}</p>}
        </div>
      </div>

      <div className="button-container">
        <button
          type="submit"
          className="btn calculate-btn"
          onClick={(e) =>
            handleAPIUpload(e, apiKey, setLoading, setPrediction, setError)
          }
        >
          {loading ? "Calculating..." : "Calculate HMPI"}
        </button>
      </div>

      {prediction !== null && (
        <div className="flex justify-between items-center gap-4 m-4">
          <h3 className="text-lg font-bold text-[#225ca3] leading-none">
            Calculated HMPI: {prediction}
          </h3>

          <Button
            type="main"
            colorVariant="secondary"
            onClickHandler={viewReport}
            className="py-2 px-4 text-sm"
          >
            View Detailed Report
          </Button>
        </div>
      )}
    </div>
  );
}
