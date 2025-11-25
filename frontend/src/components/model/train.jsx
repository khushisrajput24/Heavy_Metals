// 1. Train HMPI Model (CSV Upload)
import React, { useState } from "react";

export default function TrainModel() {
  const [file, setFile] = useState(null);
  const [target, setTarget] = useState("");

  const trainModel = async () => {
    const formData = new FormData();
    formData.append("target_column", target);
    formData.append("file", file);

    const response = await fetch("http://localhost:8000/train_from_csv", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    console.log("Training Result:", data);
    alert("Model Trained Successfully!");
  };

  return (
    <div>
      <h2>Train HMPI Model</h2>

      <input
        type="text"
        placeholder="Target Column"
        value={target}
        onChange={(e) => setTarget(e.target.value)}
      />

      <br />
      <br />

      <input type="file" onChange={(e) => setFile(e.target.files[0])} />

      <br />
      <br />

      <button onClick={trainModel}>Train Model</button>
    </div>
  );
}
