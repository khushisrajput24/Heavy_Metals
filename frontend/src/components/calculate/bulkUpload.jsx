import { useState } from "react";
import { FolderUp, Check } from "lucide-react";
import { Button } from "../ui/button";
import { useViewReport } from "../../utils/functions/utility";
import {
  handleFileSelect,
  handleBulkUpload,
} from "../../utils/functions/bulkUpload";

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
    <div id="bulk-upload-form" className="tab-content active">
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
