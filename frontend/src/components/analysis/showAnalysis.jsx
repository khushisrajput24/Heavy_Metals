const demoPayload = {
  Decoded_Input: {
    Pb: 0.02,
    Cd: 0.004,
    Cr: 0.06,
    As: 0.02,
    Zn: 1.2,
    Fe: 0.5,
    Cu: 0.8,
    sample_id: "DEMO-001",
    coordinates: "40.7128, -74.0060",
    depth: "15.5 m",
  },
  ML_Predicted_HMPI: 65.3,
  Formula_HMPI: 70.3,
  HEI: 40,
  Cd_Excess: 0.001,
  MI: 20,
  CI: 70.3,
  Pollution_Status: "Moderate Pollution",
  Risk_Level: "Medium Risk",
  insights: [
    "Demo insight: concentrations within expected demo range.",
    "Demo insight: moderate pollution detected.",
  ],
};

export default function ShowAnalysis({ applyAnalysis, response }) {
  // Normalize axios-like response
  const extractPayload = (res) => {
    if (!res) return null;
    if (res.data) return res.data;
    return res;
  };

  useEffect(() => {
    const payload = extractPayload(response);
    if (payload) applyAnalysis(payload);
  }, [response]);

  return (
    <div className="results-page" style={{ padding: "2rem" }}>
      <div className="results-card">
        <h2 className="card-title">No Analysis Found</h2>
        <p>No analysis data was passed. Use demo data to preview.</p>

        <button className="btn mt-3" onClick={() => applyAnalysis(demoPayload)}>
          Use Demo Data
        </button>
      </div>
    </div>
  );
}
