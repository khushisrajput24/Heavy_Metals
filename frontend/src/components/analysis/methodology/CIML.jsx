import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";

export const CIML = () => {
  return (
    <div className="card">
      <h3 className="card-title">
        Unified Heavy Metal Index: Composite Index + Machine Learning
      </h3>

      <div>
        <b>Composite Index (CI):</b>
        <BlockMath
          math={
            "CI = \\alpha (HPI) + \\beta (HEI) + \\gamma (C_d) + \\delta (MI)"
          }
        />
        <ul className="standard-list">
          <li>
            Weights (α, β, γ, δ) assigned based on toxicity and scientific
            relevance.
          </li>
          <li>Provides a unified and explainable water quality risk score.</li>
        </ul>
      </div>

      <div>
        <b>Machine Learning (ML):</b>
        <ul className="standard-list">
          <li>
            Trained on heavy metal concentrations combined with environmental
            parameters (pH, hardness, temperature, BOD, COD), geolocation, and
            land use.
          </li>
          <li>
            Predicts water quality categories (Safe / Moderate / Critical),
            forecasts trends, and detects anomalies.
          </li>
        </ul>
      </div>
    </div>
  );
};
