import { useState } from "react";
import {
  FlaskConical,
  TestTubeDiagonal,
  ChevronDown,
  CircleCheckBig,
} from "lucide-react";
import { handleManualSubmit } from "../../utils/functions/manualUpload";
import { useViewReport } from "../../utils/functions/utility";
import "../ui/css/about_us.css";
import "../ui/css/data_entry.css";
export default function ManualInput() {
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

  const MetalInput = ({ id, label, limit, alimit }) => (
    <div className="input-group">
      <label htmlFor={id}>{label}</label>
      <span className="limit">Permissible Limit: {limit}</span>

      <span className="limit">Acceptable Limit: {alimit}</span>

      <div
        className="metal-input-wrapper"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <input
          type="text"
          id={id}
          placeholder={`Enter value in ${units[id]}`}
          value={formData[id]}
          onChange={handleInputChange}
        />

        <div
          style={{
            position: "relative",
            width: "120px",
          }}
        >
          <select
            value={units[id]}
            onChange={(e) => handleUnitChange(e, id)}
            aria-label={`${label} unit`}
            style={{
              width: "100%",
              height: "40px",
              padding: "6px 32px 6px 8px",
              appearance: "none",
              borderRadius: "6px",
              border: "1px solid #ccc",
              fontSize: "14px",
              backgroundColor: "white",
            }}
          >
            <option value="ppm">ppm</option>
            <option value="ppb">ppb</option>
            <option value="mg/L">mg/L</option>
            <option value="µg/L">µg/L</option>
          </select>

          {/* CHEVRON INSIDE DROPDOWN */}
          <ChevronDown
            size={18}
            style={{
              position: "absolute",
              right: "8px",
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "none",
              color: "#555",
            }}
          />
        </div>
      </div>

      {errors[id] && <p className="text-red-500 text-xs mt-1">{errors[id]}</p>}
    </div>
  );
  const [submitted, setSubmitted] = useState(false);

  const StatusLegend = ({ statusLabels }) => {
    return (
      <div
        style={{
          marginTop: "20px",
          padding: "10px",
          alignContent: "center",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="card-title">Status Legend</div>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "20px",
            marginTop: "10px",
          }}
        >
          {statusLabels.map((label, index) => {
            const statusClass =
              index === 0 ? "positive" : index === 1 ? "critical" : "negative";

            return (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <div
                  className={`status-dot ${statusClass}`}
                  style={{
                    width: "18px",
                    height: "18px",
                    borderRadius: "50%",
                  }}
                ></div>
                <div className="card-label">{label}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div id="manual-entry-form" className="w-[60%] mx-auto">
      <form
        className="calculator-form"
        onSubmit={(e) => handleManualSubmit(e, formData, setHmpi, setErrors)}
      >
        {/* metals */}
        <div
          id="manual-entry-form"
          className="w-[60%] mx-auto min-h-screen flex flex-col justify-center items-center"
        >
          <h2 className="card-title">
            <TestTubeDiagonal size={20} strokeWidth={2} />
            Heavy Metal Concentrations
          </h2>
          <p className="card-subtitle">
            Enter the concentration values for each heavy metal detected
          </p>
          <div className="input-grid metal-grid">
            <MetalInput
              id="lead"
              label="Lead (Pb)"
              limit="10 µg/L"
              alimit="10 µg/L"
            />
            <MetalInput
              id="cadmium"
              label="Cadmium (Cd)"
              limit="3 µg/L"
              alimit="3 µg/L"
            />
            <MetalInput
              id="mercury"
              label="Mercury (Hg)"
              limit="1 µg/L"
              alimit="1 µg/L"
            />
            <MetalInput
              id="arsenic"
              label="Arsenic (As)"
              limit="50 µg/L"
              alimit="10 µg/L"
            />
            <MetalInput
              id="chromium"
              label="Chromium (Cr)"
              limit="50 µg/L"
              alimit="50 µg/L"
            />
            <MetalInput
              id="copper"
              label="Copper (Cu)"
              limit="1500 µg/L"
              alimit="50 µg/L"
            />
            <MetalInput
              id="zinc"
              label="Zinc (Zn)"
              limit="15000 µg/L"
              alimit="5000 µg/L"
            />
            <MetalInput
              id="nickel"
              label="Nickel (Ni)"
              limit="20 µg/L"
              alimit="20 µg/L"
            />
          </div>
        </div>

        <div className="button-container">
          <button
            type="button"
            className="btn calculate-btn"
            onClick={() => {
              setSubmitted(true);
              navigator("/field_work");
            }}
          >
            {submitted ? "Submitted" : "Submit the Data"}
          </button>
        </div>
      </form>

      {hmpi !== null && (
        <div className="center ">
          <div>
            <h3 className="calculated-title">Calculated Values:</h3>
            <ul className="calculated-list">
              <li
                className={`classification-box ${
                  hmpi.hpi < 50
                    ? "safe"
                    : hmpi.hpi <= 100
                    ? "moderate"
                    : "elevated"
                }`}
              >
                <b>HPI:</b> {hmpi.hpi.toFixed(4)}
              </li>

              <li
                className={`classification-box ${
                  hmpi.mi < 1 ? "safe" : "elevated"
                }`}
              >
                <b>MI:</b> {hmpi.mi.toFixed(4)}
              </li>

              <li
                className={`classification-box ${
                  hmpi.cd < 8 ? "safe" : hmpi.cd < 32 ? "moderate" : "elevated"
                }`}
              >
                <b>Cd:</b> {hmpi.cd.toFixed(4)}
              </li>

              <li
                className={`classification-box ${
                  hmpi.hei < 40
                    ? "safe"
                    : hmpi.hei <= 80
                    ? "moderate"
                    : "elevated"
                }`}
              >
                <b>HEI:</b> {hmpi.hei.toFixed(4)}
              </li>
            </ul>
          </div>
          <StatusLegend statusLabels={["Safe", "Critical", "Risky"]} />
        </div>
      )}

      <div className="standards-section">
        <div className="standards-list">
          <h2 className="section-title">Regulatory Standards</h2>

          <a
            href="https://cpcb.nic.in/wqm/BIS_Drinking_Water_Specification.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="standard-item"
          >
            <CircleCheckBig className="check-icon" />
            <span>
              BIS 10500 (2012): Drinking water for Permissible and Acceptable
              limits
            </span>
          </a>

          <a
            href="https://law.resource.org/pub/us/cfr/ibr/002/apha.method.3120.1992.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="standard-item"
          >
            <CircleCheckBig className="check-icon" />
            <span>
              APHA Method 3120: Standard Methods for the Examination of Water
            </span>
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
