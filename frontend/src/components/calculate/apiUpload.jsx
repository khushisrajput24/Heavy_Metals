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
      <br />
      {prediction && (
        <div className="center">
          <div>
            <h3 className="calculated-title">Calculated Values:</h3>
            <ul className="calculated-list">
              <li>
                <b>HPI:</b> {prediction.Formula_HMPI.toFixed(4)}
              </li>
              <li>
                <b>HEI:</b> {prediction.HEI.toFixed(4)}
              </li>
              <li>
                <b>Cd:</b> {prediction.Cd_Excess.toFixed(4)}
              </li>
              <li>
                <b>MI:</b> {prediction.MI.toFixed(4)}
              </li>
              {/* <li>CI: {prediction.CI}</li> */}
            </ul>
          </div>
          <Button
            type="main"
            colorVariant="secondary"
            onClickHandler={viewReport}
          >
            View Detailed Report
          </Button>
        </div>
      )}
    </div>
  );
}
