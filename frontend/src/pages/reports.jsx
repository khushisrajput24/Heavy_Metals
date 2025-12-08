import { useState } from "react";
import { ReportsTable } from "../components/ui/report_table.jsx";
import SearchAutocomplete from "../components/ui/searchbar.jsx";
import { useReportStore } from "../store/reportStore";
import { Button } from "../components/ui/button.jsx";
import { Filters } from "../components/ui/filters.jsx";
import DateRangeFilter from "../components/ui/calender.jsx";

export const Reports = () => {
  const reports = useReportStore((state) => state.reports);
  const [search, setSearch] = useState("");

  const [region, setRegion] = useState("All");
  const [metal, setMetal] = useState("All");

  const metalVals = ['Metal', 'Arsenic', 'Zinc', 'Nickel', 'Cadnium', 'Lead'];
  const regionVals = ['Place', 'Mayur Vihar', 'GK-2', 'Burari', 'Janakpuri', 'Daulatpur'];

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

      <div className="ml-4 mt-2">
        <Button type="main" colorVariant="secondary">
          Add a Report
        </Button>
      </div>

      {/* ✅ Search + Filters Row */}
      <div className="flex items-center gap-3 m-4">
        <div className="w-[400px]">
          <SearchAutocomplete setSearch={setSearch} />
        </div>

        {/* ✅ Region Dropdown using .custom-select */}
        {/* <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="custom-select"
        >
          <option value="All">All Regions</option>
          <option value="Mayur Vihar">Mayur Vihar</option>
          <option value="GK 2">GK 2</option>
          <option value="Hirankudna">Hirankudna</option>
        </select> */}

        {/* ✅ Metal Dropdown using .custom-select */}
        <Filters values={metalVals}/>
        <Filters values={regionVals}/>
        <DateRangeFilter />
      </div>


      {/* ✅ Table */}
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
                const matchSearch =
                  search === "" ||
                  report.region.toLowerCase().includes(search.toLowerCase()) ||
                  report.metal.toLowerCase().includes(search.toLowerCase()) ||
                  report.status.toLowerCase().includes(search.toLowerCase()) ||
                  report.date.includes(search);

                const matchRegion =
                  region === "All" || report.region === region;

                const matchMetal =
                  metal === "All" || report.metal === metal;

                return matchSearch && matchRegion && matchMetal;
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
