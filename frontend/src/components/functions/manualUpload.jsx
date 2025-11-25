import { useState } from "react";
import { FlaskConical, TestTubeDiagonal } from "lucide-react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

// Define the permissible limits for each heavy metal
const permissible_limits = {
  "Lead (Pb)": 10, // µg/L
  "Cadmium (Cd)": 5, // µg/L
  "Mercury (Hg)": 6, // µg/L
  "Arsenic (As)": 10, // µg/L
  "Chromium (Cr)": 50, // µg/L
  "Copper (Cu)": 2, // mg/L
  "Zinc (Zn)": 3, // mg/L
  "Nickel (Ni)": 70, // µg/L
};

// The HMPI calculation function
const calculate_hmpi = (values) => {
  let numerator = 0;
  let denominator = 0;

  // Iterate over each metal and calculate the HMPI
  for (let metal in permissible_limits) {
    const limit = permissible_limits[metal];
    const Ci = values[metal] || 0; // Concentration entered by the user
    const Li = limit; // Permissible limit
    const Qi = (Ci / Li) * 100; // Quality rating
    const Wi = 1 / Li; // Weight
    numerator += Wi * Qi;
    denominator += Wi;
  }

  // Return the final HMPI value
  return denominator !== 0 ? (numerator / denominator).toFixed(3) : "NaN";
};

export default function ManualUpload() {
  // State hooks for input values
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

  const [hmpi, setHmpi] = useState(null);

  const navigate = useNavigate();

  // Handle form input change
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  // Handle form submission
  const handleManualSubmit = (event) => {
    event.preventDefault();

    // Prepare the input data for the calculation
    const values = {
      "Lead (Pb)": parseFloat(formData.lead),
      "Cadmium (Cd)": parseFloat(formData.cadmium),
      "Mercury (Hg)": parseFloat(formData.mercury),
      "Arsenic (As)": parseFloat(formData.arsenic),
      "Chromium (Cr)": parseFloat(formData.chromium),
      "Copper (Cu)": parseFloat(formData.copper),
      "Zinc (Zn)": parseFloat(formData.zinc),
      "Nickel (Ni)": parseFloat(formData.nickel),
    };

    // Call the calculate_hmpi function
    const result = calculate_hmpi(values);
    setHmpi(result); // Set the result to state
  };

  const viewReport = (event) => {
    navigate("/analysis");
  };

  return (
    <div id="manual-entry-form" className="tab-content active">
      <form className="calculator-form" onSubmit={handleManualSubmit}>
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
            </div>
          </div>
        </div>

        <div className="card-section">
          <h2 className="card-title">
            <TestTubeDiagonal size={20} strokeWidth={2} />
            Heavy Metal Concentrations
          </h2>
          <p className="card-subtitle">
            Enter the concentration values for each heavy metal detected
          </p>
          <div className="input-grid metal-grid">
            {/* Repeat for each metal */}
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
            </div>
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
            </div>
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
            </div>
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
            </div>
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
            </div>
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
            </div>
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
            </div>
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
            </div>
          </div>
        </div>

        <div className="button-container">
          <button type="submit" className="btn calculate-btn">
            Calculate HMPI
          </button>
        </div>
      </form>

      {/* Display the calculated HMPI */}
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
