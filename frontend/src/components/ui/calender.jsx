import { useState } from "react";

const DateRangeFilter = ({ data = [], onFilter }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleFilter = () => {
    if (!startDate || !endDate) {
      onFilter(data);
      return;
    }

    const filtered = data.filter((item) => {
      const itemDate = new Date(item.date);
      const start = new Date(startDate);
      const end = new Date(endDate);

      return itemDate >= start && itemDate <= end;
    });

    onFilter(filtered);
  };

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
        onChange={(e) => setStartDate(e.target.value)}
        placeholder="Start Date"
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
        onChange={(e) => setEndDate(e.target.value)}
        placeholder="End Date"
        className="custom-select"
      />
    </div>
  );
};

export default DateRangeFilter;
