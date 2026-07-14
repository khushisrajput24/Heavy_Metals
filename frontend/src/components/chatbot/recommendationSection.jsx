import React from "react";

/**
 * RecommendationSection component
 * Responsible purely for rendering a styled list of environmental recommendations
 * and academic paper citation hyperlinks.
 * Adheres to SRP (Single Responsibility Principle) by isolating recommendation layout formatting.
 */
export const RecommendationSection = ({ title, items, variant }) => {
    if (!items || items.length === 0) return null;

    const titleClassMap = {
        immediate: "title-immediate",
        longterm: "title-longterm",
        positive: "title-positive"
    };

    const titleClass = titleClassMap[variant] || "";

    return (
        <div className="bot-recommendation-section">
            <div className={`recommendation-title ${titleClass}`}>
                {title}
            </div>
            <ul className="recommendation-list">
                {items.map((item, idx) => (
                    <li key={idx} className="recommendation-item">
                        {item.text}
                        {item.citations && item.citations.length > 0 && (
                            <span className="citation-links">
                                {item.citations.map((cite, cIdx) => (
                                    <a
                                        key={cIdx}
                                        href={cite.url || "#"}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="citation-link"
                                        title={cite.title || "Academic Source"}
                                    >
                                        [Ref {cIdx + 1}]
                                    </a>
                                ))}
                            </span>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};
