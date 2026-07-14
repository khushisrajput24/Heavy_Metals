import { SendHorizonal, X, MessageSquare } from "lucide-react";
import { useChatBot } from "../../utils/functions/chatbot.js";
import { metals } from "../../utils/constants";
import { RecommendationSection } from "./recommendationSection";

const renderMessageContent = (msg) => {
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


export const ChatBot = () => {
    const {
        isChatOpen,
        setIsChatOpen,
        messages,
        inputValue,
        setInputValue,
        loading,
        messagesEndRef,
        handleSend,
        handleFormSubmit
    } = useChatBot();

    const quickChips = metals;
    return (
        <div className="chatbot">
            {isChatOpen ? (
                <div className="chatbot-window">
                    <div className="chatbot-window-header">
                        <div className="chatbot-header-info">
                            <h3>EcoMitigate AI</h3>
                            <p>Mitigation & Research Assistant</p>
                        </div>
                        <button className="chatbot-close-btn" onClick={() => setIsChatOpen(false)}>
                            <X size={18} />
                        </button>
                    </div>

                    <div className="chatbot-window-body">
                        <div className="chatbot-messages-container">
                            {messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`chatbot-msg-bubble ${msg.sender === "user" ? "chatbot-msg-user" : "chatbot-msg-bot"
                                        }`}
                                >
                                    {renderMessageContent(msg)}
                                </div>
                            ))}

                            {loading && (
                                <div className="chatbot-msg-bubble chatbot-msg-bot">
                                    <div className="typing-indicator">
                                        <span className="typing-dot"></span>
                                        <span className="typing-dot"></span>
                                        <span className="typing-dot"></span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="chatbot-chips-container">
                            {quickChips.map((chip) => (
                                <button
                                    key={chip}
                                    className="chatbot-chip"
                                    onClick={() => handleSend(chip)}
                                    disabled={loading}
                                >
                                    {chip}
                                </button>
                            ))}
                        </div>
                    </div>

                    <form onSubmit={handleFormSubmit} className="chatbot-input-form">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder={loading ? "Generating response..." : "Ask about a contaminant..."}
                            className="chatbot-input-field"
                            disabled={loading}
                        />
                        <button
                            type="submit"
                            className="chatbot-send-btn"
                            disabled={loading || !inputValue.trim()}
                        >
                            <SendHorizonal size={16} />
                        </button>
                    </form>
                </div>
            ) : (
                <button className="chatbot-trigger-btn" onClick={() => setIsChatOpen(true)}>
                    <MessageSquare size={24} />
                </button>
            )}
        </div>
    );
};