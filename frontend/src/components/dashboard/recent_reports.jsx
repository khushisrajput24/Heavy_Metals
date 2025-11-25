import { ReportsTable } from "../../components/ui/report_table.jsx";
import { useReportStore } from "../../store/reportStore";

export const RecentReports = () => {
  const reports = useReportStore((state) => state.reports);

  // Sort reports by date in descending order, then slice the first 5
  const firstFiveReports = reports
    .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort by date descending
    .slice(0, 5); // Get the first 5 reports

  return (
    <div className="card">
      <div className="card-title">Recent Reports</div>
      <table className="reports-table">
        <thead>
          <tr>
            <th>Report ID</th>
            <th>Region</th>
            <th>Date</th>
            <th>Metal</th>
            <th>HPI</th>
            <th>UHI</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {firstFiveReports.map((report, index) => (
            <ReportsTable key={index} report={report} index={index} />
          ))}
        </tbody>
      </table>
    </div>
  );
};
