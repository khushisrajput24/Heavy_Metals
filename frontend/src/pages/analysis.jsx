// import "../components/ui/css/analysis.css";
// import {
//   ChartLine,
//   FileWarning,
//   FlaskConical,
//   TriangleAlert,
// } from "lucide-react";
// import Graphs from "../components/graphs/graphs.jsx";
// import PieChart from "../components/graphs/pieChart.jsx";
// import CompositeIndexChart from "../components/graphs/advanced/CompositeIndexChart.jsx";
// import CorrelationHeatmap from "../components/graphs/advanced/CorrelationHeatmap";
// import EnrichmentFactorChart from "../components/graphs/advanced/EnrichmentFactorChart.jsx";
// import ResultStandardsChart from "../components/graphs/advanced/ResultStandardsChart";
// import ForecastingTrendChart from "../components/graphs/advanced/ForecastingTrendChart";
// import Summary from "../components/graphs/advanced/Summary.jsx";
// import Overview from "../components/graphs/advanced/Overview.jsx";
// import HandleExport from "../utils/declaration";
// import { SelectContam } from "../components/analysis/selectContam.jsx";
// //Graph dependecies end here

// export const Analysis = () => {
//   // Tabs state control

//   return (
//     <div>
//       <div className="main-header-wrapper">
//         <div className="main-header">Analysis</div>
//         <div className="main-text">
//           Visualize and interpret your HMPI results with detailed breakdowns,
//           risk assessments, and expert recommendations.
//         </div>
//       </div>
//       <main className="results-page">
//         <div className="card">
//           <div className="results-header">
//             <HandleExport />
//             <div className="suggestion-group yellow px-4 py-2 rounded flex items-center gap-2">
//               <div className="warning-text">
//                 <FileWarning size={24} strokeWidth={1.8} />
//                 For the privacy concerns we do not store any data on our
//                 servers. If you wish then click to save your results locally.
//               </div>
//             </div>
//           </div>

//           <SelectContam />

//           <div id="report-content">
//             {/* Sample Information */}
//             <div className="results-card">
//               <h2 className="card-title">
//                 <FlaskConical size={20} strokeWidth={2} />
//                 Sample Information
//               </h2>
//               <div className="info-grid">
//                 <div className="info-item">
//                   <span className="info-label">Sample ID</span>
//                   <span className="info-value">GW-001</span>
//                 </div>
//                 <div className="info-item">
//                   <span className="info-label">Coordinates</span>
//                   <span className="info-value">40.7128, -74.0060</span>
//                 </div>
//                 <div className="info-item">
//                   <span className="info-label">Depth</span>
//                   <span className="info-value">15.5 m</span>
//                 </div>
//                 <div className="info-item">
//                   <span className="info-label">Date</span>
//                   <span className="info-value">9/10/2025</span>
//                 </div>
//               </div>
//             </div>
//             {/* HMPI Assessment */}
//             <div className="results-card">
//               <h2 className="card-title">
//                 <ChartLine size={20} strokeWidth={2} />
//                 HMPI Assessment
//               </h2>
//               <div className="hmpi-assessment">
//                 <div className="hmpi-score">
//                   <p className="score-value">70.3</p>
//                   <p className="score-label">HMPI Score</p>
//                 </div>
//                 <div className="hmpi-status">
//                   <div className="classification-box moderate">
//                     Moderate Pollution
//                   </div>
//                   <p className="status-subtext">Pollution Classification</p>
//                 </div>
//                 <div className="hmpi-risk">
//                   <p className="risk-level moderate">
//                     <TriangleAlert size={20} strokeWidth={2} />
//                     Medium Risk
//                   </p>
//                 </div>
//               </div>
//               <div className="risk-bar">
//                 <div className="risk-bar-track">
//                   <div
//                     className="risk-bar-fill moderate-fill"
//                     style={{ width: "67.3%" }}
//                   ></div>
//                 </div>
//                 <div className="risk-labels">
//                   <span>Safe (0-50)</span>
//                   <span>Moderate (50-100)</span>
//                   <span>High Risk (100+)</span>
//                 </div>
//               </div>
//             </div>
//             {/* Detailed Analysis Section */}
//             <div>
//               <Overview />
//               <div className="results-card">
//                 <h2 className="section-title text-2xl">
//                   Individual Heavy Metal Analysis
//                 </h2>
//                 <p className="section-subtitle">
//                   Detailed breakdown of each heavy metal concentration.
//                 </p>
//                 <Graphs />
//               </div>
//               <div>
//                 <div className="chart-grid">
//                   <CompositeIndexChart />
//                   <PieChart />
//                 </div>

//                 <CorrelationHeatmap />
//                 <EnrichmentFactorChart />
//                 <ResultStandardsChart />
//                 <ForecastingTrendChart />
//                 <Summary />
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };


// src/pages/analysis.jsx
// src/pages/analysis.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../components/ui/css/analysis.css";


import {
  ChartLine,
  FileWarning,
  FlaskConical,
  TriangleAlert,
} from "lucide-react";
import Graphs from "../components/graphs/graphs.jsx";
import PieChart from "../components/graphs/pieChart.jsx";
import CompositeIndexChart from "../components/graphs/advanced/CompositeIndexChart.jsx";
import CorrelationHeatmap from "../components/graphs/advanced/CorrelationHeatmap";
import EnrichmentFactorChart from "../components/graphs/advanced/EnrichmentFactorChart.jsx";
import ResultStandardsChart from "../components/graphs/advanced/ResultStandardsChart";
import ForecastingTrendChart from "../components/graphs/advanced/ForecastingTrendChart";
import Summary from "../components/graphs/advanced/Summary.jsx";
import Overview from "../components/graphs/advanced/Overview.jsx";
import HandleExport from "../utils/declaration";
import { SelectContam } from "../components/analysis/selectContam.jsx";
import transformGraphData from "../utils/transformGraphData";

export const Analysis = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [analysis, setAnalysis] = useState(null);
  const [chartProps, setChartProps] = useState(null);

  // Keep a debug log so you can inspect what arrives
  useEffect(() => {
    console.debug("Analysis: location change", {
      pathname: location.pathname,
      search: location.search,
      state: location.state,
      key: location.key,
    });

    if (location.state && location.state.analysis) {
      const payload = location.state.analysis;
      setAnalysis(payload);
      try {
        const transformed = transformGraphData(payload);
        setChartProps(transformed);
      } catch (err) {
        console.warn("transformGraphData failed", err);
        setChartProps(null);
      }
      return;
    }

    // No state provided — clear any previous analysis (shows CTA)
    setAnalysis(null);
    setChartProps(null);
  }, [location.key, location.search, location.state]); // react to search or state changes

  // Demo click handler — navigates with a tiny unique query so router treats it as new navigation
  const onClickDemo = (e) => {
    e?.preventDefault?.();
    const demo = {
      Decoded_Input: {
        Pb: 0.02,
        Cd: 0.004,
        Cr: 0.06,
        As: 0.02,
        Zn: 1.2,
        Fe: 0.5,
        Cu: 0.8,
      },
      ML_Predicted_HMPI: 65.3,
      Formula_HMPI: 70.3,
      HEI: 40,
      Cd_Excess: 0.001,
      MI: 20,
      CI: 70.3,
      Pollution_Status: "Moderate Pollution",
      Risk_Level: "Medium Risk",
    };

    const target = "/user/analysis"; // ensure this matches your route exactly
    const unique = Date.now();
    navigate(`${target}?t=${unique}`, { state: { analysis: demo }, replace: false });
  };

  // If no analysis arrived via navigation, show CTA to go to calculate page
  if (!analysis) {
    return (
      <div className="results-page" style={{ padding: "2rem" }}>
        <div>
          

          <div className="results-card">
            <h2 className="card-title">
              <ChartLine size={20} strokeWidth={2} />
              No Analysis Found
            </h2>

            <p>
              Go to the Calculate page and submit your input (API Key / file /
              manual entry). After calculation, click <b>View Detailed Report</b>{" "}
              to open this page with live results.
            </p>

            <div style={{ marginTop: 16 }}>
              <button
                className="btn"
                onClick={() => {
                  navigate("/user/calculate_hmpi"); // change route if your calculate page path differs
                }}
              >
                Go to Calculate Page
              </button>

              <button className="btn ml-2" onClick={onClickDemo}>
                Use Demo Data
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render analysis view when analysis object is present
  return (
    <div>
      <div className="main-header-wrapper">
        <div className="main-header">Analysis</div>
        <div className="main-text">
          Visualize and interpret your HMPI results with detailed breakdowns,
          risk assessments, and expert recommendations.
        </div>
      </div>
      <main className="results-page">
        <div className="card">
          <div className="results-header">
            <HandleExport />
            <div className="suggestion-group yellow px-4 py-2 rounded flex items-center gap-2">
              <div className="warning-text">
                <FileWarning size={24} strokeWidth={1.8} />
                For the privacy concerns we do not store any data on our
                servers. If you wish then click to save your results locally.
              </div>
            </div>
          </div>

          <SelectContam />

          <div id="report-content">
            {/* Sample Information */}
            <div className="results-card">
              <h2 className="card-title">
                <FlaskConical size={20} strokeWidth={2} />
                Sample Information
              </h2>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Sample ID</span>
                  <span className="info-value">
                    {analysis?.Decoded_Input?.sample_id}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Coordinates</span>
                  <span className="info-value">
                    {analysis?.Decoded_Input?.coordinates || "40.7128, -74.0060"}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Depth</span>
                  <span className="info-value">
                    {analysis?.Decoded_Input?.depth || "15.5 m"}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Date</span>
                  <span className="info-value">
                    {new Date().toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* HMPI Assessment */}
            <div className="results-card">
              <h2 className="card-title">
                <ChartLine size={20} strokeWidth={2} />
                HMPI Assessment
              </h2>
              <div className="hmpi-assessment">
                <div className="hmpi-score">
                  <p className="score-value">
                    {analysis ? Number(analysis.Formula_HMPI).toFixed(2) : "—"}
                  </p>
                  <p className="score-label">HMPI Score</p>
                </div>
                <div className="hmpi-status">
                  <div
                    className={`classification-box ${
                      analysis?.Pollution_Status === "Moderate Pollution"
                        ? "moderate"
                        : analysis?.Pollution_Status === "High Pollution"
                        ? "high"
                        : "safe"
                    }`}
                  >
                    {analysis?.Pollution_Status || "N/A"}
                  </div>
                  <p className="status-subtext">Pollution Classification</p>
                </div>
                <div className="hmpi-risk">
                  <p
                    className={`risk-level ${
                      analysis?.Risk_Level === "High Risk"
                        ? "high"
                        : analysis?.Risk_Level === "Medium Risk"
                        ? "moderate"
                        : "low"
                    }`}
                  >
                    <TriangleAlert size={20} strokeWidth={2} />
                    {analysis?.Risk_Level || "N/A"}
                  </p>
                </div>
              </div>
              <div className="risk-bar">
                <div className="risk-bar-track">
                  <div
                    className="risk-bar-fill moderate-fill"
                    style={{
                      width: analysis
                        ? `${Math.min(100, (Number(analysis.Formula_HMPI) / 200) * 100)}%`
                        : "0%",
                    }}
                  ></div>
                </div>
                <div className="risk-labels">
                  <span>Safe (0-50)</span>
                  <span>Moderate (50-100)</span>
                  <span>High Risk (100+)</span>
                </div>
              </div>
            </div>

            {/* Detailed Analysis Section */}
            <div>
              <Overview />
              <div className="results-card">
                <h2 className="section-title text-2xl">
                  Individual Heavy Metal Analysis
                </h2>
                <p className="section-subtitle">
                  Detailed breakdown of each heavy metal concentration.
                </p>
                <Graphs chartProps={chartProps} rawAnalysis={analysis} />
              </div>
              <div>
                <div className="chart-grid">
                  <CompositeIndexChart compositeData={chartProps?.composite} />
                  <PieChart data={chartProps?.pie} />
                </div>

                <CorrelationHeatmap data={chartProps?.correlation} />
                <EnrichmentFactorChart data={chartProps?.enrichment} />
                <ResultStandardsChart data={chartProps?.standards} />
                <ForecastingTrendChart data={chartProps?.timeseries} />
                <Summary insights={analysis?.insights || []} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Analysis;
