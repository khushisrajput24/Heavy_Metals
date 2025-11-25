export const ReportsTable = ({ report, index }) => {
  // This component renders a single table row based on the 'report' prop.
  // The previous code to fetch data by ID was incorrect for this component's purpose.
  return (
    <tr>
      <td>{index + 1}</td>
      <td>{report.region}</td>
      <td>{report.date}</td>
      <td>{report.metal}</td>
      <td>{report.hpi}</td>
      <td>{report.ci}</td>
      <td className={`status-badge ${report.status.toLowerCase()}`}>
        <span>{report.status}</span>
      </td>
    </tr>
  );
};
