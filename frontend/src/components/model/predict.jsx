// 2. Predict HMPI (JSON Request)
import React, { useState } from "react";

export default function PredictHMPI() {
  const [input, setInput] = useState({
    Pb: "",
    Cd: "",
    Cr: "",
    As: "",
    Zn: "",
    Fe: "",
    Cu: "",
  });

  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const predict = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/predict_hmpi`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: input }),
      }
    );

    const result = await response.json();
    console.log(result);
    alert(JSON.stringify(result, null, 2));
  };

  return (
    <div>
      <h2>Predict HMPI</h2>

      {Object.keys(input).map((key) => (
        <div key={key}>
          <label>{key}: </label>
          <input
            type="number"
            name={key}
            value={input[key]}
            onChange={handleChange}
          />
        </div>
      ))}

      <button onClick={predict}>Predict</button>
    </div>
  );
}
