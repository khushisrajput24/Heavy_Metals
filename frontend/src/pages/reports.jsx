import { useMemo, useState } from "react";
import { ReportsTable } from "../components/ui/report_table.jsx";
import SearchAutocomplete from "../components/ui/searchbar.jsx";
import { useReportStore } from "../store/reportStore";
import { Button } from "../components/ui/button.jsx";
import { Filters } from "../components/ui/filters.jsx";
import DateRangeFilter from "../components/ui/calender.jsx";

export const Reports = () => {
  const reports = useReportStore((state) => state.reports || []);

  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("All");
  const [metal, setMetal] = useState("All");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const metalVals = ["Arsenic", "Zinc", "Nickel", "Cadmium", "Lead"];
  const regionVals = ["Mayur Vihar", "GK-2", "Burari", "Janakpuri", "Daulatpur"];

  // =============================
  // COMPUTE MIN/MAX DATE FROM REPORTS
  // =============================
  const { minDate, maxDate } = useMemo(() => {
    let min = null, max = null;

    for (const r of reports) {
      const d = new Date(r.date);
      if (isNaN(d)) continue;
      if (!min || d < min) min = d;
      if (!max || d > max) max = d;
    }

    const fmt = (d) => (d ? d.toISOString().slice(0, 10) : "");

    return {
      minDate: fmt(min),
      maxDate: fmt(max)
    };
  }, [reports]);


  // =============================
  // RESET FILTERS
  // =============================
  const resetFilters = () => {
    setSearch("");
    setRegion("All");
    setMetal("All");
    setStartDate("");
    setEndDate("");
  };


  // =============================
  // ON DATE CHANGE HANDLER
  // =============================
  function handleDateChange(type, value) {
    if (type === "start") setStartDate(value);
    if (type === "end")  setEndDate(value);
  }


  return (
    <div>
      <div className="main-header-wrapper">
        <div className="main-header">Reports</div>

        <div className="flex justify-between items-center gap-4">
          <div className="main-text">
            View and manage all HMPI reports generated from groundwater sample data.
          </div>

          <div className="flex gap-2">
            <Button type="main" colorVariant="secondary" onClick={resetFilters}>
              Reset Filters
            </Button>

            <Button type="main" colorVariant="danger">
              Raise an Issue
            </Button>
          </div>
        </div>
      </div>


      {/* ============================= */}
      {/* SEARCH + FILTERS ROW */}
      {/* ============================= */}
      <div className="flex items-center gap-3 m-4">
        <div className="w-[400px]">
          <SearchAutocomplete setSearch={setSearch} />
        </div>

        <Filters
          values={metalVals}
          value={metal}
          onChange={setMetal}
          placeholder="All Metals"
        />

        <Filters
          values={regionVals}
          value={region}
          onChange={setRegion}
          placeholder="All Regions"
        />

        <DateRangeFilter
          startDate={startDate}
          endDate={endDate}
          onChange={handleDateChange}
        />
      </div>


      {/* ============================= */}
      {/* TABLE */}
      {/* ============================= */}
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
                const reportDate = new Date(report.date);
                const validDate = !isNaN(reportDate);

                // Effective date window:
                const effStart = startDate || minDate;
                const effEnd   = endDate   || maxDate;

                const matchDate = validDate
                  ? (!effStart || reportDate >= new Date(effStart)) &&
                    (!effEnd   || reportDate <= new Date(effEnd))
                  : true;

                const matchSearch =
                  search === "" ||
                  report.region.toLowerCase().includes(search.toLowerCase()) ||
                  report.metal.toLowerCase().includes(search.toLowerCase()) ||
                  report.status.toLowerCase().includes(search.toLowerCase()) ||
                  report.date.includes(search);

                const matchRegion = region === "All" || region === report.region;
                const matchMetal = metal === "All" || metal === report.metal;

                return matchSearch && matchRegion && matchMetal && matchDate;
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
