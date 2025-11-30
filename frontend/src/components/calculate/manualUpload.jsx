import { useState } from "react";
import { FlaskConical, TestTubeDiagonal } from "lucide-react";
import { Button } from "../ui/button";
import { handleManualSubmit } from "../../utils/functions/manualUpload";
import { useViewReport } from "../../utils/functions/utility";

export default function ManualUpload() {
  const [formData, setFormData] = useState({
    sampleId: "",
    depth: "",
    latitude: "",
    longitude: "",
    lead: "",
    cadmium: "",
    mercury: "",
    arsenic: "",
    chromium: "",
    copper: "",
    zinc: "",
    nickel: "",
  });

  const [errors, setErrors] = useState({}); // { fieldName: "error message" }
  const [hmpi, setHmpi] = useState(null);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
    // clear error while typing
    setErrors((prev) => ({ ...prev, [id]: "" }));
  };

  const viewReport = useViewReport();

  return (
    <div id="manual-entry-form" className="tab-content active">
      <form
        className="calculator-form"
        onSubmit={(e) => handleManualSubmit(e, formData, setHmpi, setErrors)}
      >
        <div className="card-section">
          <h2 className="card-title">
            <FlaskConical size={20} strokeWidth={2} />
            Sample Information
          </h2>
          <p className="card-subtitle">
            Enter basic information about your groundwater sample
          </p>
          <div className="input-grid">
            <div className="input-group">
              <label htmlFor="sampleId">Sample ID</label>
              <input
                type="text"
                id="sampleId"
                placeholder="e.g., GW-001"
                value={formData.sampleId}
                onChange={handleInputChange}
              />
              {errors.sampleId && (
                <p className="text-red-500 text-xs mt-1">{errors.sampleId}</p>
              )}
            </div>

            <div className="input-group">
              <label htmlFor="depth">Depth (m)</label>
              <input
                type="text"
                id="depth"
                placeholder="e.g., 15.5"
                value={formData.depth}
                onChange={handleInputChange}
              />
              {errors.depth && (
                <p className="text-red-500 text-xs mt-1">{errors.depth}</p>
              )}
            </div>

            <div className="input-group">
              <label htmlFor="latitude">Latitude</label>
              <input
                type="text"
                id="latitude"
                placeholder="e.g., 40.7128"
                value={formData.latitude}
                onChange={handleInputChange}
              />
              {errors.latitude && (
                <p className="text-red-500 text-xs mt-1">{errors.latitude}</p>
              )}
            </div>

            <div className="input-group">
              <label htmlFor="longitude">Longitude</label>
              <input
                type="text"
                id="longitude"
                placeholder="e.g., -74.0060"
                value={formData.longitude}
                onChange={handleInputChange}
              />
              {errors.longitude && (
                <p className="text-red-500 text-xs mt-1">{errors.longitude}</p>
              )}
            </div>
          </div>
        </div>

        {/* metals */}
        <div className="card-section">
          <h2 className="card-title">
            <TestTubeDiagonal size={20} strokeWidth={2} />
            Heavy Metal Concentrations
          </h2>
          <p className="card-subtitle">
            Enter the concentration values for each heavy metal detected
          </p>
          <div className="input-grid metal-grid">
            <div className="input-group">
              <label htmlFor="lead">
                Lead (Pb) <span className="limit">Limit: 10 µg/L</span>
              </label>
              <input
                type="text"
                id="lead"
                placeholder="Enter value in µg/L"
                value={formData.lead}
                onChange={handleInputChange}
              />
              {errors.lead && (
                <p className="text-red-500 text-xs mt-1">{errors.lead}</p>
              )}
            </div>

            {/* Repeat pattern for other metals */}
            {/* cadmium */}
            <div className="input-group">
              <label htmlFor="cadmium">
                Cadmium (Cd) <span className="limit">Limit: 5 µg/L</span>
              </label>
              <input
                type="text"
                id="cadmium"
                placeholder="Enter value in µg/L"
                value={formData.cadmium}
                onChange={handleInputChange}
              />
              {errors.cadmium && (
                <p className="text-red-500 text-xs mt-1">{errors.cadmium}</p>
              )}
            </div>

            {/* mercury */}
            <div className="input-group">
              <label htmlFor="mercury">
                Mercury (Hg) <span className="limit">Limit: 6 µg/L</span>
              </label>
              <input
                type="text"
                id="mercury"
                placeholder="Enter value in µg/L"
                value={formData.mercury}
                onChange={handleInputChange}
              />
              {errors.mercury && (
                <p className="text-red-500 text-xs mt-1">{errors.mercury}</p>
              )}
            </div>

            {/* arsenic */}
            <div className="input-group">
              <label htmlFor="arsenic">
                Arsenic (As) <span className="limit">Limit: 10 µg/L</span>
              </label>
              <input
                type="text"
                id="arsenic"
                placeholder="Enter value in µg/L"
                value={formData.arsenic}
                onChange={handleInputChange}
              />
              {errors.arsenic && (
                <p className="text-red-500 text-xs mt-1">{errors.arsenic}</p>
              )}
            </div>

            {/* chromium */}
            <div className="input-group">
              <label htmlFor="chromium">
                Chromium (Cr) <span className="limit">Limit: 50 µg/L</span>
              </label>
              <input
                type="text"
                id="chromium"
                placeholder="Enter value in µg/L"
                value={formData.chromium}
                onChange={handleInputChange}
              />
              {errors.chromium && (
                <p className="text-red-500 text-xs mt-1">{errors.chromium}</p>
              )}
            </div>

            {/* copper */}
            <div className="input-group">
              <label htmlFor="copper">
                Copper (Cu) <span className="limit">Limit: 2 mg/L</span>
              </label>
              <input
                type="text"
                id="copper"
                placeholder="Enter value in mg/L"
                value={formData.copper}
                onChange={handleInputChange}
              />
              {errors.copper && (
                <p className="text-red-500 text-xs mt-1">{errors.copper}</p>
              )}
            </div>

            {/* zinc */}
            <div className="input-group">
              <label htmlFor="zinc">
                Zinc (Zn) <span className="limit">Limit: 3 mg/L</span>
              </label>
              <input
                type="text"
                id="zinc"
                placeholder="Enter value in mg/L"
                value={formData.zinc}
                onChange={handleInputChange}
              />
              {errors.zinc && (
                <p className="text-red-500 text-xs mt-1">{errors.zinc}</p>
              )}
            </div>

            {/* nickel */}
            <div className="input-group">
              <label htmlFor="nickel">
                Nickel (Ni) <span className="limit">Limit: 70 µg/L</span>
              </label>
              <input
                type="text"
                id="nickel"
                placeholder="Enter value in µg/L"
                value={formData.nickel}
                onChange={handleInputChange}
              />
              {errors.nickel && (
                <p className="text-red-500 text-xs mt-1">{errors.nickel}</p>
              )}
            </div>
          </div>
        </div>

        <div className="button-container">
          <button type="submit" className="btn calculate-btn">
            Calculate HMPI
          </button>
        </div>
      </form>

      {hmpi !== null && (
        <div className="flex justify-between items-center gap-4 m-4">
          <h3 className="text-lg font-bold text-[#225ca3] leading-none">
            Calculated HMPI: {hmpi}
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
