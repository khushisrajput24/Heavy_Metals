import { useState } from "react";
import { CircleCheckBig, CircleStar, MonitorCheck, Target } from "lucide-react";
import { Button } from "../ui/button.jsx";

export const Suggestion = () => {
  const [expandedGroups, setExpandedGroups] = useState({
    yellow: false,
    blue: false,
    green: false,
  });

  const expandExplain = (group) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [group]: !prev[group],
    }));
  };

  return (
    <div id="suggestions" className="results-section active">
      <h2 className="card-title">
        <CircleStar
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          size={24}
          strokeWidth={1.8}
        />
        Expert suggestions
      </h2>
      <p className="card-subtitle">
        Based on the analysis results, here are our professional suggestions
      </p>

      {/* Suggestion Group: Yellow */}
      <div className="suggestion-group yellow">
        <p className="group-title">
          <Target
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            size={20}
            strokeWidth={1.8}
          />
          Immediate Actions Required
        </p>
        <ul>
          <li>
            Implement additional monitoring for Arsenic and Chromium levels
          </li>
          <li>Consider alternative water sources for consumption</li>
          <li>Install appropriate water treatment systems</li>
        </ul>
        <div>
          <Button
            type="support"
            colorVariant="secondary"
            onClickHandler={() => expandExplain("yellow")}
          >
            {expandedGroups.yellow ? "Read Less" : "Read More"}
          </Button>
          {expandedGroups.yellow && (
            <p className="explanation-text">
              A practical and effective way to make the water safe is to install
              an iron-based water treatment system. In this method, iron is
              added to the water, where it helps remove both Arsenic and
              Chromium. The iron reacts with these harmful metals, changing
              Chromium into a safer form and trapping Arsenic on iron particles,
              which can then be filtered out. This process works well at normal
              water pH levels, is affordable, and doesn’t require complicated
              equipment. It’s suitable for community water systems and can
              quickly reduce contamination to safe levels for drinking.
              <br />
              <br />
              Install an iron-based redox-assisted coagulation treatment system
              for removing both Arsenic (As) and Chromium (Cr) from the water
              supply. This method uses ferrous iron (Fe²⁺), which reduces toxic
              Chromium (Cr⁶⁺) to the less harmful Cr³⁺ form, and simultaneously
              generates iron hydroxides that effectively adsorb Arsenic (As⁵⁺)
              from the water. Operating at a neutral pH (around 7), this process
              can lower both contaminants to below safe drinking water limits
              with minimal chemical input. It’s cost-effective, suitable for
              community-scale treatment plants, and doesn’t require complex
              infrastructure — making it an ideal choice for areas facing dual
              contamination.
              <br />
              <a
                href="https://doi.org/10.3390/su12135394 "
                target="_blank"
                rel="noopener noreferrer"
                className="underline link"
              >
                <p>
                  <br />
                  Reference Source
                </p>
              </a>
            </p>
          )}
        </div>
      </div>

      {/* Suggestion Group: Blue */}
      <div className="suggestion-group blue">
        <p className="group-title">
          <MonitorCheck
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            size={20}
            strokeWidth={1.8}
          />
          Long-term Monitoring
        </p>
        <ul>
          <li>Schedule quarterly re-testing of this location</li>
          <li>Monitor nearby wells for similar contamination patterns</li>
          <li>Investigate potential contamination sources in the area</li>
        </ul>
        <div>
          <Button
            type="support"
            colorVariant="secondary"
            onClickHandler={() => expandExplain("blue")}
          >
            {expandedGroups.blue ? "Read Less" : "Read More"}
          </Button>
          {expandedGroups.blue && (
            <p className="explanation-text">
              Long-term monitoring explanation. Outline goals and resources.
            </p>
          )}
        </div>
      </div>

      {/* Suggestion Group: Green */}
      <div className="suggestion-group green">
        <h3 className="group-title">
          <CircleCheckBig
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            size={20}
            strokeWidth={1.8}
          />
          Positive Indicators
        </h3>
        <ul>
          <li>Lead, Cadmium, and Mercury levels are within safe ranges</li>
          <li>Overall HMPI indicates manageable contamination level</li>
          <li>No immediate health emergency detected</li>
        </ul>
        <div>
          <Button
            type="support"
            colorVariant="secondary"
            onClickHandler={() => expandExplain("green")}
          >
            {expandedGroups.green ? "Read Less" : "Read More"}
          </Button>
          {expandedGroups.green && (
            <p className="explanation-text">
              Positive outcome explanation can go here for context or praise.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
