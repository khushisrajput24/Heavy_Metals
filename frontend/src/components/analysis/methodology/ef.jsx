import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";

export const EnrichmentFactor = () => {
  return (
    <div className="card">
      <h3 className="card-title">Enrichment Factor & Root-Cause Analysis</h3>

      <BlockMath
        math={
          "EF = \\frac{(C_i / C_{ref})_{sample}}{(C_i / C_{ref})_{background}}"
        }
      />

      <ul className="standard-list">
        <li>
          <b>EF &lt; 2:</b> Minimal enrichment – natural origin
        </li>
        <li>
          <b>2 ≤ EF &lt; 5:</b> Moderate enrichment – possible human influence
        </li>
        <li>
          <b>5 ≤ EF &lt; 20:</b> Significant enrichment – likely
          industrial/agricultural
        </li>
        <li>
          <b>20 ≤ EF &lt; 40:</b> Very high enrichment – strong human impact
        </li>
        <li>
          <b>EF ≥ 40:</b> Extremely high enrichment – severe anthropogenic
          contamination
        </li>
      </ul>

      <p>
        Helps identify contamination sources (industrial, agricultural,
        geological) and prioritize areas for remediation.
      </p>
    </div>
  );
};
