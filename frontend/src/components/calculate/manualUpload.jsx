import { useState } from "react";
import { ChevronDown, CircleCheckBig, FlaskConical, TestTubeDiagonal } from "lucide-react";
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

  const unitOptions = ["µg/L", "mg/L", "ppm", "ppb"];

  const [units, setUnits] = useState({
    lead: "µg/L",
    cadmium: "µg/L",
    mercury: "µg/L",
    arsenic: "µg/L",
    chromium: "µg/L",
    copper: "mg/L",
    zinc: "mg/L",
    nickel: "µg/L",
  });

  const [errors, setErrors] = useState({});
  const [hmpi, setHmpi] = useState(null);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: "" }));
  };

  const handleUnitChange = (e, metal) => {
    setUnits((prev) => ({ ...prev, [metal]: e.target.value }));
  };

  const viewReport = useViewReport();

  const MetalInput = ({ id, label, limit }) => (
    <div className="input-group">
      <label htmlFor={id}>
        {label} <span className="limit">Limit: {limit}</span>
      </label>

      <div className="metal-input-wrapper">
        <input
          type="text"
          id={id}
          placeholder={`Enter value in ${units[id]}`}
          value={formData[id]}
          onChange={handleInputChange}
        />

        <div className="relative select-wrapper" style={{ width: 110 }}>
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
    <div id="manual-entry-form" className="w-[80%] items-center mx-auto mb-2">
      <form
        className="calculator-form"
        onSubmit={(e) => handleManualSubmit(e, formData, setHmpi, setErrors)}
      >
        {/* SAMPLE INFO */}
        <div className="card-section">
          <h2 className="card-title">
            <FlaskConical size={20} strokeWidth={2} /> Sample Information
          </h2>

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

        {/* HEAVY METALS */}
        <div className="card-section">
          <h2 className="card-title">
            <TestTubeDiagonal size={20} strokeWidth={2} /> Heavy Metal Concentrations
          </h2>

          <div className="input-grid metal-grid">
            <MetalInput id="lead" label="Lead (Pb)" limit="10 µg/L" />
            <MetalInput id="cadmium" label="Cadmium (Cd)" limit="5 µg/L" />
            <MetalInput id="mercury" label="Mercury (Hg)" limit="6 µg/L" />
            <MetalInput id="arsenic" label="Arsenic (As)" limit="10 µg/L" />
            <MetalInput id="chromium" label="Chromium (Cr)" limit="50 µg/L" />
            <MetalInput id="copper" label="Copper (Cu)" limit="2 mg/L" />
            <MetalInput id="zinc" label="Zinc (Zn)" limit="3 mg/L" />
            <MetalInput id="nickel" label="Nickel (Ni)" limit="70 µg/L" />
          </div>
        </div>

        {/* ====== Unit Conversion Box: place before the Calculate button ====== */}
        <div className="unit-conversion-box">
          <h3>Unit Conversion Reference</h3>

          <div className="unit-grid" style={{ marginTop: 8 }}>
            <div className="cell header"></div>
            <div className="cell header">ppm</div>
            <div className="cell header">ppb</div>
            <div className="cell header">mg/L</div>
            <div className="cell header">µg/L</div>

            <div className="cell row-header">ppm</div>
            <div className="cell">1</div>
            <div className="cell">1000</div>
            <div className="cell">1</div>
            <div className="cell">1000</div>

            <div className="cell row-header">ppb</div>
            <div className="cell">0.001</div>
            <div className="cell">1</div>
            <div className="cell">0.001</div>
            <div className="cell">1</div>

            <div className="cell row-header">mg/L</div>
            <div className="cell">1</div>
            <div className="cell">1000</div>
            <div className="cell">1</div>
            <div className="cell">1000</div>

            <div className="cell row-header">µg/L</div>
            <div className="cell">0.001</div>
            <div className="cell">1</div>
            <div className="cell">0.001</div>
            <div className="cell">1</div>
          </div>
        </div>

        <div className="button-container">
          <button type="submit" className="btn calculate-btn">
            Calculate HMPI
          </button>
        </div>
      </form>

 <div
  style={{
    background: "transparent",
    border: "none",
    boxShadow: "none",
    padding: "0",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  }}
>
  <h2
    style={{
      fontSize: "1.4rem",
      fontWeight: "600",
      color: "#1e40af",
      marginBottom: "10px",
      marginTop: "25px",
    }}
  >
    Regulatory Standards
  </h2>

  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "16px",
    }}
  >
    <a
      href="https://www.bis.gov.in/?lang=hi"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
        textDecoration: "none",
        color: "#111827",
        fontWeight: "500",
        fontSize: "1.05rem",
      }}
    >
      <CircleCheckBig color="#16a34a" size={18} />
      <span>Permissable limit as per BIS</span>
    </a>

    <a
      href="https://cpcb.nic.in/displaypdf.php?id=bmFibC9ULTA2NDMuMTYuMThfQ2hlbV8yMi0xMC0xNi5wZGY%3D&utm_source=chatgpt.com"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        marginLeft: "90px",
        marginBottom: "30px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
        textDecoration: "none",
        color: "#111827",
        fontWeight: "500",
        fontSize: "1.05rem",
      }}
    >
      <CircleCheckBig color="#16a34a" size={18} />
      <span>Acceptable limit as per NABL Standards</span>
    </a>
  </div>
</div>

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
