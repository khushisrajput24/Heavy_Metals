import { useState } from "react";
import { FlaskConical, TestTubeDiagonal } from "lucide-react";
import { Button } from "../ui/button";
import { handleManualSubmit } from "../../utils/functions/manualUpload";
import { useViewReport } from "../../utils/functions/utility";
import "../ui/css/about_us.css";
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

  const [units, setUnits] = useState({
    lead: "µg/L",
    cadmium: "µg/L",
    mercury: "µg/L",
    arsenic: "µg/L",
    chromium: "µg/L",
    copper: "µg/L",
    zinc: "µg/L",
    nickel: "µg/L",
  });

  const [errors, setErrors] = useState({});
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

  const MetalInput = ({ id, label, limit, alimit }) => (
    <div className="input-group">
      <label htmlFor={id}>
        {label} 
      </label>
      <span className="limit">Permissible Limit: {limit}</span>
      <span className="limit">Acceptable Limit: {alimit}</span>
      <div className="metal-input-wrapper">
        <input
          type="text"
          id={id}
          placeholder={`Enter value in ${units[id]}`}
          value={formData[id]}
          onChange={handleInputChange}
        />

        <div className="relative select-wrapper" style={{ width: 110, height: 36 }}>
          <select
            className="custom-select"
            value={units[id]}
            onChange={(e) => handleUnitChange(e, id)}
            aria-label={`${label} unit`}
          >
            {/* ensure value attributes present */}
            <option value="ppm">ppm</option>
            <option value="ppb">ppb</option>
            <option value="mg/L">mg/L</option>
            <option value="µg/L">µg/L</option>
          </select>

          <ChevronDown className="select-chevron" size={18} />
        </div>
      </div>

      {errors[id] && (
        <p className="text-red-500 text-xs mt-1">{errors[id]}</p>
      )}
    </div>
  );

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
            <MetalInput id="lead" label="Lead (Pb)" limit="10 µg/L" alimit="10 µg/L"/>
            <MetalInput id="cadmium" label="Cadmium (Cd)" limit="3 µg/L" alimit="3 µg/L"/>
            <MetalInput id="mercury" label="Mercury (Hg)" limit="1 µg/L" alimit="1 µg/L"/>
            <MetalInput id="arsenic" label="Arsenic (As)" limit="50 µg/L" alimit="10 µg/L"/>
            <MetalInput id="chromium" label="Chromium (Cr)" limit="50 µg/L" alimit="50 µg/L"/>
            <MetalInput id="copper" label="Copper (Cu)" limit="1500 µg/L" alimit="50 µg/L"/>
            <MetalInput id="zinc" label="Zinc (Zn)" limit="15000 µg/L" alimit="5000 µg/L"/>
            <MetalInput id="nickel" label="Nickel (Ni)" limit="20 µg/L" alimit="20 µg/L"/>
          </div>
          
        
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
        <div className="center ">
         <div>
            <h3 className="calculated-title">Calculated Values:</h3>
            <ul className="calculated-list">
              <li>
                <b>HPI:</b> {hmpi.hpi.toFixed(4)}
              </li>
              <li>
                <b>HEI:</b> {hmpi.hei.toFixed(4)}
              </li>
              <li>
                <b>Cd:</b> {hmpi.cd.toFixed(4)}
              </li>
              <li>
                <b>MI:</b> {hmpi.mi.toFixed(4)}
              </li>
              {/* <li>CI: {prediction.CI}</li> */}
            </ul>
            
          </div>
        </div>
      )}

      <div
  
>
 

  <div
    className="standards-list"
  > <h2
    className="section-title"
  >
    Regulatory Standards
  </h2>
  <a
      href="https://cpcb.nic.in/wqm/BIS_Drinking_Water_Specification.pdf"
      target="_blank"
      rel="noopener noreferrer"
    className="standard-item"
    >
     <CircleCheckBig className="check-icon" />
      <span>BIS 10500 (2012): Drinking water for Permissible and Acceptable limits</span>
    </a>
    <a
      href="https://law.resource.org/pub/us/cfr/ibr/002/apha.method.3120.1992.pdf"
      target="_blank"
      rel="noopener noreferrer"
    className="standard-item"
    >
     <CircleCheckBig className="check-icon" />
      <span>APHA Method 3120: Standard Methods for the Examination of Water</span>
    </a>

    <a
      href="https://cpcb.nic.in/displaypdf.php?id=bmFibC9ULTA2NDMuMTYuMThfQ2hlbV8yMi0xMC0xNi5wZGY%3D&utm_source=chatgpt.com"
      target="_blank"
      rel="noopener noreferrer"
      className="standard-item"
    >
      <CircleCheckBig className="check-icon" />
      <span>Limit of Detection of groundwater as per NABL Standards</span>
    </a>
  </div>
</div>

    </div>
  );
}
