import { useState } from "react";
import { FolderUp, Check } from "lucide-react";
import { Button } from "../ui/button";
import { useViewReport } from "../../utils/functions/utility";
import {
  handleFileSelect,
  handleBulkUpload,
} from "../../utils/functions/bulkUpload";
import { CalcTable } from "../ui/calcTable";

export default function BulkUpload() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [prediction, setPrediction] = useState(null);

  const viewReport = useViewReport();

  const onFileChange = (e) => {
    handleFileSelect(e, setFile);
    setError(null);
  };

  return (
    <div id="bulk-upload-form" className="w-[80%] mx-auto">
      <h2 className="card-title">
        <FolderUp size={24} strokeWidth={2} />
        Bulk Data Upload
      </h2>

      <div className="upload-area">
        <div className="upload-box">
          <p className="upload-text">Upload File</p>
          <p className="card-subtitle">
            Upload a file with multiple groundwater samples for batch processing
          </p>
          <button
            className="btn choose-file-btn"
            onClick={() => document.getElementById("file-upload").click()}
          >
            Choose File
          </button>

          <input
            type="file"
            id="file-upload"
            accept=".csv"
            style={{ display: "none" }}
            onChange={onFileChange}
          />
        </div>
      </div>

      {file && (
        <div className="card-section grid grid-cols-[auto_1fr] items-center gap-3">
          <Check size={20} strokeWidth={3} className="text-green-600" />
          <div className="font-medium text-gray-700">
            Uploaded File: <span className="font-semibold">{file.name}</span>
          </div>
        </div>
      )}

      {error && (
        <div className="card-section">
          <p className="text-xs mt-2 text-red-500 !text-red-500">{error}</p>
        </div>
      )}

      <div className="requirements-card">
        <h3>File Format Requirements:</h3>
        <ul>
          <li>First row should contain column headers</li>
          <li>Include columns: sample_id, latitude, longitude, depth</li>
          <li>Heavy metal columns: Pb, Cd, Hg, As, Cr, Cu, Zn, Ni</li>
          <li>Use numeric values only for concentrations</li>
        </ul>
      </div>

      <div className="button-container">
        <button
          type="submit"
          className="btn calculate-btn"
          onClick={(e) =>
            handleBulkUpload(e, file, setLoading, setPrediction, setError)
          }
        >
          {loading ? "Calculating..." : "Calculate HMPI"}
        </button>
      </div>

      {prediction?.results && <CalcTable prediction={prediction.results} />}
    </div>
  );
}
