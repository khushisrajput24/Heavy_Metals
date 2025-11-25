import { useState } from "react";
import { Check, FolderUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function BulkUpload() {
  const [csvFile, setCsvFile] = useState(null);
  const navigate = useNavigate();

  const handleBulkUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setCsvFile(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        const rows = text.split("\n").map((row) => row.split(","));
      };
      reader.readAsText(file);
    }
  };

  const calculate_hmpi = (event) => {
    navigate("/analysis");
  };

  return (
    <div id="bulk-upload-form" className="tab-content active">
      <h2 className="card-title">
        <FolderUp size={24} strokeWidth={2} />
        Bulk Data Upload
      </h2>
      <div className="upload-area">
        <div className="upload-box">
          <i className="fas fa-upload fa-3x"></i>
          <p className="upload-text">Upload CSV File</p>
          <p className="card-subtitle">
            Upload a CSV file with multiple groundwater samples for batch
            processing
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
            onChange={handleBulkUpload}
          />
        </div>
      </div>

      {/* Show uploaded file name */}
      {csvFile && (
        <div className="card-section grid grid-cols-[auto_1fr] items-center gap-3">
          <Check size={20} strokeWidth={3} className="text-green-600" />
          <div className="font-medium text-gray-700">
            Uploaded File: <span className="font-semibold">{csvFile.name}</span>
          </div>
        </div>
      )}

      <div className="requirements-card">
        <h3 className="card-title">CSV Format Requirements:</h3>
        <ul>
          <li>First row should contain column headers</li>
          <li>
            Include columns: <b>sample_id</b>, <b>latitude</b>, <b>longitude</b>
            , <b>depth</b>
          </li>
          <li>
            Heavy metal columns: <b>pb</b>, <b>cd</b>, <b>hg</b>, <b>as</b>,{" "}
            <b>cr</b>, <b>cu</b>, <b>zn</b>, <b>ni</b>
          </li>
          <li>Use numeric values only for concentrations</li>
        </ul>
      </div>

      <div className="button-container">
        <button
          type="submit"
          className="btn calculate-btn"
          onClick={calculate_hmpi}
        >
          Calculate HMPI
        </button>
      </div>
    </div>
  );
}
