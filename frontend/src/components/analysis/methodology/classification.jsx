export const Classification = () => {
  return (
    <div className="card">
      <h3 className="card-title">
        Classification + Geotagging of Water Quality
      </h3>
      <div className="classification-grid">
        <div className="classification-box safe">
          <p className="range-value">HPI &lt; 50</p>
          <p className="range-description">Safe</p>
        </div>
        <div className="classification-box moderate">
          <p className="range-value">50 ≤ HPI &lt; 100</p>
          <p className="range-description">Moderate Risk</p>
        </div>
        <div className="classification-box elevated">
          <p className="range-value">HPI ≥ 100</p>
          <p className="range-description">Critical / Unsuitable</p>
        </div>
      </div>
      <p>
        <b className="card-subtitle">Enhanced Classification:</b> <br />
        Combines composite index and ML outputs for enhanced Safe / Moderate /
        Critical categorization, integrated with geospatial mapping to highlight
        hotspots and safe zones.
      </p>
    </div>
  );
};
