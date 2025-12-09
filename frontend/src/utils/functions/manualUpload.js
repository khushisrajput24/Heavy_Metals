// import { permissibleLimitsUgPerL } from "../constants";

// // HPI calculation function
// const manual_calc = (values) => {
//   let numerator = 0;
//   let denominator = 0;

//   for (let metal in permissibleLimitsUgPerL) {
//     const Li = permissibleLimitsUgPerL[metal]; // mg/L standard
//     const Ci = values[metal] || 0;

//     const Qi = (Ci / Li) * 100;  // sub-index
//     const Wi = 1 / Li;           // weight

//     numerator += Wi * Qi;
//     denominator += Wi;
//   }

//   return denominator !== 0 ? (numerator / denominator).toFixed(3) : "NaN";
// };


// export const handleManualSubmit = (event, formData, setHmpi, setErrors) => {
//   event.preventDefault();

//   const newErrors = {};

//   // Sample info
//   if (!formData.sampleId.trim()) {
//     newErrors.sampleId = "Sample ID is required.";
//   }

//   const depth = Number(formData.depth);
//   if (!formData.depth.trim()) {
//     newErrors.depth = "Depth is required.";
//   } else if (Number.isNaN(depth) || depth <= 0) {
//     newErrors.depth = "Depth must be a positive number.";
//   }

//   const lat = Number(formData.latitude);
//   if (!formData.latitude.trim()) {
//     newErrors.latitude = "Latitude is required.";
//   } else if (Number.isNaN(lat) || lat < -90 || lat > 90) {
//     newErrors.latitude = "Latitude must be between -90 and 90.";
//   }

//   const lng = Number(formData.longitude);
//   if (!formData.longitude.trim()) {
//     newErrors.longitude = "Longitude is required.";
//   } else if (Number.isNaN(lng) || lng < -180 || lng > 180) {
//     newErrors.longitude = "Longitude must be between -180 and 180.";
//   }

//   // Metals
//   const metalsConfig = [
//     { key: "lead", label: "Lead (Pb)" },
//     { key: "cadmium", label: "Cadmium (Cd)" },
//     { key: "mercury", label: "Mercury (Hg)" },
//     { key: "arsenic", label: "Arsenic (As)" },
//     { key: "chromium", label: "Chromium (Cr)" },
//     { key: "copper", label: "Copper (Cu)" },
//     { key: "zinc", label: "Zinc (Zn)" },
//     { key: "nickel", label: "Nickel (Ni)" },
//   ];

//   metalsConfig.forEach(({ key, label }) => {
//     const raw = formData[key];
//     const num = Number(raw);

//     if (!raw.trim()) {
//       newErrors[key] = `${label} is required.`;
//     } else if (Number.isNaN(num) || num < 0) {
//       newErrors[key] = `${label} must be a non-negative number.`;
//     }
//   });

//   // If any errors, set and stop
//   if (Object.keys(newErrors).length > 0) {
//     setErrors(newErrors);
//     setHmpi(null);
//     return;
//   }

//   // Valid: clear errors and calculate
//   setErrors({});

//   const values = {
//     "Lead (Pb)": Number(formData.lead),
//     "Cadmium (Cd)": Number(formData.cadmium),
//     "Mercury (Hg)": Number(formData.mercury),
//     "Arsenic (As)": Number(formData.arsenic),
//     "Chromium (Cr)": Number(formData.chromium),
//     "Copper (Cu)": Number(formData.copper),
//     "Zinc (Zn)": Number(formData.zinc),
//     "Nickel (Ni)": Number(formData.nickel),
//   };

//   const result = manual_calc(values);
//   setHmpi(result);
// };


// import React, { useState } from "react";
// import { permissibleLimitsUgPerL } from "../constants";

// const convertToUgPerL = (value, unit) => {
//   const v = Number(value);
//   if (Number.isNaN(v)) return NaN;

//   switch (unit) {
//     case "ppm": // 1 ppm = 1 mg/L = 1000 µg/L
//     case "mg/L":
//       return v * 1000;
//     case "ppb": // 1 ppb = 1 µg/L
//     case "µg/L":
//       return v * 1;
//     default:
//       return NaN;
//   }
// };

// export const computeHPI = (valuesInUgPerL) => {
//   let numerator = 0;
//   let denominator = 0;

//   for (let metal in permissibleLimitsUgPerL) {
//     const Li = permissibleLimitsUgPerL[metal]; // permissible limit (Mi)
//     const Ci = valuesInUgPerL[metal] || 0;     // measured value (Si)
//     const Ii = 0;                              // ideal value for heavy metals

//     // Qi = ((Si - Ii) / (Mi - Ii)) * 100
//     const Qi = ((Ci - Ii) / (Li - Ii)) * 100;

//     // Wi = 1 / Mi
//     const Wi = 1 / Li;

//     numerator += Wi * Qi;
//     denominator += Wi;
//   }

//   return denominator !== 0 ? Number((numerator / denominator).toFixed(3)) : NaN;
// };

// // --- 1) Heavy Metal Evaluation Index (HEI) ---
// // HEI = sum( Ci / Si ) where Si = maximum allowable concentration (µg/L)
// export function computeHEI(valuesInUgPerL) {
//   let sum = 0;
//   for (const metalKey in permissibleLimitsUgPerL) {
//     const Si = permissibleLimitsUgPerL[metalKey];
//     const Ci = Number(valuesInUgPerL[metalKey]) || 0;
//     // avoid division by zero
//     if (Si > 0) sum += Ci / Si;
//   }
//   // return numeric value (not percent); if you prefer %, multiply by 100
//   return Number.isFinite(sum) ? Number(sum.toFixed(4)) : NaN;
// }

// // --- 2) Metal Index (MI) ---
// // MI = sum( Ci / MAC_i ), where MAC_i is maximum allowable concentration for metal i.
// // This is essentially the same functional form as HEI in many usages.
// // We'll implement it the same way but provide a separate function for semantic clarity.
// export function computeMI(valuesInUgPerL) {
//   // Implementation identical to computeHEI but kept separate for clarity
//   let sum = 0;
//   for (const metalKey in permissibleLimitsUgPerL) {
//     const MAC = permissibleLimitsUgPerL[metalKey];
//     const Ci = Number(valuesInUgPerL[metalKey]) || 0;
//     if (MAC > 0) sum += Ci / MAC;
//   }
//   return Number.isFinite(sum) ? Number(sum.toFixed(4)) : NaN;
// }

// // --- 3) Degree of Contamination (Cd) ---
// // Contamination factor Cf_i = Ci / Si (Si = standard/reference).
// // Degree of contamination Cd = sum(Cf_i)  (many studies use this; classification below)
// export function computeDegreeOfContamination(valuesInUgPerL) {
//   let Cd = 0;
//   const perMetalCf = {}; // optional: store individual Cf values

//   for (const metalKey in permissibleLimitsUgPerL) {
//     const Si = permissibleLimitsUgPerL[metalKey];
//     const Ci = Number(valuesInUgPerL[metalKey]) || 0;
//     const Cf = Si > 0 ? Ci / Si : 0;
//     perMetalCf[metalKey] = Number(Cf.toFixed(4));
//     Cd += Cf;
//   }

//   Cd = Number(Cd.toFixed(4));
//   return { Cd, perMetalCf };
// }

// export const handleManualSubmit = (event, formData, setHmpi, setErrors, units) => {
//   // NOTE: units must be passed from parent component state (object keyed by metal ids)
//   event.preventDefault();

//   const newErrors = {};

//   // Sample info
//   if (!formData.sampleId.trim()) {
//     newErrors.sampleId = "Sample ID is required.";
//   }

//   const depth = Number(formData.depth);
//   if (!formData.depth.trim()) {
//     newErrors.depth = "Depth is required.";
//   } else if (Number.isNaN(depth) || depth <= 0) {
//     newErrors.depth = "Depth must be a positive number.";
//   }

//   const lat = Number(formData.latitude);
//   if (!formData.latitude.trim()) {
//     newErrors.latitude = "Latitude is required.";
//   } else if (Number.isNaN(lat) || lat < -90 || lat > 90) {
//     newErrors.latitude = "Latitude must be between -90 and 90.";
//   }

//   const lng = Number(formData.longitude);
//   if (!formData.longitude.trim()) {
//     newErrors.longitude = "Longitude is required.";
//   } else if (Number.isNaN(lng) || lng < -180 || lng > 180) {
//     newErrors.longitude = "Longitude must be between -180 and 180.";
//   }

//   // Metals config (same as your existing list)
//   const metalsConfig = [
//     { key: "lead", label: "Lead (Pb)" },
//     { key: "cadmium", label: "Cadmium (Cd)" },
//     { key: "mercury", label: "Mercury (Hg)" },
//     { key: "arsenic", label: "Arsenic (As)" },
//     { key: "chromium", label: "Chromium (Cr)" },
//     { key: "copper", label: "Copper (Cu)" },
//     { key: "zinc", label: "Zinc (Zn)" },
//     { key: "nickel", label: "Nickel (Ni)" },
//   ];

//   metalsConfig.forEach(({ key, label }) => {
//     const raw = formData[key];
//     const num = Number(raw);

//     if (!raw.trim()) {
//       newErrors[key] = `${label} is required.`;
//     } else if (Number.isNaN(num) || num < 0) {
//       newErrors[key] = `${label} must be a non-negative number.`;
//     }
//   });

//   // If any errors, set and stop
//   if (Object.keys(newErrors).length > 0) {
//     setErrors(newErrors);
//     setHmpi(null);
//     return;
//   }

//   // Valid: clear errors and calculate
//   setErrors({});

//   // Map internal id (e.g. "lead") to the permissibleLimits key (e.g. "Lead (Pb)")
//   const metalKeyMap = {
//     lead: "Lead (Pb)",
//     cadmium: "Cadmium (Cd)",
//     mercury: "Mercury (Hg)",
//     arsenic: "Arsenic (As)",
//     chromium: "Chromium (Cr)",
//     copper: "Copper (Cu)",
//     zinc: "Zinc (Zn)",
//     nickel: "Nickel (Ni)",
//   };

//   // Build values object converted to µg/L
//   const valuesInUgPerL = {};
//   metalsConfig.forEach(({ key }) => {
//     const displayKey = metalKeyMap[key];
//     const inputVal = formData[key];
//     const selectedUnit = (units && units[key]) || "µg/L"; // fallback to µg/L
//     const converted = convertToUgPerL(inputVal, selectedUnit);

//     // If conversion failed unexpectedly, set error and abort
//     if (Number.isNaN(converted)) {
//       newErrors[key] = `Could not convert ${key} from unit ${selectedUnit}.`;
//     } else {
//       valuesInUgPerL[displayKey] = converted;
//     }
//   });

//   if (Object.keys(newErrors).length > 0) {
//     setErrors(newErrors);
//     setHmpi(null);
//     return;
//   }

//   const result = manual_calc(valuesInUgPerL);
//   setHmpi(result);
// };

// manualUpload.js
import React, { useState } from "react";
import { permissibleLimitsUgPerL, LODinUgPerL } from "../constants";

/**
 * convertToUgPerL:
 * - returns numeric µg/L
 * - returns NaN for unparsable input (we handle fallback later)
 */
const convertToUgPerL = (value, unit, metalDisplayKey) => {
  const v = Number(value);
  if (Number.isNaN(v)) {
    // fallback to LOD for this metal if available
    const lod = LODinUgPerL?.[metalDisplayKey];
    if (lod !== undefined) return Number(lod);
    return NaN;
  }

  switch (unit) {
    case "ppm": // 1 ppm = 1 mg/L = 1000 µg/L
    case "mg/L":
      return v * 1000;
    case "ppb": // 1 ppb = 1 µg/L
    case "µg/L":
      return v * 1;
    default:
      // unknown unit -> fallback to LOD if possible
      const lodDefault = LODinUgPerL?.[metalDisplayKey];
      if (lodDefault !== undefined) return Number(lodDefault);
      return NaN;
  }
};
/**
 * computeHPI:
 * Qi = ((Si - Ii) / (Mi - Ii)) * 100
 * Wi = 1 / Mi
 *
 * IMPORTANT: If a metal value is missing/NaN, use LODinUgPerL[metal] instead of NaN.
 */
export const computeHPI = (valuesInUgPerL) => {
  let numerator = 0;
  let denominator = 0;

  for (let metal in permissibleLimitsUgPerL) {
    const Li = permissibleLimitsUgPerL[metal]; // permissible limit (Mi)
    // if value missing or NaN, fallback to LOD
    const rawCi = valuesInUgPerL?.[metal];
    const Ci = (rawCi === undefined || Number.isNaN(Number(rawCi)))
      ? (LODinUgPerL[metal] ?? 0)
      : Number(rawCi);

    const Ii = 0; // ideal value for heavy metals

    // Qi = ((Si - Ii) / (Mi - Ii)) * 100
    const Qi = ((Ci - Ii) / (Li - Ii)) * 100;

    // Wi = 1 / Mi
    const Wi = 1 / Li;

    numerator += Wi * Qi;
    denominator += Wi;
  }

  return denominator !== 0 ? Number((numerator / denominator).toFixed(3)) : NaN;
};

// --- 1) Heavy Metal Evaluation Index (HEI) ---
export function computeHEI(valuesInUgPerL) {
  let sum = 0;
  for (const metalKey in permissibleLimitsUgPerL) {
    const Si = permissibleLimitsUgPerL[metalKey];
    const rawCi = valuesInUgPerL?.[metalKey];
    const Ci = (rawCi === undefined || Number.isNaN(Number(rawCi)))
      ? (LODinUgPerL[metalKey] ?? 0)
      : Number(rawCi);

    if (Si > 0) sum += Ci / Si;
  }
  return Number.isFinite(sum) ? Number(sum.toFixed(4)) : NaN;
}

// --- 2) Metal Index (MI) ---
export function computeMI(valuesInUgPerL) {
  let sum = 0;
  for (const metalKey in permissibleLimitsUgPerL) {
    const MAC = permissibleLimitsUgPerL[metalKey];
    const rawCi = valuesInUgPerL?.[metalKey];
    const Ci = (rawCi === undefined || Number.isNaN(Number(rawCi)))
      ? (LODinUgPerL[metalKey] ?? 0)
      : Number(rawCi);

    if (MAC > 0) sum += Ci / MAC;
  }
  return Number.isFinite(sum) ? Number(sum.toFixed(4)) : NaN;
}

// --- 3) Degree of Contamination (Cd) ---
export function computeDegreeOfContamination(valuesInUgPerL) {
  let Cd = 0;
  const perMetalCf = {}; // store individual Cf values

  for (const metalKey in permissibleLimitsUgPerL) {
    const Si = permissibleLimitsUgPerL[metalKey];
    const rawCi = valuesInUgPerL?.[metalKey];
    const Ci = (rawCi === undefined || Number.isNaN(Number(rawCi)))
      ? (LODinUgPerL[metalKey] ?? 0)
      : Number(rawCi);

    const Cf = Si > 0 ? Ci / Si : 0;
    perMetalCf[metalKey] = Number(Cf.toFixed(4));
    Cd += Cf;
  }

  Cd = Number(Cd.toFixed(4));
  return Cd;
}

/**
 * handleManualSubmit:
 * - retains your form validation
 * - when unit conversion returns NaN, we use LODinUgPerL instead of throwing an error
 */
export const handleManualSubmit = (event, formData, setHmpi, setErrors, units) => {
  // NOTE: units must be passed from parent component state (object keyed by metal ids)
  event.preventDefault();

  const newErrors = {};

  // // Sample info validation
  // if (!formData.sampleId.trim()) {
  //   newErrors.sampleId = "Sample ID is required.";
  // }

  // const depth = Number(formData.depth);
  // if (!formData.depth.trim()) {
  //   newErrors.depth = "Depth is required.";
  // } else if (Number.isNaN(depth) || depth <= 0) {
  //   newErrors.depth = "Depth must be a positive number.";
  // }

  const lat = Number(formData.latitude);
  if (!formData.latitude.trim()) {
    newErrors.latitude = "Latitude is required.";
  } else if (Number.isNaN(lat) || lat < -90 || lat > 90) {
    newErrors.latitude = "Latitude must be between -90 and 90.";
  }

  const lng = Number(formData.longitude);
  if (!formData.longitude.trim()) {
    newErrors.longitude = "Longitude is required.";
  } else if (Number.isNaN(lng) || lng < -180 || lng > 180) {
    newErrors.longitude = "Longitude must be between -180 and 180.";
  }

  // Metals config (same as your existing list)
  const metalsConfig = [
    { key: "lead", label: "Lead (Pb)" },
    { key: "cadmium", label: "Cadmium (Cd)" },
    { key: "mercury", label: "Mercury (Hg)" },
    { key: "arsenic", label: "Arsenic (As)" },
    { key: "chromium", label: "Chromium (Cr)" },
    { key: "copper", label: "Copper (Cu)" },
    { key: "zinc", label: "Zinc (Zn)" },
    { key: "nickel", label: "Nickel (Ni)" },
  ];

  metalsConfig.forEach(({ key, label }) => {
    const raw = (formData[key] ?? "").toString();
    const num = Number(raw);

    
  });

  // If any errors, set and stop
  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    setHmpi(null);
    return;
  }

  // Valid: clear errors and calculate
  setErrors({});

  // Map internal id (e.g. "lead") to the permissibleLimits key (e.g. "Lead (Pb)")
  const metalKeyMap = {
    lead: "Lead (Pb)",
    cadmium: "Cadmium (Cd)",
    mercury: "Mercury (Hg)",
    arsenic: "Arsenic (As)",
    chromium: "Chromium (Cr)",
    copper: "Copper (Cu)",
    zinc: "Zinc (Zn)",
    nickel: "Nickel (Ni)",
  };

  // Build values object converted to µg/L
  const valuesInUgPerL = {};
  metalsConfig.forEach(({ key }) => {
    const displayKey = metalKeyMap[key];
    const inputVal = formData[key];
    const selectedUnit = (units && units[key]) || "µg/L"; // fallback to µg/L
    const converted = convertToUgPerL(inputVal, selectedUnit);

    if (Number.isNaN(converted)) {
      // If conversion failed, use LOD instead of NaN
      const lodValue = LODinUgPerL[displayKey];
      valuesInUgPerL[displayKey] = lodValue ?? 0;
      // optional: you can record a warning somewhere or console.log
      console.warn(
        `Value for ${displayKey} could not be parsed; using LOD (${lodValue}) as fallback.`
      );
    } else {
      valuesInUgPerL[displayKey] = converted;
    }
  });

  // Now compute result. You used manual_calc previously — keep using that if defined elsewhere.
  const hpi = computeHPI(valuesInUgPerL);
  const hei = computeHEI(valuesInUgPerL);
  const cd = computeDegreeOfContamination(valuesInUgPerL);
  const mi = computeMI(valuesInUgPerL);
  setHmpi({hpi, hei, cd, mi});
};
