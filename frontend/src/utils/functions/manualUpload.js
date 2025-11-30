import { permissible_limits } from "../constants";

// HMPI calculation function
const manual_calc = (values) => {
  let numerator = 0;
  let denominator = 0;

  // Iterate over each metal and calculate the HMPI
  for (let metal in permissible_limits) {
    const limit = permissible_limits[metal];
    const Ci = values[metal] || 0; // Concentration entered by the user
    const Li = limit; // Permissible limit
    const Qi = (Ci / Li) * 100; // Quality rating
    const Wi = 1 / Li; // Weight
    numerator += Wi * Qi;
    denominator += Wi;
  }

  // Return the final HMPI value
  return denominator !== 0 ? (numerator / denominator).toFixed(3) : "NaN";
};

export const handleManualSubmit = (event, formData, setHmpi, setErrors) => {
  event.preventDefault();

  const newErrors = {};

  // Sample info
  if (!formData.sampleId.trim()) {
    newErrors.sampleId = "Sample ID is required.";
  }

  const depth = Number(formData.depth);
  if (!formData.depth.trim()) {
    newErrors.depth = "Depth is required.";
  } else if (Number.isNaN(depth) || depth <= 0) {
    newErrors.depth = "Depth must be a positive number.";
  }

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

  // Metals
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
    const raw = formData[key];
    const num = Number(raw);

    if (!raw.trim()) {
      newErrors[key] = `${label} is required.`;
    } else if (Number.isNaN(num) || num < 0) {
      newErrors[key] = `${label} must be a non-negative number.`;
    }
  });

  // If any errors, set and stop
  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    setHmpi(null);
    return;
  }

  // Valid: clear errors and calculate
  setErrors({});

  const values = {
    "Lead (Pb)": Number(formData.lead),
    "Cadmium (Cd)": Number(formData.cadmium),
    "Mercury (Hg)": Number(formData.mercury),
    "Arsenic (As)": Number(formData.arsenic),
    "Chromium (Cr)": Number(formData.chromium),
    "Copper (Cu)": Number(formData.copper),
    "Zinc (Zn)": Number(formData.zinc),
    "Nickel (Ni)": Number(formData.nickel),
  };

  const result = manual_calc(values);
  setHmpi(result);
};
