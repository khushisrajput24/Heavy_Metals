import { useState, useEffect, useRef } from "react";
import { fetchSuggestions } from "../../services/suggestionsService";
import { processMessage } from "./messageProcessor";
import { scrollToBottom } from "./userNavs";

export const useChatBot = () => {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            sender: "bot",
            type: "text",
            text: "Hello! I am your Environmental Mitigation Assistant. Ask me about heavy metal water contaminants (e.g., Lead, Arsenic, Chromium) to get immediate actions, long-term methods, and scientific references."
        }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [loading, setLoading] = useState(false);

    const messagesEndRef = useRef(null);

    useEffect(() => {
        scrollToBottom(messagesEndRef);
    }, [messages, loading]);

    const handleSend = async (textToSend) => {
        const text = textToSend || inputValue.trim();
        if (!text) return;

        if (!textToSend) {
            setInputValue("");
        }

        // Add user message
        const userMsg = { sender: "user", type: "text", text };
        setMessages((prev) => [...prev, userMsg]);

        // Process message locally first (OCP check for greetings and clear command)
        const localResult = processMessage(text);
        if (localResult) {
            if (localResult.action === "CLEAR_HISTORY") {
                setMessages([
                    {
                        sender: "bot",
                        type: "text",
                        text: localResult.text
                    }
                ]);
            } else {
                setMessages((prev) => [...prev, localResult]);
            }
            return;
        }

        setLoading(true);

        try {
            // Fetch recommendations using the suggestions service (DIP)
            const suggestions = await fetchSuggestions(text);
            
            // Check if response is a structured suggestion list or general conversational text
            const isSuggestions = suggestions.response_type === "suggestions" || 
                                  (!suggestions.response_type && (
                                      (suggestions.immediate_actions && suggestions.immediate_actions.length > 0) || 
                                      (suggestions.long_term && suggestions.long_term.length > 0) || 
                                      (suggestions.positive_indicators && suggestions.positive_indicators.length > 0)
                                  ));

            setMessages((prev) => [
                ...prev,
                {
                    sender: "bot",
                    type: isSuggestions ? "suggestions" : "text",
                    text: suggestions.text || "",
                    data: suggestions,
                    metal: text
                }
            ]);
        } catch (error) {
            console.error("Chatbot query error:", error);
            setMessages((prev) => [
                ...prev,
                {
                    sender: "bot",
                    type: "text",
                    text: "Sorry, I encountered an issue retrieving environmental guidelines for that query. Please make sure the contaminant spelling is correct and the server is running."
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        handleSend();
    };

    return {
        isChatOpen,
        setIsChatOpen,
        messages,
        inputValue,
        setInputValue,
        loading,
        messagesEndRef,
        handleSend,
        handleFormSubmit
    };
};