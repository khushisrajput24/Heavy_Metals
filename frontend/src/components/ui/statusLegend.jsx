export const StatusLegend = () => {
  return (
    <div className="legend-container" style={{ marginBottom: "20px" }}>
      <h3 className="font-semibold mb-2">Legend</h3>

      <table className="legend-table" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ padding: "6px" }}>Index</th>
            <th style={{ padding: "6px" }}>Safe</th>
            <th style={{ padding: "6px" }}>Moderate</th>
            <th style={{ padding: "6px" }}>Elevated</th>
          </tr>
        </thead>

        <tbody>
          {/* HPI */}
          <tr>
            <td>
              <b>HPI</b>
            </td>
            <td className="safe">{"< 50"}</td>
            <td className="moderate">{"50 – 100"}</td>
            <td className="elevated">{"> 100"}</td>
          </tr>

          {/* HEI */}
          <tr>
            <td>
              <b>HEI</b>
            </td>
            <td className="safe">{"< 40"}</td>
            <td className="moderate">{"40 – 80"}</td>
            <td className="elevated">{"> 80"}</td>
          </tr>

          {/* MI */}
          <tr>
            <td>
              <b>MI</b>
            </td>
            <td className="safe">{"< 1"}</td>
            <td className="moderate">{"-"}</td>
            <td className="elevated">{">= 1"}</td>
          </tr>

          {/* CI */}
          <tr>
            <td>
              <b>CI</b>
            </td>
            <td className="safe">{"< 50"}</td>
            <td className="moderate">{"50 – 100"}</td>
            <td className="elevated">{"> 100"}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
