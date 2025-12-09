import { useLocation } from "react-router-dom";
import { useState, useMemo } from "react";
import { Download, Search } from "lucide-react";
import { saveAs } from "file-saver";
import { CalcTable } from "../ui/calcTable";
import { Button } from "../ui/button";
import DateRangeFilter from "../ui/calender";

export default function BulkReport() {
  const { state } = useLocation();
  const data = state?.fullData || [];

  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Dynamic columns
  const columns = useMemo(() => {
    const set = new Set();
    data.forEach((row) => Object.keys(row).forEach((c) => set.add(c)));
    return [...set];
  }, [data]);

  // Min/max date (based on ALL data)
  const { minDate, maxDate } = useMemo(() => {
    let min = null,
      max = null;

    for (const r of data) {
      const d = new Date(r.date);
      if (isNaN(d)) continue;
      if (!min || d < min) min = d;
      if (!max || d > max) max = d;
    }

    const fmt = (d) => (d ? d.toISOString().slice(0, 10) : "");

    return {
      minDate: fmt(min),
      maxDate: fmt(max),
    };
  }, [data]);

  // Filtering logic
  const filteredData = data.filter((row) => {
    // Universal row search
    const rowString = Object.values(row)
      .map((v) => (v === null || v === undefined ? "" : String(v)))
      .join(" ")
      .toLowerCase();

    const matchesSearch = rowString.includes(search.toLowerCase());

    // Date range filter
    let matchesRange = true;
    const d = new Date(row.date);

    if (!isNaN(d)) {
      if (startDate && d < new Date(startDate)) matchesRange = false;
      if (endDate && d > new Date(endDate)) matchesRange = false;
    }

    return matchesSearch && matchesRange;
  });

  // CSV Download
  const downloadCSV = () => {
    if (!data.length) return;

    const escapeVal = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;

    const header = columns.join(",");
    const rows = data.map((row) =>
      columns.map((col) => escapeVal(row[col])).join(",")
    );

    const csvContent = [header, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });

    saveAs(blob, "bulk_report.csv");
  };

  function handleDateChange(type, value) {
    if (type === "start") setStartDate(value);
    if (type === "end") setEndDate(value);
  }

  return (
    <div className="w-[90%] mx-auto">
      {/* Controls */}
      {/* Download CSV */}
      <div className="flex justify-end">
        <Button onClickHandler={downloadCSV} type="main" colorVariant="primary">
          <Download size={18} className="mr-2" />
          Download CSV
        </Button>
      </div>
      <div className="flex justify-between items-center mb-5">
        {/* Search */}
        <div className="flex items-center border px-3 py-2 rounded-md w-1/3">
          <Search size={18} className="mr-2 text-gray-600" />
          <input
            type="text"
            placeholder="Search all fields..."
            className="outline-none w-full"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Date Range Filter */}
        <DateRangeFilter
          startDate={startDate}
          endDate={endDate}
          min={minDate}
          max={maxDate}
          onChange={handleDateChange}
        />
      </div>

      {/* Data Table */}
      <CalcTable prediction={filteredData} />
    </div>
  );
}
