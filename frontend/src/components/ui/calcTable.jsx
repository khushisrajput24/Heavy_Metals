export const CalcTable = ({ prediction }) => {
  if (!Array.isArray(prediction)) return null;
  return (
    <table border="1">
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
            <td>{row.Category}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
