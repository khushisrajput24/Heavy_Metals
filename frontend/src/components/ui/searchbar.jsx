import { useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { Search as SearchIcon } from "lucide-react";
import InputAdornment from "@mui/material/InputAdornment";

const options = ["Noida", "Mercury", "Ghaziabad", "2025", "Lead"];

export default function SearchAutocomplete({ setSearch }) {
  const [inputValue, setInputValue] = useState(""); // Input value for autocomplete

  return (
    <Autocomplete
      freeSolo
      options={options}
      inputValue={inputValue}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue); // Update the input value for autocomplete
        setSearch(newInputValue); // Pass the new search term to the parent
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Search by region, date range, or metal"
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon
                  size={20}
                  strokeWidth={1.8}
                  style={{ color: "#6b7280" }}
                />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              height: "2.2rem",
              padding: "0px 10px", // Adjust padding for better fit
            },
            "& .MuiInputBase-input": {
              padding: "6px 8px",
            },
          }}
        />
      )}
    />
  );
}
