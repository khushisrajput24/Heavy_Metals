import { useState, useEffect, useRef } from "react";
import { fetchSuggestions } from "../../services/suggestionsService";
import { processMessage } from "./messageProcessor";
import { scrollToBottom } from "./userNavs";
import { RecommendationSection } from "../../components/chatbot/recommendationSection";

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
            
            setMessages((prev) => [
                ...prev,
                {
                    sender: "bot",
                    type: "suggestions",
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

export const renderMessageContent = (msg) => {
    if (msg.type === "text") {
        return <div>{msg.text}</div>;
    }

    if (msg.type === "suggestions") {
        const { immediate_actions, long_term, positive_indicators } = msg.data;

        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 'bold', borderBottom: '1px solid var(--color-border)', paddingBottom: '3px', marginBottom: '4px', textTransform: 'capitalize', color: 'var(--color-primary)' }}>
                    Analysis: {msg.metal}
                </div>

                <RecommendationSection 
                    title="Immediate Actions" 
                    items={immediate_actions} 
                    variant="immediate" 
                />

                <RecommendationSection 
                    title="Long-term Methods" 
                    items={long_term} 
                    variant="longterm" 
                />

                <RecommendationSection 
                    title="Positive Indicators" 
                    items={positive_indicators} 
                    variant="positive" 
                />
            </div>
        );
    }
    return null;
};