import React from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels"; // ✅ Import plugin
import pieData from "./pieData.js";

ChartJS.register(ArcElement, Tooltip, Legend, Title); 

const PieChart = () => {
  const chartData = {
    labels: pieData.map((data) => data.label),
    datasets: [
      {
        label: "Percentage",
        data: pieData.map((data) => data.value),
        backgroundColor: [
          "rgb(46, 184, 122)",
          "rgb(53, 83, 133)",
          "rgba(42, 161, 109, 1)",
          "rgb(0, 90, 157)",
          "rgba(20, 61, 96, 1)",
          "rgb(0, 117, 121)",
          "rgba(160, 200, 120, 1)",
        ],
        borderColor: "white",
        borderWidth: 2,
        hoverOffset: 15,
        hoverBorderColor: "white",
      },
    ],
  };

  const options = {
    responsive: true,
    layout: {
      
    },
    plugins: {
      legend: {
        position: "right",
        align: "center",
        labels: {
          boxWidth: 25,
          boxHeight: 20,
          font: { size: 12 },
          color: "black",
          padding: 14,
        },
      },
      title: {
        display: true,
        text: "Heavy Metal Composition (Cumiliative %)",
        color: "black",
        font: { size: 18, weight: "bold" },
      },
      datalabels: {
        color: "white",
        font: {
          weight: "bold",
          size: 14,
        },
        formatter: (value, context) => {
          const total = context.chart._metasets[0].total || 
                        context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
          const percentage = ((value / total) * 100).toFixed(1);
          return `${percentage}%`;
        },
      },
    },
  };

  return (
    <div className="pie-chart-container">
      <div className="graph-card" style={{ maxHeight:"500px", paddingLeft: "4rem" }}>
        <Pie data={chartData} options={options} plugins={[ChartDataLabels]} />
      </div>
    </div>
  );
};

export default PieChart;
