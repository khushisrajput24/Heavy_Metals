export const CalcTable = ({ prediction }) => {
  if (!Array.isArray(prediction)) return null;

  return (
    <div className="reports-table"
    style={{ width: "100%", overflowX: "auto" }}>
      <table
        border="1"
        style={{
          width: "max-content",   // lets table grow as wide as needed
          whiteSpace: "nowrap",   // prevents text wrapping
        }}
      >
        <thead>
          <tr>
            <th>S.No.</th>
            <th>Location</th>
            <th>Cr</th>
            <th>Mn</th>
            <th>Fe</th>
            <th>Ni</th>
            <th>Cu</th>
            <th>Zn</th>
            <th>As</th>
            <th>Year</th>
            <th>HPI</th>
            <th>HEI</th>
            <th>MI</th>
            <th>CI</th>
            <th>Category</th>
          </tr>
        </thead>

        <tbody>
          {prediction.map((row, idx) => (
            <tr key={idx}>
              <td>{row["S.No."]}</td>
              <td>{row.Location}</td>
              <td>{row.Cr}</td>
              <td>{row.Mn}</td>
              <td>{row.Fe}</td>
              <td>{row.Ni}</td>
              <td>{row.Cu}</td>
              <td>{row.Zn}</td>
              <td>{row.As}</td>
              <td>{row.Year}</td>
              <td>{row.HPI}</td>
              <td>{row.HEI}</td>
              <td>{row.MI}</td>
              <td>{row.CI}</td>
              <td
                className={
                  row.Category === "Moderate Pollution"
                    ? `status-badge alert`
                    : row.Category === "High Pollution"
                    ? `status-badge critical`
                    : row.Category === "Safe"
                    ? `status-badge safe`
                    : ""
                }
              >
                {row.Category === "Moderate Pollution"
                  ? "Alert"
                  : row.Category === "High Pollution"
                  ? "Critical"
                  : row.Category === "Safe"
                  ? "Safe"
                  : ""}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
