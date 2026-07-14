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
            return ["hi", "hello", "hey", "greetings", "good morning", "good afternoon", "good evening", "yo"].includes(clean) ||
                /^(?:hi|hello|hey|greetings|yo)\s/i.test(clean);
        },
        handle: () => ({
            sender: "bot",
            type: "text",
            text: "Hello! I am your Environmental Mitigation Assistant. Try asking about a specific heavy metal contaminant like Arsenic, Lead, or Cadmium to see recommended treatment strategies and research citations."
        })
    },
    {
        name: "introduction",
        match: (text) => {
            const clean = text.toLowerCase().trim();
            return /^(?:i'm|i am|my name is)\s+(.+)$/i.test(clean);
        },
        handle: (text) => {
            const clean = text.toLowerCase().trim();
            const match = clean.match(/^(?:i'm|i am|my name is)\s+(.+)$/i);
            const name = match ? match[1].trim().split(/\s+/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") : "there";
            return {
                sender: "bot",
                type: "text",
                text: `Hello, ${name}! Nice to meet you. I am your Environmental Mitigation Assistant. Ask me about heavy metal water contaminants (e.g., Lead, Arsenic, Chromium) to get immediate actions, long-term methods, and scientific references.`
            };
        }
    },
    {
        name: "capabilities",
        match: (text) => {
            const clean = text.toLowerCase().trim().replace(/[?.]/g, "");
            return ["help", "what is this", "what can you do", "who are you", "about", "info", "what is this chatbot", "how to use this", "how to use"].includes(clean) ||
                /^(?:what can you do|who are you|how do you work|how to use)/i.test(clean);
        },
        handle: () => ({
            sender: "bot",
            type: "text",
            text: "I am EcoMitigate AI, your Environmental Mitigation and Research Assistant. You can ask me about heavy metal water contaminants (such as Lead, Arsenic, Chromium, Cadmium, Mercury, or Nickel) to get immediate response actions, long-term remediation methods, and verified scientific references."
        })
    },
    {
        name: "thanks",
        match: (text) => {
            const clean = text.toLowerCase().trim().replace(/[!.]/g, "");
            return ["thanks", "thank you", "thank you so much", "perfect", "awesome", "great", "ok", "okay"].includes(clean);
        },
        handle: () => ({
            sender: "bot",
            type: "text",
            text: "You're welcome! Let me know if you have any other questions about heavy metals, water quality, or mitigation methods."
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
            return rule.handle(text);
        }
    }

    return null;
};
