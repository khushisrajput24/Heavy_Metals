import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ResultStandardsChart = () => {
  // Metal lists
  const ppmMetals = ["Chromium", "Manganese", "Iron", "Nickel", "Copper", "Zinc", "Arsenic"];
  const ppbMetals = ["Selenium", "Silver", "Cadmium", "Lead"];

  // Site colors
  const sitesColors = [
    "rgba(53, 83, 132, 1)",  // Site 1
    "rgba(42, 185, 122, 1)", // Site 2
    "rgba(154, 218, 128, 1)" // Site 3
  ];

  // Observed data
 const ppmObserved = [
  [0.059, 0.043, 0.089], // Chromium
  [0.060, 0.031, 0.140],       // Manganese
  [0.204, 0.079, 0.064],       // Iron
  [0.024, 0.044, 0.094], // Nickel
  [0.055, 0.150, 0.040],    // Copper
  [0.035, 0.046, 0.069],     // Zinc
  [0.0259, 0.0158, 0.0127],     // Arsenic
];
 const ppmStandard = [0.05, 0.1, 0.2, 0.02, 0.05, 5, 0.01]; 
  const ppbObserved = [
    [12, 23, 48],
    [102, 75, 20],
    [2, 4, 2.5],
    [4, 5, 12],
  ];
  const ppbStandard = [40, 100, 3, 10];

  // Generate datasets
  const generateDatasets = (observed, standard) =>
    sitesColors.map((color, siteIndex) => ({
      label: siteNames[siteIndex],
      data: observed.map((metal) => metal[siteIndex]),
      backgroundColor: color,
      borderRadius: 3,
      barThickness: 25,
      categoryPercentage: 0.9,
      barPercentage: 0.8,
    }));
  const siteNames = ["Mayur Vihar", "Dwarka Sec 23", "Shahdara"];

  const ppmData = {
    labels: ppmMetals,
    datasets: generateDatasets(ppmObserved, ppmStandard),
  };

  const ppbData = {
    labels: ppbMetals,
    datasets: generateDatasets(ppbObserved, ppbStandard),
  };

  // Chart options
  const options = (standards, unit) => ({
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: `Observed Vs WHO/CPCB Limits (${unit})`,
        font: { size: 18, weight: "bold" },
        color: "#080808",
        padding: { bottom: 10 },
      },
      datalabels: {
        color: "white", // ✅ White font for data labels
         // optional: adds readability
        textShadowBlur: 1, // optional: adds readability
        font: {
          weight: 300,
          size: 12,
        },},
      tooltip: { mode: "nearest", intersect: true },
      legend: { position: "top" },
    },
    scales: {
      x: {
        title: { display: true, text: `Concentration (${unit})` },
        grid: { display: false },
      },
      y: {
        title: { display: true, text: "Metal" },
        grid: { display: false },
      },
    },
    animation: {
      onComplete: function () {
        const chart = this;
        const ctx = chart.ctx;

        chart.data.datasets.forEach((dataset, datasetIndex) => {
          const meta = chart.getDatasetMeta(datasetIndex);
          dataset.data.forEach((value, i) => {
            const bar = meta.data[i];
            const standardX = chart.scales.x.getPixelForValue(standards[i]);

            // Dashed vertical line
            ctx.save();
            ctx.strokeStyle = "black";
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.moveTo(standardX, bar.y - bar.height / 2);
            ctx.lineTo(standardX, bar.y + bar.height / 2);
            ctx.stroke();
            ctx.restore();

            // Red marker for bars exceeding standard
            if (value > standards[i]) {
              ctx.save();
              ctx.fillStyle = "red";
              ctx.font = "bold 16px Arial";
              ctx.textAlign = "left";
              ctx.textBaseline = "middle";
              ctx.fillText("⚠", bar.x + 4, bar.y);
              ctx.restore();
            }
          });
        });
      },
    },
  });

  return (
    <div>
      {/* PPM Metals */}
      <div
        className="graph-card"
        style={{ marginBottom: "2rem", height: `${ppmMetals.length * 105}px` }}
      >
        <Bar data={ppmData} options={options(ppmStandard, "PPM")} plugins={[ChartDataLabels]} />
      </div>

      {/* PPB Metals */}
      <div
        className="graph-card"
        style={{ height: `${ppbMetals.length * 130}px` }}   
      >
        <Bar data={ppbData} options={options(ppbStandard, "PPB")} plugins={[ChartDataLabels]} />
      </div>
    </div>
  );
};

export default ResultStandardsChart;
