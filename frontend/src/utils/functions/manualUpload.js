

const toInternalKey = (displayName) =>
  displayName.replace(/\(.*?\)/g, "").replace(/[^a-zA-Z]/g, "").toLowerCase();

/* Convert unit -> µg/L. Blank/invalid => 0 */
export const convertToUgPerL = (value, unit) => {
  const v = Number(value);
  if (Number.isNaN(v)) return 0;
  switch (unit) {
    case "ppm":
    case "mg/L":
      return v * 1000;
    case "ppb":
    case "µg/L":
      return v;
    default:
      return 0;
  }
};

/* Compute HPI using dynamic limits object (limits keyed by displayName) */
export const computeHPI = (valuesInUgPerL = {}, limits = {}) => {
  let numerator = 0,
    denominator = 0;

  for (const displayName of Object.keys(limits)) {
    const Mi = Number(limits[displayName]?.permissible ?? 0);
    if (!(Mi > 0)) continue;
    const Ci = Number(valuesInUgPerL[displayName]) || 0;
    const Qi = (Ci / Mi) * 100; // sub-index
    const Wi = 1 / Mi;
    numerator += Wi * Qi;
    denominator += Wi;
  }

  return denominator ? Number((numerator / denominator).toFixed(3)) : NaN;
};

export const computeHEI = (valuesInUgPerL = {}, limits = {}) => {
  let sum = 0;
  for (const displayName of Object.keys(limits)) {
    const Mi = Number(limits[displayName]?.permissible ?? 0);
    if (!(Mi > 0)) continue;
    const Ci = Number(valuesInUgPerL[displayName]) || 0;
    sum += Ci / Mi;
  }
  return Number(sum.toFixed(4));
};

export const computeMI = (valuesInUgPerL = {}, limits = {}) => computeHEI(valuesInUgPerL, limits);

export const computeDegreeOfContamination = (valuesInUgPerL = {}, limits = {}) => {
  let Cd = 0;
  const perMetalCf = {};

  for (const displayName of Object.keys(limits)) {
    const Si = Number(limits[displayName]?.permissible ?? 0);
    const Ci = Number(valuesInUgPerL[displayName]) || 0;
    const Cf = Si > 0 ? Ci / Si : 0;
    perMetalCf[displayName] = Number(Cf.toFixed(4));
    Cd += Cf;
  }

  return { Cd: Number(Cd.toFixed(4)), perMetalCf };
};

/**
 * handleManualSubmit:
 * - event (optional)
 * - formData: object keyed by internal keys (e.g. { lead: "12", cadmium: "0.2", latitude: "12.3" })
 * - setHmpi: setter (receives result object)
 * - setErrors: setter for validation errors
 * - units: object keyed by internal keys (e.g. { lead: 'µg/L' })
 * - limits: dynamic limits object keyed by displayName (source of truth)
 *
 * result passed to setHmpi:
 * { hpi, hei, mi, Cd, perMetalCf, perMetalStatus, valuesInUgPerL }
 */
export const handleManualSubmit = (event, formData, setHmpi, setErrors, units = {}, limits = {}) => {
  if (event && typeof event.preventDefault === "function") event.preventDefault();

  const newErrors = {};

  // Validate latitude/longitude
  const latRaw = (formData.latitude ?? "").toString().trim();
  const lngRaw = (formData.longitude ?? "").toString().trim();
  const lat = latRaw === "" ? NaN : Number(latRaw);
  const lng = lngRaw === "" ? NaN : Number(lngRaw);

  if (latRaw === "") {
    newErrors.latitude = "Latitude is required.";
  } else if (Number.isNaN(lat) || lat < -90 || lat > 90) {
    newErrors.latitude = "Latitude must be a number between -90 and 90.";
  }

  if (lngRaw === "") {
    newErrors.longitude = "Longitude is required.";
  } else if (Number.isNaN(lng) || lng < -180 || lng > 180) {
    newErrors.longitude = "Longitude must be a number between -180 and 180.";
  }

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    setHmpi(null);
    return;
  }

  setErrors({});

  // Build valuesInUgPerL using current limits keys (so new metals included)
  const valuesInUgPerL = {};
  for (const displayName of Object.keys(limits)) {
    const internalKey = toInternalKey(displayName);
    const rawInput = formData[internalKey];
    const unitForThis = (units && units[internalKey]) || "µg/L";
    const converted = convertToUgPerL(rawInput ?? "", unitForThis);
    valuesInUgPerL[displayName] = Number(converted) || 0;
  }

  // compute indices
  const hpi = computeHPI(valuesInUgPerL, limits);
  const hei = computeHEI(valuesInUgPerL, limits);
  const mi = computeMI(valuesInUgPerL, limits);
  const { Cd, perMetalCf } = computeDegreeOfContamination(valuesInUgPerL, limits);

  // per-metal status using acceptable limits
  const perMetalStatus = {};
  for (const displayName of Object.keys(limits)) {
    const val = Number(valuesInUgPerL[displayName]) || 0;
    const acceptable = limits[displayName]?.acceptable;
    perMetalStatus[displayName] =
      acceptable === null || acceptable === undefined ? "no-std" : (val <= Number(acceptable) ? "within-acceptable" : "exceeds-acceptable");
  }

  const result = {
    hpi,
    hei,
    mi,
    Cd,
    perMetalCf,
    perMetalStatus,
    valuesInUgPerL,
  };

  setHmpi(result);
};
