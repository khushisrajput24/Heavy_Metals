import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { metals } from "../../utils/constants";

export const SelectContam = () => {
  const navigate = useNavigate();
  const [contaminant, setContaminant] = useState("");
  const options = metals;

  return (
    <div className="search-filter-container">
      <div className="relative">
        <select
          value={contaminant}
          onChange={(e) => setContaminant(e.target.value)}
          className="custom-select"
          name="contaminant"
          id="contaminant"
        >
          <option value="">Select contaminant</option>
          {options.map((metal) => (
            <option key={metal} value={metal.toLowerCase()}>
              {metal}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
          <ChevronDown size={20} color="black" />
        </div>
      </div>

      <Button
        colorVariant="primary"
        type="main"
        onClickHandler={() => {
          if (!contaminant) {
            alert("Please select a contaminant first!");
            return;
          }
          navigate(
            `/user/analysis/suggestions/${encodeURIComponent(contaminant)}`
          );
        }}
      >
        Browse Suggestions
      </Button>
    </div>
  );
};
