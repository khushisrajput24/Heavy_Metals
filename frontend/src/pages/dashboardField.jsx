import { useState } from "react";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";

export const DashboardField = () => {
  const navigate = useNavigate();

  // Track claim status
  const [overviewClaimed, setOverviewClaimed] = useState(false);
  const [upcomingClaimed, setUpcomingClaimed] = useState(false);

  // ---------------- MOCK HARD-CODED DATA ----------------
  const fieldOverviewTasks = [
    "Review historical groundwater heavy metal datasets to understand baseline concentration levels for Cd, Pb, As, Cr, Ni.",
    "Conduct validation visits for sites showing abnormal HMPI/HEI values.",
    "Document hydrogeological features like aquifer depth & recharge zones.",
    "Cross-check laboratory heavy metal values with field metadata.",
    "Prepare research notes correlating heavy metal spikes with pollution sources.",
  ];

  const upcomingTasks = [
    "Revisit high-risk borewell locations flagged by HMPI scoring.",
    "Collect duplicate groundwater samples for cross-lab validation.",
    "Perform on-site pH, EC, turbidity tests for solubility studies.",
    "Record rainfall, temperature & soil moisture to study correlations.",
    "Prepare a field investigation memo summarizing contamination pathways.",
  ];

  // ---------------- NAVIGATION HANDLER ----------------
  const goToInputPage = () => {
    navigate("/field_work/input_data"); // <-- FINAL ROUTE AS YOU ASKED
  };

  return (
    <div>
      <div className="main-header-wrapper">
        <div className="main-header">Demands of the Organization</div>
        <div className="main-text">
          This dashboard provides an overview of groundwater heavy metal
          investigation tasks. After claiming a task, proceed to enter field
          research data directly.
        </div>
      </div>

      {/* ---------------- Field Overview Card ---------------- */}
      <div className="card">
        <div className="card-title">Field Work Overview</div>
        <div className="card-content">
          <ul className="list-disc list-inside">
            {fieldOverviewTasks.map((task, index) => (
              <li key={index}>{task}</li>
            ))}
          </ul>

          {/* BEFORE CLAIM */}
          {!overviewClaimed && (
            <Button
              type="main"
              colorVariant="primary"
              onClickHandler={() => setOverviewClaimed(true)}
            >
              Claim
            </Button>
          )}

          {/* AFTER CLAIM */}
          {overviewClaimed && (
            <Button
              type="main"
              colorVariant="secondary"
              onClickHandler={goToInputPage}
            >
              Enter Data
            </Button>
          )}
        </div>
      </div>

      {/* ---------------- Upcoming Tasks Card ---------------- */}
      <div className="card">
        <div className="card-title">Upcoming Field Tasks</div>
        <div className="card-content">
          <ul className="list-disc list-inside">
            {upcomingTasks.map((task, index) => (
              <li key={index}>{task}</li>
            ))}
          </ul>

          {/* BEFORE CLAIM */}
          {!upcomingClaimed && (
            <Button
              type="main"
              colorVariant="primary"
              onClickHandler={() => setUpcomingClaimed(true)}
            >
              Claim
            </Button>
          )}

          {/* AFTER CLAIM */}
          {upcomingClaimed && (
            <Button
              type="main"
              colorVariant="secondary"
              onClickHandler={goToInputPage}
            >
              Enter Data
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
