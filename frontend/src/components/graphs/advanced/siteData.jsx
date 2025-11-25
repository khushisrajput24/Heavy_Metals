// Example data structure
import React from "react";
const sitesData = [
  {
    name: "Mayur Vihar",
    compositeIndex: 67.3,
    metals: { Pb: 8.5, Fe: 12.0, Cd: 3.2 },
    limits: { Pb: 10, Fe: 9, Cd: 5 },
    EF: { Pb: 15, Fe: 12, Cd: 4 },
    forecast: { Pb: [8.5, 9, 9.5], Fe: [12, 12.5, 13], Cd: [3.2, 3.3, 3.5] },
  },
  {
    name: "Dwarka Sec 23",
    compositeIndex: 52.1,
    metals: { Pb: 9.5, Ni: 6, Cd: 3.5 },
    limits: { Pb: 10, Ni: 5, Cd: 5 },
    EF: { Pb: 5, Ni: 6, Cd: 2 },
    forecast: { Pb: [9.5, 9.7, 10], Ni: [6, 6.2, 6.5], Cd: [3.5, 3.6, 3.8] },
  },
  {
    name: "Shahdara",
    compositeIndex: 28.7,
    metals: { Zn: 8, Fe: 7, Cu: 4 },
    limits: { Zn: 10, Fe: 9, Cu: 5 },
    EF: { Zn: 1.5, Fe: 1.8, Cu: 1.2 },
    forecast: { Zn: [8, 8.1, 8.2], Fe: [7, 7.1, 7.2], Cu: [4, 4.1, 4.2] },
  },
];
export default sitesData;