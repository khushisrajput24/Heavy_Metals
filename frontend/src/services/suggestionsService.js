import axios from "axios";

/**
 * Suggestions Service
 * Handles data fetching for heavy metal water treatment guidelines.
 */

const getBaseUrl = () => {
    return window.location.hostname === "localhost"
        ? "http://127.0.0.1:8000"
        : import.meta.env.VITE_API_URL;
};

/**
 * Fetch suggestions from backend suggestion agent.
 * @param {string} contaminant 
 * @returns {Promise<object>} The suggestions object with actions and citations.
 */
export const fetchSuggestions = async (contaminant) => {
    if (!contaminant) {
        throw new Error("Contaminant parameter is required.");
    }
    
    const baseUrl = getBaseUrl();
    const endpoint = `${baseUrl}/user/analysis/suggestions`;

    try {
        const response = await axios.get(endpoint, {
            params: { contaminant }
        });

        // Ensure returned structure matches our expected shape
        const data = response.data;
        if (data && (data.immediate_actions || data.long_term || data.positive_indicators)) {
            return data;
        }
        
        throw new Error("Suggestions data format is invalid.");
    } catch (error) {
        console.error("SuggestionsService error:", error);
        throw error;
    }
};
