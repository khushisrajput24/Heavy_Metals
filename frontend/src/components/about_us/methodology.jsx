import { PencilRuler } from "lucide-react";

export const Methodology = () => {
  return (
    <div className="about-card methodology-card">
      <h2 className="section-title">
        <PencilRuler className="icon title" />
        Scientific Methodology
      </h2>
      <p className="subtitle methodolośgy-subtitle">
        Our methodology integrates established indices, composite modeling, and
        machine learning aligned with international standards
      </p>
      <div className="steps-grid">
        <div className="step-item">
          <div className="step-number">01</div>
          <h4 className="step-title">Index Computation</h4>
          <p>Multiple indices are calculated to assess water quality:</p>
          <ul className="methodology-list">
            <li>
              <b>HPI (Heavy Metal Pollution Index):</b> Toxicity-weighted water
              quality index.
            </li>
            <li>
              <b>HEI (Heavy Metal Evaluation Index):</b> Cumulative effect of
              all metals relative to safe limits.
            </li>
            <li>
              <b>Cd (Degree of Contamination):</b> Flags contamination from
              highly toxic metals.
            </li>
            <li>
              <b>MI (Metal Index):</b> Quick screening cumulative index.
            </li>
          </ul>
        </div>

        <div className="step-item">
          <div className="step-number">02</div>
          <h4 className="step-title">Composite Index & Machine Learning</h4>
          <p>
            A unified <b>CI (Composite Index)</b> is developed using
            toxicity-based weights. <br />
            <b>ML (Machine Learning)</b> models trained on heavy metal data,
            along with environmental parameters (pH, hardness, temperature, BOD
            – Biochemical Oxygen Demand, COD – Chemical Oxygen Demand, and
            land-use patterns), predict categories{" "}
            <b>(Safe / Moderate / Critical)</b>, detect anomalies, and forecast
            trends.
          </p>
        </div>

        <div className="step-item">
          <div className="step-number">03</div>
          <h4 className="step-title">Classification & Geotagging</h4>
          <p>Water quality is categorized using both HPI and CI+ML:</p>
          <ul className="methodology-list">
            <li>
              <b>HPI &lt; 50:</b> Safe
            </li>
            <li>
              <b>50 ≤ HPI &lt; 100:</b> Moderate Risk
            </li>
            <li>
              <b>HPI ≥ 100:</b> Critical / Unsuitable
            </li>
          </ul>
          <p>
            Results are geotagged to highlight contamination hotspots and safe
            zones on maps.
          </p>
        </div>

        <div className="step-item">
          <div className="step-number">04</div>
          <h4 className="step-title">Enrichment Factor Analysis</h4>
          <p>
            Source attribution using <b>EF (Enrichment Factor):</b>
          </p>
          <ul className="methodology-list">
            <li>
              <b>EF &lt; 2:</b> Minimal enrichment (natural origin)
            </li>
            <li>
              <b>2 &lt; EF &lt; 5:</b> Moderate enrichment (possible human
              influence)
            </li>
            <li>
              <b>5 &lt; EF &lt; 20:</b> Significant enrichment
              (industrial/agricultural)
            </li>
            <li>
              <b>20 &lt; EF &lt; 40:</b> Very high enrichment (strong human
              impact)
            </li>
            <li>
              <b>EF ≥ 40:</b> Extremely high enrichment (severe anthropogenic
              contamination)
            </li>
          </ul>
          <p>Provides root-cause insights for remediation strategies.</p>
        </div>
      </div>
    </div>
  );
};
