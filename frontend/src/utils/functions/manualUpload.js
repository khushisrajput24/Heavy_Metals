import { permissible_limits } from "../constants";

// The HMPI calculation function
export const manual_calc = (values) => {
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
