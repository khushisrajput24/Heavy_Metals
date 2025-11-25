import { useState } from "react";
import { ReportsTable } from "../components/ui/report_table.jsx";
import SearchAutocomplete from "../components/ui/searchbar.jsx";
import { useReportStore } from "../store/reportStore";
import { Button } from "../components/ui/button.jsx";

export const Reports = () => {
  const reports = useReportStore((state) => state.reports);
  const [search, setSearch] = useState(""); // Add state to store the search term

  return (
    <div>
      <div className="main-header-wrapper">
        <div className="main-header">Reports</div>
        <div className="flex justify-between items-center gap-4">
          <div className="main-text">
            View and manage all HMPI reports generated from groundwater sample
            data.
          </div>
          <Button type="main" colorVariant="danger">
            Raise an Issue
          </Button>
        </div>
      </div>

      <div className="m-4" style={{ width: 400, padding: 2 }}>
        <SearchAutocomplete setSearch={setSearch} />{" "}
      </div>

      <div className="card">
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
            {reports
              .filter((report) => {
                return search.toLowerCase() === ""
                  ? true
                  : report.region
                      .toLowerCase()
                      .includes(search.toLowerCase()) ||
                      report.metal
                        .toLowerCase()
                        .includes(search.toLowerCase()) ||
                      report.status
                        .toLowerCase()
                        .includes(search.toLowerCase()) ||
                      report.date.includes(search);
              })
              .map((report, index) => (
                <ReportsTable key={index} report={report} index={index} />
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
