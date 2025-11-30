import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { CircleCheckBig, CircleStar, MonitorCheck, Target } from "lucide-react";
import { Button } from "../ui/button.jsx";

export const Suggestion = () => {
  const { contaminant } = useParams(); // <-- Get dynamic contaminant from URL
  const [data, setData] = useState(null);
  const [expandedGroups, setExpandedGroups] = useState({
    yellow: false,
    blue: false,
    green: false,
  });

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

        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Error fetching suggestions:", err);
      }
    };

    if (contaminant) fetchSuggestions();
  }, [contaminant]);

  const expandExplain = (group) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [group]: !prev[group],
    }));
  };

  if (!data)
    return (
      <p className="text-center mt-10 text-gray-500">Loading suggestions...</p>
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

        <Button
          type="support"
          colorVariant="secondary"
          onClickHandler={() => expandExplain("yellow")}
        >
          {expandedGroups.yellow ? "Read Less" : "Read More"}
        </Button>

        {expandedGroups.yellow && (
          <div className="explanation-text">
            <h4 className="font-semibold">Research References:</h4>

            {data.immediate_actions.map((item, idx) => (
              <div key={idx} className="mt-3">
                {item.citations.length === 0 && (
                  <p className="text-sm text-gray-500">
                    No research references available.
                  </p>
                )}

                {item.citations.map((c, i) => (
                  <div key={i} className="mt-2">
                    <p className="font-medium">{c.title}</p>
                    {c.doi && <p className="text-sm">DOI: {c.doi}</p>}
                    <a
                      href={c.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline link text-blue-600"
                    >
                      View Paper
                    </a>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
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

        <Button
          type="support"
          colorVariant="secondary"
          onClickHandler={() => expandExplain("blue")}
        >
          {expandedGroups.blue ? "Read Less" : "Read More"}
        </Button>

        {expandedGroups.blue && (
          <div className="explanation-text">
            <h4 className="font-semibold">Research References:</h4>

            {data.long_term.map((item, idx) => (
              <div key={idx} className="mt-3">
                {item.citations.length === 0 && (
                  <p className="text-sm text-gray-500">
                    No research references available.
                  </p>
                )}

                {item.citations.map((c, i) => (
                  <div key={i} className="mt-2">
                    <p className="font-medium">{c.title}</p>
                    {c.doi && <p className="text-sm">DOI: {c.doi}</p>}
                    <a
                      href={c.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline link text-blue-600"
                    >
                      View Paper
                    </a>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
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

        <Button
          type="support"
          colorVariant="secondary"
          onClickHandler={() => expandExplain("green")}
        >
          {expandedGroups.green ? "Read Less" : "Read More"}
        </Button>

        {expandedGroups.green && (
          <div className="explanation-text">
            <h4 className="font-semibold">Research References:</h4>

            {data.positive_indicators.map((item, idx) => (
              <div key={idx} className="mt-3">
                {item.citations.length === 0 && (
                  <p className="text-sm text-gray-500">
                    No references for this section.
                  </p>
                )}

                {item.citations.map((c, i) => (
                  <div key={i} className="mt-2">
                    <p className="font-medium">{c.title}</p>
                    {c.doi && <p className="text-sm">DOI: {c.doi}</p>}
                    <a
                      href={c.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline link text-blue-600"
                    >
                      View Paper
                    </a>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
