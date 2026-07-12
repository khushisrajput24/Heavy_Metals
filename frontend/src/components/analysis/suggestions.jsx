import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { CircleCheckBig, CircleStar, MonitorCheck, Target, BookOpen } from "lucide-react";

export const Suggestion = () => {
  const { contaminant } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const BASE_URL =
          window.location.hostname === "localhost"
            ? "http://127.0.0.1:8000"
            : import.meta.env.VITE_API_URL;

        const res = await fetch(
          `${BASE_URL}/user/analysis/suggestions?contaminant=${contaminant}`
        );

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Error fetching suggestions:", err);
      }
    };

    if (contaminant) fetchSuggestions();
  }, [contaminant]);

  if (!data)
    return (
      <p className="text-center mt-10 text-gray-500">Loading suggestions...</p>
    );

  // Extract and deduplicate unique citations across all recommendation groups
  const uniqueCitations = Array.from(
    new Map(
      [
        ...(data.immediate_actions || []),
        ...(data.long_term || []),
        ...(data.positive_indicators || [])
      ]
      .flatMap(item => item.citations || [])
      .filter(c => c && c.title)
      .map(c => [c.title.trim().toLowerCase(), c])
    ).values()
  );

  return (
    <div id="suggestions" className="results-section active">
      <h2 className="card-title">
        <CircleStar size={24} strokeWidth={1.8} />
        Expert suggestions for <span className="capitalize">{contaminant}</span>
      </h2>
      <p className="card-subtitle">
        Based on the analysis results, here are our professional suggestions
      </p>

      {/* YELLOW GROUP */}
      <div className="suggestion-group yellow">
        <p className="group-title">
          <Target size={20} strokeWidth={1.8} />
          Immediate Actions Required
        </p>
        <ul>
          {data.immediate_actions.map((item, idx) => (
            <li key={idx}>{item.text}</li>
          ))}
        </ul>
      </div>

      {/* BLUE GROUP */}
      <div className="suggestion-group blue">
        <p className="group-title">
          <MonitorCheck size={20} strokeWidth={1.8} />
          Long-term Monitoring
        </p>
        <ul>
          {data.long_term.map((item, idx) => (
            <li key={idx}>{item.text}</li>
          ))}
        </ul>
      </div>

      {/* GREEN GROUP */}
      <div className="suggestion-group green">
        <h3 className="group-title">
          <CircleCheckBig size={20} strokeWidth={1.8} />
          Positive Indicators
        </h3>
        <ul>
          {data.positive_indicators.map((item, idx) => (
            <li key={idx}>{item.text}</li>
          ))}
        </ul>
      </div>

      {/* UNIFIED REFERENCES SECTION */}
      {uniqueCitations.length > 0 && (
        <div className="suggestion-group blue mt-6">
          <p className="group-title flex items-center gap-2">
            <BookOpen size={20} strokeWidth={1.8} />
            Research References & Scientific Sources
          </p>
          <div className="mt-3 space-y-3">
            {uniqueCitations.map((c, i) => (
              <div key={i} className="p-3 bg-gray-50 border border-gray-100 rounded-lg shadow-sm">
                <p className="font-semibold text-gray-800 text-sm">{c.title}</p>
                {c.doi && <p className="text-xs text-gray-500 mt-1">DOI: {c.doi}</p>}
                {c.url && (
                  <a
                    href={c.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 text-xs font-semibold underline text-blue-600 hover:text-blue-800"
                  >
                    View Paper
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
