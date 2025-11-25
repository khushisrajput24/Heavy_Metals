import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ForecastTrendChart = () => {
  const sites = ["Mayur Vihar", "Dwarka Sec 23", "Shahdara"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // Observed HPI data until June
  const observedData = [
    [50.1, 51.4, 51.6, 52.5, 53.7, 54.2], // Site 1
    [45.8, 46, 46.8, 47.3, 47.5, 48], // Site 2
    [55.9, 56.2, 57.6, 58.1, 59.7, 60], // Site 3
  ];

  // Predicted HPI data from July onward
  const predictedData = [
    [54.2,55.1, 56.4, 56.1, 57.6, 57.8, 58], // Site 1
    [49.5,50.1, 50.4, 50.7, 51.3, 51.5, 52], // Site 2
    [59.3,60.1, 60.5, 61.1, 62.2, 62.5, 63], // Site 3
  ];

  const sitesColors = [
    "rgba(53,83,132,1)",  // Site 1
    "rgba(42,185,122,1)", // Site 2
    "rgba(154,218,128,1)" // Site 3
  ];

  // Create datasets: solid observed, dashed predicted
// Create datasets: solid observed, dashed predicted
const datasets = sites.map((site, i) => [
  {
    label: `${site} Observed`,
    data: [...observedData[i], ...Array(months.length - observedData[i].length).fill(null)], // solid line till June, rest null
    borderColor: sitesColors[i],
    backgroundColor: sitesColors[i],
    tension: 0.3,
    fill: false,
    borderWidth: 2,
    pointRadius: 3,
  },
  {
    label: `${site} Predicted`,
    data: [
      ...Array(observedData[i].length - 1).fill(null), // null for Jan → May
      observedData[i][observedData[i].length - 1], // June: start predicted from last observed
      ...predictedData[i].slice(1) // July → Dec predicted values
    ],
    borderColor: sitesColors[i],
    borderDash: [6, 4],
    tension: 0.3,
    fill: false,
    pointRadius: 3,
  },
]).flat();


  const data = { labels: months, datasets };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Predicted HPI Trends",
        font: { size: 18, weight: "bold" },
        color: "#080808",
        padding: { bottom: 15, top: 8},
      },
      tooltip: { mode: "index", intersect: false },
      legend: {
        position: "bottom",
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          padding: 15,
        },
      },
    },
    interaction: { mode: "nearest", intersect: false },
    scales: {
      y: {
        title: { display: true, text: "HPI" },
        min: 40,
        max: 70,
        ticks: { stepSize: 3 },
      },
      x: { title: { display: true, text: "Month" } },
    },
  };

  return (
    <div className="graph-card" style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "500px",
      maxHeight:"550px",
    }} >
      
      <Line data={data} options={options} />
    </div>
  );
};

export default ForecastTrendChart;