import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  ArcElement,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, ArcElement, Legend);

import barData from "./barData.json";
import barData2 from "./barData2.json";
import metalConc from "./metalConc.js";

// common colors for places
const colors = ["#355384", "#2ab97a", "#9ada80"];

const Graphs = () => {
  // Old graphs (with legend)
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { grid: { display: false } },
      y: { grid: { display: false } },
    },
  };

  // New 12 graphs (without legend)
  const barOptions2 = {
  responsive: true,
  maintainAspectRatio: 1,
  plugins: {
    legend: { display: false },
  },
  layout: {
    padding: 0, // removes extra white space around chart
  },
  scales: {
    x: { grid: { display: false } },
    y: { grid: { display: false } },
  },
};

  return (
    <div className="space-y-0">
      {/* Old 2 Graphs */}
      <div className="grid grid-cols-2 gap-0 graph-card">
        <div className="p-2 h-80">
          <h3 className="text-lg font-semibold ">
            Metal Concentration Comparison (PPM)
          </h3>
          <Bar data={barData} options={barOptions} />
        </div>
        <div className="p-2 h-80 mb-8">
          <h3 className="text-lg font-semibold mb-2">
            Metal Concentration Comparison (PPb)
          </h3>
          <Bar data={barData2} options={barOptions} />
        </div>
      </div>
        {/* New 12 Graphs */}
      <div className="grid grid-cols-3 gap-6 h-full graph-card">
        {metalConc.map((graph, index) => {
          const data = {
            labels: graph.labels,
            datasets: [
              {
                label: graph.title,
                data: graph.data,
                backgroundColor: colors,
                barPercentage: 0.6,
                categoryPercentage: 0.55,
                borderRadius: 3,
              },
            ],
          };

          return (
            <div key={index} className="p-1 h-full flex flex-col">
              <h3 className="text-sm font-semibold mb-1 text-center">
                {graph.title}
              </h3>
              <div className="h-full w-full" >
                <Bar data={data} options={barOptions2} />
              </div>
            </div>
          );
        })}
      </div> 
    </div>
  );
};

export default Graphs;

