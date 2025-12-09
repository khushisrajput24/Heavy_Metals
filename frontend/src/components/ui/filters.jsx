import React from "react";
import { ChevronDown } from "lucide-react";

/**
 * Controlled dropdown filter.
 * props:
 * - values: array of option strings (without the "All" value)
 * - value: current selected value (string)
 * - onChange: function(newValue)
 * - placeholder: string shown as the default option (optional)
 */
export const Filters = ({ values = [], value, onChange, placeholder = "All" }) => {
  return (
    <div className="flex gap-4 items-center">
      <div className="relative">
        <select
          className="custom-select"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="All">{placeholder}</option>
          {values.map((v, idx) => (
            <option key={idx} value={v}>
              {v}
            </option>
          ))}
        </select>

        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
          <ChevronDown size={20} color="black" />
        </div>
      </div>
    </div>
  );
};
