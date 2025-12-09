import React, { useState, useMemo, useCallback } from "react";
import {
  FlaskConical,
  TestTubeDiagonal,
  ChevronDown,
  CircleCheckBig,
} from "lucide-react";
import { handleManualSubmit } from "../../utils/functions/manualUpload"; // path -> adjust if needed
import "../ui/css/about_us.css";
import "../ui/css/data_entry.css";

import {
  permissibleLimitsUgPerL as defaultPermissible,
  acceptableLimitsUgPerL as defaultAcceptable,
} from "../../utils/constants"; // adjust path if needed

/* Helper: displayName -> internal key used in formData/units */
const toInternalKey = (displayName) =>
  displayName.replace(/\(.*?\)/g, "").replace(/[^a-zA-Z]/g, "").toLowerCase();

/* Reusable MetalInput (memoized) */
const MetalInput = React.memo(function MetalInput({
  internalId,
  displayName,
  label,
  value,
  unit,
  onChangeValue,
  onChangeUnit,
  error,
  permissible,
  acceptable,
  editingLimits,
  onLimitChange,
}) {
  return (
    <div className="input-group">
      <label htmlFor={internalId}>{label}</label>

      <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "6px" }}>
        {!editingLimits ? (
          <>
            <span className="limit">Permissible: {permissible ?? "—"} µg/L</span>
            <span className="limit">Acceptable: {acceptable ?? "—"} µg/L</span>
          </>
        ) : (
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <label style={{ fontSize: "12px" }}>
              Perm:
              <input
                type="number"
                step="any"
                value={permissible === null ? "" : permissible}
                onChange={(e) => onLimitChange(displayName, "permissible", e.target.value)}
                style={{ marginLeft: "6px", width: "110px", height: "34px", padding: "6px" }}
                placeholder="µg/L"
              />
            </label>

            <label style={{ fontSize: "12px" }}>
              Acc:
              <input
                type="number"
                step="any"
                value={acceptable === null ? "" : acceptable}
                onChange={(e) => onLimitChange(displayName, "acceptable", e.target.value)}
                style={{ marginLeft: "6px", width: "110px", height: "34px", padding: "6px" }}
                placeholder="µg/L"
              />
            </label>
          </div>
        )}
      </div>

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
          id={internalId}
          name={internalId}
          inputMode="numeric"
          autoComplete="off"
          placeholder={`Enter value in ${unit || "µg/L"}`}
          value={value ?? ""}
          onChange={(e) => onChangeValue(internalId, e.target.value)}
        />

        <div style={{ position: "relative", width: "120px" }}>
          <select
            value={unit || "µg/L"}
            onChange={(e) => onChangeUnit(internalId, e.target.value)}
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

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
});

const StatusLegend = ({ statusLabels }) => {
  return (
    <div
      style={{
        marginTop: "20px",
        padding: "10px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
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
          const statusClass = index === 0 ? "positive" : index === 1 ? "critical" : "negative";

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

export default function ManualUpload() {
  // create default limits from constants (source of truth initial values)
  const defaultLimits = useMemo(() => {
    const res = {};
    const keys = Object.keys(defaultPermissible || {});
    keys.forEach((m) => {
      res[m] = {
        permissible: defaultPermissible[m] ?? null,
        acceptable: defaultAcceptable[m] ?? null,
      };
    });
    return res;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // state
  const [limits, setLimits] = useState(defaultLimits);
  const [editingLimits, setEditingLimits] = useState(false);

  // metal names derived from current limits (re-renders when limits change)
  const metalDisplayNames = useMemo(() => Object.keys(limits || {}), [limits]);

  // form data keyed by internal keys (e.g., 'lead', 'cadmium')
  const [formData, setFormData] = useState(() => {
    const base = { latitude: "", longitude: "" };
    metalDisplayNames.forEach((m) => (base[toInternalKey(m)] = ""));
    return base;
  });

  // keep units keyed by internal key
  const [units, setUnits] = useState(() => {
    const u = {};
    metalDisplayNames.forEach((m) => (u[toInternalKey(m)] = "µg/L"));
    return u;
  });

  // errors & result
  const [errors, setErrors] = useState({});
  const [hmpi, setHmpi] = useState(null);

  // custom metal temp state
  const [customMetal, setCustomMetal] = useState({
    name: "",
    conc: "",
    permissible: "",
    acceptable: "",
  });

  // ensure when limits change (e.g., user added metal) we have corresponding keys in formData & units
  const ensureFormKeys = useCallback(
    (newLimits) => {
      setFormData((prev) => {
        const copy = { ...prev };
        Object.keys(newLimits).forEach((displayName) => {
          const k = toInternalKey(displayName);
          if (!(k in copy)) copy[k] = "";
        });
        return copy;
      });
      setUnits((prev) => {
        const copy = { ...prev };
        Object.keys(newLimits).forEach((displayName) => {
          const k = toInternalKey(displayName);
          if (!(k in copy)) copy[k] = "µg/L";
        });
        return copy;
      });
    },
    [setFormData, setUnits]
  );

  // call once initially and whenever limits change
  React.useEffect(() => {
    ensureFormKeys(limits);
  }, [limits, ensureFormKeys]);

  // handlers
  const handleInputChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value == null ? "" : String(value) }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  }, []);

  const handleUnitChange = useCallback((field, value) => {
    setUnits((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleLimitChange = (displayName, field, rawValue) => {
    setLimits((prev) => ({
      ...prev,
      [displayName]: {
        ...prev[displayName],
        [field]: rawValue === "" ? null : Number(rawValue),
      },
    }));
  };

  const resetLimits = () => setLimits(defaultLimits);

  const addCustomMetal = () => {
    const name = (customMetal.name || "").trim();
    if (!name) return;

    const displayName = name;
    const internalKey = toInternalKey(displayName);

    // avoid overwriting existing metal if same displayName exists
    setLimits((prev) => {
      if (prev[displayName]) return prev; // already exists
      return {
        ...prev,
        [displayName]: {
          permissible:
            customMetal.permissible === "" ? null : Number(customMetal.permissible),
          acceptable:
            customMetal.acceptable === "" ? null : Number(customMetal.acceptable),
        },
      };
    });

    setFormData((prev) => ({ ...prev, [internalKey]: customMetal.conc || "" }));
    setUnits((prev) => ({ ...prev, [internalKey]: "µg/L" }));

    setCustomMetal({
      name: "",
      conc: "",
      permissible: "",
      acceptable: "",
    });
  };

  return (
    <div id="manual-entry-form" className="w-[60%] mx-auto">
      <form
        className="calculator-form"
        onSubmit={(e) => handleManualSubmit(e, formData, setHmpi, setErrors, units, limits)}
      >
        <div className="card-section">
          <h2 className="card-title">
            <FlaskConical size={20} strokeWidth={2} />
            Sample Information
          </h2>
          <p className="card-subtitle">Enter basic information about your groundwater sample</p>
          <div className="input-grid">
            <div className="input-group">
              <label htmlFor="latitude">Latitude</label>
              <input
                type="text"
                id="latitude"
                placeholder="e.g., 40.7128"
                value={formData.latitude}
                onChange={(e) => handleInputChange("latitude", e.target.value)}
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
                onChange={(e) => handleInputChange("longitude", e.target.value)}
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
          <p className="card-subtitle">Enter the concentration values for each heavy metal detected</p>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <div>
              <label style={{ marginRight: "8px" }}>
                <input type="checkbox" checked={editingLimits} onChange={() => setEditingLimits((s) => !s)} /> Edit limits
              </label>
            </div>

            {editingLimits && (
              <div style={{ display: "flex", gap: "8px" }}>
                <button type="button" className="btn" onClick={resetLimits}>Reset to defaults</button>
              </div>
            )}
          </div>

          <div className="input-grid metal-grid">
            {metalDisplayNames.map((displayName) => {
              const internalId = toInternalKey(displayName);

              return (
                <MetalInput
                  key={displayName}
                  internalId={internalId}
                  displayName={displayName}
                  label={displayName}
                  value={formData[internalId] ?? ""}
                  unit={units[internalId] ?? "µg/L"}
                  onChangeValue={handleInputChange}
                  onChangeUnit={handleUnitChange}
                  error={errors[internalId]}
                  permissible={limits[displayName]?.permissible ?? null}
                  acceptable={limits[displayName]?.acceptable ?? null}
                  editingLimits={editingLimits}
                  onLimitChange={handleLimitChange}
                />
              );
            })}
          </div>

          {/* Add custom metal */}
          <div style={{ marginTop: "20px" }}>
            <h2 className="card-title">Add New Metal</h2>

            <div className="input-grid">
              <div className="input-group">
                <label>Metal Name</label>
                <input
                  value={customMetal.name}
                  onChange={(e) => setCustomMetal({ ...customMetal, name: e.target.value })}
                />
              </div>
              <div className="input-group">
                <label>Metal Conc (µg/L)</label>
                <input
                  value={customMetal.conc}
                  onChange={(e) => setCustomMetal({ ...customMetal, conc: e.target.value })}
                />
              </div>

              <div className="input-group">
                <label>Permissible (µg/L)</label>
                <input
                  type="number"
                  value={customMetal.permissible}
                  onChange={(e) => setCustomMetal({ ...customMetal, permissible: e.target.value })}
                />
              </div>

              <div className="input-group">
                <label>Acceptable (µg/L)</label>
                <input
                  type="number"
                  value={customMetal.acceptable}
                  onChange={(e) => setCustomMetal({ ...customMetal, acceptable: e.target.value })}
                />
              </div>

              <button
                type="button"
                className="btn"
                style={{ padding: "4px 10px", height: "50px", alignContent: "center", justifyContent: "center" }}
                onClick={addCustomMetal}
              >
                + Add Metal
              </button>
            </div>
          </div>
        </div>

        <div className="button-container">
          <button type="submit" className="btn calculate-btn">Calculate HMPI</button>
        </div>
      </form>

      {hmpi !== null && (
        <div className="center ">
          <div>
            <h3 className="calculated-title">Calculated Values:</h3>
            <ul className="calculated-list">
              <li className={`classification-box ${hmpi.hpi < 50 ? "safe" : hmpi.hpi <= 100 ? "moderate" : "elevated"}`}>
                <b>HPI:</b> {typeof hmpi.hpi === "number" ? hmpi.hpi.toFixed(4) : hmpi.hpi}
              </li>

              <li className={`classification-box ${hmpi.mi < 1 ? "safe" : "elevated"}`}>
                <b>MI:</b> {typeof hmpi.mi === "number" ? hmpi.mi.toFixed(4) : hmpi.mi}
              </li>

              <li className={`classification-box ${hmpi.Cd < 8 ? "safe" : hmpi.Cd < 32 ? "moderate" : "elevated"}`}>
                <b>Cd:</b> {typeof hmpi.Cd === "number" ? hmpi.Cd.toFixed(4) : hmpi.Cd}
              </li>

              <li className={`classification-box ${hmpi.hei < 40 ? "safe" : hmpi.hei <= 80 ? "moderate" : "elevated"}`}>
                <b>HEI:</b> {typeof hmpi.hei === "number" ? hmpi.hei.toFixed(4) : hmpi.hei}
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
              BIS 10500 (2012): Drinking water for Permissible and Acceptable limits
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
