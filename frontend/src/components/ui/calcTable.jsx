import { StatusLegend } from "./statusLegend";

const getClass = (key, value) => {
  if (value == null || value === "" || isNaN(value)) return "";

  switch (key) {
    case "HPI":
      return value < 50 ? "safe" : value <= 100 ? "moderate" : "elevated";

    case "HEI":
      return value < 40 ? "safe" : value <= 80 ? "moderate" : "elevated";

    case "MI":
      return value < 1 ? "safe" : "elevated";

    case "CI":
      return value < 50 ? "safe" : value < 100 ? "moderate" : "elevated";

    default:
      return "";
  }
};

const getCategoryFromCI = (ci) => {
  if (ci < 50) return "Safe";
  if (ci < 100) return "Moderate Pollution";
  return "High Pollution";
};

const getCategoryBadge = (ci) => {
  if (ci < 50) return "status-badge safe";
  if (ci < 100) return "status-badge alert";
  return "status-badge critical";
};

// Helper to safely convert numbers
const num = (val) => {
  const n = Number(val);
  return isNaN(n) ? 0 : n;
};

export const CalcTable = ({ prediction }) => {
  if (!Array.isArray(prediction)) return null;

  return (
    <>
      <StatusLegend />
      <div
        className="reports-table"
        style={{ width: "100%", overflowX: "auto" }}
      >
        <table
          border="1"
          style={{
            width: "max-content",
            whiteSpace: "nowrap",
          }}
        >
          <thead>
            <tr>
              <th>S.No.</th>
              <th>Cr</th>
              <th>Mn</th>
              <th>Fe</th>
              <th>Ni</th>
              <th>Cu</th>
              <th>Zn</th>
              <th>As</th>

              <th>HPI</th>
              <th>HEI</th>
              <th>MI</th>
              <th>Composite Index</th>
              <th>Risk Tagging</th>
            </tr>
          </thead>

          <tbody>
            {prediction.map((row, idx) => {
              const HPI = num(row.HPI);
              const HEI = num(row.HEI);
              const MI = num(row.MI);
              const CI = num(row.CI);

              return (
                <tr key={idx}>
                  <td>{idx + 1}</td>

                  <td>{row.Cr}</td>
                  <td>{row.Mn}</td>
                  <td>{row.Fe}</td>
                  <td>{row.Ni}</td>
                  <td>{row.Cu}</td>
                  <td>{row.Zn}</td>
                  <td>{row.As}</td>

                  <td className={getClass("HPI", HPI)}>{HPI.toFixed(4)}</td>
                  <td className={getClass("HEI", HEI)}>{HEI.toFixed(4)}</td>
                  <td className={getClass("MI", MI)}>{MI.toFixed(4)}</td>
                  <td className={getClass("CI", CI)}>{CI.toFixed(4)}</td>

                  <td className={getCategoryBadge(CI)}>
                    {getCategoryFromCI(CI) === "Moderate Pollution"
                      ? "Alert"
                      : getCategoryFromCI(CI) === "High Pollution"
                      ? "Critical"
                      : "Safe"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};
