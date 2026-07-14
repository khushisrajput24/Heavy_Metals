/**
 * Message Processor
 * Handles local client-side commands and greetings to avoid unnecessary backend requests.
 * Conforms to Open/Closed Principle (OCP) through a rule-based matching system.
 */

const rules = [
    {
        name: "greetings",
        match: (text) => {
            const clean = text.toLowerCase().trim();
            return ["hi", "hello", "hey", "greetings", "good morning", "good afternoon", "good evening"].includes(clean);
        },
        handle: () => ({
            sender: "bot",
            type: "text",
            text: "Hello! I am your Environmental Mitigation Assistant. Try asking about a specific heavy metal contaminant like Arsenic, Lead, or Cadmium to see recommended treatment strategies and research citations."
        })
    },
    {
        name: "clearChat",
        match: (text) => text.toLowerCase().trim() === "clear",
        handle: () => ({
            sender: "bot",
            type: "text",
            text: "Chat history cleared. Ask me about heavy metal water contaminants (e.g., Lead, Arsenic, Chromium) to get immediate actions, long-term methods, and scientific references.",
            action: "CLEAR_HISTORY"
        })
    }
];

/**
 * Process user input against client-side rules.
 * @param {string} text 
 * @returns {object|null} The matched bot message or clear action, or null if it requires backend querying.
 */
export const processMessage = (text) => {
    if (!text) return null;
    
    for (const rule of rules) {
        if (rule.match(text)) {
            return rule.handle();
        }
    }
    
    return null;
};
