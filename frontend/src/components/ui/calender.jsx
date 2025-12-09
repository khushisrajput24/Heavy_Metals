import { useState } from "react";

const DateRangeFilter = ({ startDate, endDate, onChange }) => {
  return (
    <div className="flex items-center gap-3">
      <label
        style={{
          fontWeight: "bold",
          color: "#333",
          marginRight: "1px",
          marginLeft: "50px",
        }}
      >
        Start Date:
      </label>

      <input
        type="date"
        value={startDate}
        onChange={(e) => onChange("start", e.target.value)}
        className="custom-select"
      />

      <label
        style={{
          fontWeight: "bold",
          color: "#333",
          marginLeft: "20px",
          marginRight: "1px",
        }}
      >
        End Date:
      </label>

      <input
        type="date"
        value={endDate}
        onChange={(e) => onChange("end", e.target.value)}
        className="custom-select"
      />
    </div>
  );
};

export default DateRangeFilter;
