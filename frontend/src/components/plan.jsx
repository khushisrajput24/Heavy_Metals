import React from "react";
import { PricingTable } from "@clerk/clerk-react";

const Plan = () => {
  return (
    <div
      style={{
        maxWidth: "1100px",
        margin: "0 auto",
        paddingTop: "60px",
        zIndex: 20,
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center" }}>
        <h2
          style={{
            color: "#334155",
            fontSize: "42px",
            fontWeight: "600",
            marginBottom: "10px",
          }}
        >
          Choose Your Plan
        </h2>

        <p
          style={{
            color: "#6b7280",
            maxWidth: "480px",
            margin: "0 auto",
          }}
        >
          Start for free and scale up as you grow. Find the perfect plan for your
          content creation needs.
        </p>
      </div>

      {/* Vertical Layout */}
      <div
        style={{
          display: "flex",
          flexDirection: "column", // vertical stack
          gap: "30px",
          marginTop: "50px",
          overflow: "hidden", // ensures no scrollbars
        }}
      >
        {/* Each Pricing card rendered manually instead of grid */}
      
   
        <div
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            padding: "24px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
          }}
        >
          <PricingTable plan="enterprise" />
        </div>
      </div>
    </div>
  );
};

export default Plan;
