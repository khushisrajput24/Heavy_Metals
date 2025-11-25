import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";

export const Indices = () => {
  return (
    <div className="card">
      <h3 className="card-title">Computation of Heavy Metal Indices</h3>
      <ul className="standard-list">
        <li>
          <b>Heavy Metal Pollution Index (HPI):</b>
          <BlockMath
            math={
              "HPI = \\frac{\\sum (W_i \\times Q_i)}{\\sum W_i}, \\quad Q_i = \\frac{M_i - I_i}{S_i - I_i} \\times 100"
            }
          />
          <p>Reflects overall water quality with toxicity-based weightage.</p>
        </li>

        <li>
          <b>Heavy Metal Evaluation Index (HEI):</b>
          <BlockMath math={"HEI = \\sum \\frac{H_c}{H_{mac}}"} />
          <p>
            Represents cumulative effect of all metals relative to safe limits.
          </p>
        </li>

        <li>
          <b>Degree of Contamination (Cd):</b>
          <BlockMath
            math={"C_d = \\sum \\left( \\frac{C_{Ai}}{C_{Ni}} - 1 \\right)"}
          />
          <p>Flags contamination from highly toxic metals.</p>
        </li>

        <li>
          <b>Metal Index (MI):</b>
          <BlockMath math={"MI = \\sum \\frac{C_i}{MAC_i}"} />
          <p>A simpler cumulative measure for quick screening.</p>
        </li>
      </ul>
    </div>
  );
};
