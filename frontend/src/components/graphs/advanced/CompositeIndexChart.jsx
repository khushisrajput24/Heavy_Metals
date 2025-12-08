// // src/components/graphs/advanced/CompositeIndexChart.jsx
// import React from "react";
// import { Radar } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   RadialLinearScale,
//   PointElement,
//   LineElement,
//   Filler,
//   Tooltip,
//   Legend,
//   Title,
// } from "chart.js";

// ChartJS.register(
//   RadialLinearScale,
//   PointElement,
//   LineElement,
//   Filler,
//   Tooltip,
//   Legend,
//   Title
// );

// const buildFromComposite = (compositeData) => {
//   // compositeData expected shape:
//   // { labels: [...], series: [{ name, data: [...] }, ...] }
//   if (!compositeData) {
//     // fallback to original dummy
//     return {
//       labels: ["HPI", "HEI", "MI", "Cd"],
//       datasets: [
//         {
//           label: "Mayur Vihar",
//           data: [65, 40, 55, 10],
//           backgroundColor: "rgba(53, 83, 132, 0.2)",
//           borderColor: "rgba(53, 83, 132, 1)",
//           borderWidth: 2,
//           pointBackgroundColor: "rgba(53, 83, 132, 1)",
//         },
//         {
//           label: "Dwarka Sec 23",
//           data: [80, 45, 60, 20],
//           backgroundColor: "rgba(42, 185, 122, 0.2)",
//           borderColor: "rgba(42, 185, 122, 1)",
//           borderWidth: 2,
//           pointBackgroundColor: "rgba(42, 185, 122, 1)",
//         },
//       ],
//     };
//   }

//   const labels = compositeData.labels || [];
//   const datasets = (compositeData.series || []).map((s, i) => {
//     // choose colors by index (chartjs accepts rgba string)
//     const baseColors = [
//       "53,83,132",
//       "42,185,122",
//       "154,218,128",
//       "240,120,120",
//       "180,140,220",
//     ];
//     const c = baseColors[i % baseColors.length];
//     return {
//       label: s.name || `Series ${i + 1}`,
//       data: s.data || [],
//       backgroundColor: `rgba(${c}, 0.2)`,
//       borderColor: `rgba(${c}, 1)`,
//       borderWidth: 2,
//       pointBackgroundColor: `rgba(${c}, 1)`,
//     };
//   });

//   return { labels, datasets };
// };

// const CompositeIndexChart = ({ compositeData }) => {
//   const chartData = buildFromComposite(compositeData);

//   const options = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         position: "top",
//         labels: {
//           font: { size: 13 },
//           color: "#000",
//         },
//       },
//       title: {
//         display: true,
//         text: "Composite Index Comparison (HPI, HEI, MI, Cd)",
//         font: { size: 18, weight: "bold" },
//         color: "#111",
//         padding: { bottom: 12, top: 10 },
//       },
//     },
//     scales: {
//       r: {
//         beginAtZero: true,
//         min: 0,
//         max: 100,
//         ticks: {
//           stepSize: 20,
//           color: "#444",
//         },
//         pointLabels: {
//           color: "#111",
//           font: {
//             size: 14,
//             weight: "bold",
//           },
//         },
//         grid: {
//           color: "rgba(0,0,0,0.1)",
//         },
//         angleLines: {
//           color: "rgba(0,0,0,0.1)",
//         },
//       },
//     },
//   };

//   return (
//     <div className="graph-card" style={{ height: "500px", padding: "1rem" }}>
//       <Radar data={chartData} options={options} />
//     </div>
//   );
// };

// export default CompositeIndexChart;

// src/components/graphs/advanced/CompositeIndexChart.jsx
import React, { useMemo } from "react";
import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  Title
);

/**
 * Utility: try to build a unified compositeData shape from several possible inputs:
 * - Already in shape { labels: [...], series: [{ name, data: [...]}, ...] }
 * - analysis-like object: { Formula_HMPI, HEI, MI, Decoded_Input: { Cd: ... } }
 * - a single-series object where values are numbers
 */
function normalizeComposite(input) {
  if (!input) return null;

  // If already the expected shape
  if (Array.isArray(input.labels) && Array.isArray(input.series)) {
    return input;
  }

  // If someone passed an "analysis" raw object (fields at top-level)
  const topKeys = ["Formula_HMPI", "HEI", "MI"];
  const hasTopKeys = topKeys.every((k) => k in input);

  if (hasTopKeys) {
    const cdVal =
      input?.Decoded_Input?.Cd ??
      input?.Decoded_Input?.Cd_Excess ??
      input?.Cd ??
      input?.Cd_Excess ??
      0;

    return {
      labels: ["HMPI", "HEI", "MI", "Cd"],
      series: [
        {
          name: "This Sample",
          data: [
            Number(input.Formula_HMPI || 0),
            Number(input.HEI || 0),
            Number(input.MI || 0),
            Number(cdVal || 0),
          ],
        },
      ],
    };
  }

  // If input is an object with numeric values directly (e.g. {HPI:.., HEI:..})
  const numericKeys = Object.entries(input).filter(
    ([k, v]) => typeof v === "number" || typeof v === "string"
  );

  if (numericKeys.length >= 2) {
    // pick first 4 numeric keys (stable order)
    const sliced = numericKeys.slice(0, 4);
    const labels = sliced.map(([k]) => k);
    const data = sliced.map(([, v]) => Number(v));
    return {
      labels,
      series: [{ name: "This Sample", data }],
    };
  }

  // If nothing matched
  return null;
}

const chooseColor = (i) => {
  const baseColors = [
    "53,83,132",
    "42,185,122",
    "154,218,128",
    "240,120,120",
    "180,140,220",
  ];
  return baseColors[i % baseColors.length];
};

const buildChartData = (compositeDataNormalized) => {
  if (!compositeDataNormalized) return null;

  const labels = compositeDataNormalized.labels || [];
  const datasets =
    (compositeDataNormalized.series || []).map((s, i) => {
      // if s.data is not array but single number, convert it to array matching labels length
      let data = s.data;
      if (!Array.isArray(data)) {
        if (typeof data === "number") {
          // replicate the single number across labels (fallback)
          data = labels.map(() => data);
        } else if (typeof data === "object" && data !== null) {
          // If data is an object like {HPI:.., HEI:..} convert by labels
          data = labels.map((lab) =>
            typeof data[lab] !== "undefined" ? Number(data[lab]) : 0
          );
        } else {
          data = labels.map(() => 0);
        }
      }

      // ensure length matches labels (pad/truncate)
      if (data.length < labels.length) {
        data = data.concat(new Array(labels.length - data.length).fill(0));
      } else if (data.length > labels.length) {
        data = data.slice(0, labels.length);
      }

      const c = chooseColor(i);
      return {
        label: s.name || `Series ${i + 1}`,
        data,
        backgroundColor: `rgba(${c}, 0.2)`,
        borderColor: `rgba(${c}, 1)`,
        borderWidth: 2,
        pointBackgroundColor: `rgba(${c}, 1)`,
      };
    }) || [];

  return { labels, datasets };
};

const CompositeIndexChart = ({ compositeData }) => {
  // debug - helps you see what arrives in props (remove in production)
  // eslint-disable-next-line no-console
  console.debug("CompositeIndexChart: received compositeData:", compositeData);

  // normalize and memoize to avoid unnecessary recalcs
  const normalized = useMemo(() => normalizeComposite(compositeData), [compositeData]);

  // build chartData
  const chartData = useMemo(() => buildChartData(normalized), [normalized]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: { size: 13 },
          color: "#000",
        },
      },
      title: {
        display: true,
        text: "Composite Index Comparison (HPI, HEI, MI, Cd)",
        font: { size: 18, weight: "bold" },
        color: "#111",
        padding: { bottom: 12, top: 10 },
      },
    },
    scales: {
      r: {
        beginAtZero: true,
        min: 0,
        // If values exceed 100, auto-scale by not forcing max.
        // You can set max to 100 if you want a fixed scale.
        ticks: {
          stepSize: 10,
          color: "#444",
        },
        pointLabels: {
          color: "#111",
          font: {
            size: 14,
            weight: "bold",
          },
        },
        grid: {
          color: "rgba(0,0,0,0.1)",
        },
        angleLines: {
          color: "rgba(0,0,0,0.1)",
        },
      },
    },
  };

  // show friendly placeholder if no usable data
  if (!chartData || !chartData.datasets || chartData.datasets.length === 0) {
    return (
      <div className="graph-card" style={{ height: "300px", padding: "1rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <strong>Composite Index</strong>
          <p style={{ margin: 0, color: "#666" }}>
            No composite data available yet. Provide an analysis payload or use
            the Calculate → View Detailed Report flow.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="graph-card" style={{ height: "500px", padding: "1rem" }}>
      <Radar data={chartData} options={options} />
    </div>
  );
};

export default CompositeIndexChart;
