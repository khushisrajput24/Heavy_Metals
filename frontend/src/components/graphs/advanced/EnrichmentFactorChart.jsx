import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const EnrichmentFactorChart = () => {
  const data = {
    labels: ["Minimal (<2)", "Moderate (2-5)", "Significant (5-20)", "Very High (20-40)", "Extremely High (≥40)"],
    datasets: [
      {
        label: "Mayur Vihar",
        data: [12, 7, 4, 2, 1],
        backgroundColor: "rgba(53, 83, 132, 1)",
         borderRadius: 6,
         barPercentage: 0.9,
         
      },
      {
        label: "Dwarka Sec 23",
        data: [10, 8, 5, 1, 0],
        backgroundColor: "rgba(42, 185, 122, 1)",
         borderRadius: 6,
         barPercentage: 0.9,
      },
      {
        label: "Shahdara",
        data: [8, 6, 7, 2, 1],
        backgroundColor: "rgba(154, 218, 128, 1)",
         borderRadius: 6,
         barPercentage: 0.9,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Enrichment Factor (EF) Source Attribution", font: { size: 18, weight: "bold" },
        color: "#080808",
        padding: { bottom: 15 }, },
      datalabels: {
        color: "white", // ✅ White font for data labels
         // optional: adds readability
        textShadowBlur: 1, // optional: adds readability
        font: {
          weight: 400,
          size: 14,
        },},
      tooltip: { mode: "index", intersect: false },
    },
    scales: {
      x: { stacked: true, grid: { display: false } }, // ✅ remove x grid lines
      y: { stacked: true, grid: { display: false } }, // ✅ remove y grid lines
    },
  };

  return (
    <div className="graph-card" style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "500px",
      maxHeight:"550px",
    }}>
        <Bar data={data} options={options} plugins={[ChartDataLabels]} />
    </div>
  );
};

export default EnrichmentFactorChart;
