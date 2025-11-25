import { Earth } from "lucide-react";

export const Impact = () => {
  return (
    <div className="about-card impact-card">
      <h2 className="section-title">
        <Earth className="icon title" />
        Global Impact
      </h2>
      <p className="subtitle impact-subtitle">
        Supporting researchers, institutions, and policymakers worldwide
      </p>
      <div className="impact-stats">
        <div className="stat-item">
          <p style={{ fontSize: "2rem", fontWeight: 700, color: "#212336" }}>
            500+
          </p>
          <p className="stat-label">Research Institutions</p>
        </div>
        <div className="stat-item">
          <p style={{ fontSize: "2rem", fontWeight: 700, color: "#212336" }}>
            50k+
          </p>
          <p className="stat-label">Samples Analyzed</p>
        </div>
        <div className="stat-item">
          <p style={{ fontSize: "2rem", fontWeight: 700, color: "#212336" }}>
            25
          </p>
          <p className="stat-label">Countries</p>
        </div>
        <div className="stat-item">
          <p style={{ fontSize: "2rem", fontWeight: 700, color: "#212336" }}>
            99.9%
          </p>
          <p className="stat-label">Accuracy Rate</p>
        </div>
      </div>
    </div>
  );
};
