import { useState } from "react";
import { Button } from "../components/ui/button";
import "../components/ui/css/analysis.css";
import {
  ChartLine,
  FileWarning,
  FlaskConical,
  TriangleAlert,
} from "lucide-react";
import Graphs from "../components/graphs/graphs.jsx";
// import { ExportReport } from "../utils/export";
import PieChart from "../components/graphs/pieChart.jsx";
import CompositeIndexChart from "../components/graphs/advanced/CompositeIndexChart.jsx";
import CorrelationHeatmap from "../components/graphs/advanced/CorrelationHeatmap";
import EnrichmentFactorChart from "../components/graphs/advanced/EnrichmentFactorChart.jsx";
import ResultStandardsChart from "../components/graphs/advanced/ResultStandardsChart";
import ForecastingTrendChart from "../components/graphs/advanced/ForecastingTrendChart";
import Summary from "../components/graphs/advanced/Summary.jsx";
import Overview from "../components/graphs/advanced/Overview.jsx";
import HandleExport from "../utils/declaration";
//Graph dependecies end here

export const Analysis = () => {
  // Tabs state control
  const [activeTab, setActiveTab] = useState("metal-analysis");
  // const [exporting, setExporting] = useState(false);
  // const [hasExported, setHasExported] = useState(false);

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
            {/* <Button
              colorVariant="primary"
              type="main"
              onClickHandler={() => ExportReport("GW-001", setExporting)}
              disabled={exporting}
            >
              {exporting ? "Exporting..." : "Export Report"}
            </Button> */}

            <HandleExport />

            <div className="suggestion-group yellow px-4 py-2 rounded flex items-center gap-2">
              <div className="warning-text">
                <FileWarning size={24} strokeWidth={1.8} />
                For the privacy concerns we do not store any data on our
                servers. If you wish then click to save your results locally.
              </div>
            </div>
          </div>

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
                  <span className="info-value">GW-001</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Coordinates</span>
                  <span className="info-value">40.7128, -74.0060</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Depth</span>
                  <span className="info-value">15.5 m</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Date</span>
                  <span className="info-value">9/10/2025</span>
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
                  <p className="score-value">70.3</p>
                  <p className="score-label">HMPI Score</p>
                </div>
                <div className="hmpi-status">
                  <div className="classification-box moderate">
                    Moderate Pollution
                  </div>
                  <p className="status-subtext">Pollution Classification</p>
                </div>
                <div className="hmpi-risk">
                  <p className="risk-level moderate">
                    <TriangleAlert size={20} strokeWidth={2} />
                    Medium Risk
                  </p>
                </div>
              </div>
              <div className="risk-bar">
                <div className="risk-bar-track">
                  <div
                    className="risk-bar-fill moderate-fill"
                    style={{ width: "67.3%" }}
                  ></div>
                </div>
                <div className="risk-labels">
                  <span>Safe (0-50)</span>
                  <span>Moderate (50-100)</span>
                  <span>High Risk (100+)</span>
                </div>
              </div>
            </div>

            {/* Individual Analysis */}
            {activeTab === "metal-analysis" && (
              <div>
                <Overview />
                <div className="results-card">
                  <h2 className="section-title text-2xl">
                    Individual Heavy Metal Analysis
                  </h2>
                  <p className="section-subtitle">
                    Detailed breakdown of each heavy metal concentration.
                  </p>
                  <Graphs />
                </div>
                <div>
                  <div className="chart-grid">
                    <CompositeIndexChart />
                    <PieChart />
                  </div>

                  <CorrelationHeatmap />
                  <EnrichmentFactorChart />
                  <ResultStandardsChart />
                  <ForecastingTrendChart />
                  <Summary />
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
