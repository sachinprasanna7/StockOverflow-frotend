import React from "react";

export default function InvestmentSummary() {
  const containerStyle = {
    background: "linear-gradient(135deg, #113F67 0%, #1a5a8a 100%)",
    borderRadius: "16px",
    padding: "32px",
    marginBottom: "24px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
    position: "relative",
    overflow: "hidden"
  };

  const backgroundPattern = {
    position: "absolute",
    top: 0,
    right: 0,
    width: "200px",
    height: "200px",
    background: "radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)",
    backgroundSize: "20px 20px",
    opacity: 0.3
  };

  const statCardStyle = {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(10px)",
    borderRadius: "12px",
    padding: "24px 20px",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    transition: "all 0.3s ease",
    position: "relative",
    minWidth: "200px"
  };

  const labelStyle = {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: "14px",
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginBottom: "8px"
  };

  const valueStyle = {
    color: "white",
    fontSize: "28px",
    fontWeight: "700",
    marginBottom: "4px",
    lineHeight: "1.2"
  };

  const subValueStyle = {
    fontSize: "14px",
    fontWeight: "500",
    marginTop: "4px"
  };

  const positiveStyle = {
    color: "#4ade80"
  };

  const negativeStyle = {
    color: "#ef4444"
  };

  const iconStyle = {
    position: "absolute",
    top: "16px",
    right: "16px",
    fontSize: "20px",
    opacity: 0.6
  };

  return (
<div style={Object.assign({ marginLeft: "250px", padding: "20px" }, containerStyle)}>
<div style={backgroundPattern}></div>

      <div className="mb-4">
        <h3 style={{ color: "white", fontWeight: "600", marginBottom: "8px", fontSize: "24px" }}>
          Portfolio Overview
        </h3>
      </div>

      {/* Stats Cards */}
      <div className="d-flex justify-content-between gap-4">
        {/* Invested Amount */}
        <div 
          style={statCardStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 8px 25px rgba(0, 0, 0, 0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          
          <div style={labelStyle}>Total Invested</div>
          <div style={valueStyle}>$38,143</div>
          <div style={{ ...subValueStyle, color: "rgba(255, 255, 255, 0.6)" }}>
            Principal amount
          </div>
        </div>

        {/* Current Value */}
        <div 
          style={statCardStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 8px 25px rgba(0, 0, 0, 0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          
          <div style={labelStyle}>Current Value</div>
          <div style={valueStyle}>$39,245</div>
          <div style={{ ...subValueStyle, color: "rgba(255, 255, 255, 0.6)" }}>
            Market value
          </div>
        </div>

        {/* Returns */}
        <div 
          style={statCardStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 8px 25px rgba(0, 0, 0, 0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          
          <div style={labelStyle}>Total Returns</div>
          <div style={{ ...valueStyle, ...positiveStyle }}>+$1,102</div>
          <div style={{ ...subValueStyle, ...positiveStyle }}>
            +2.89% ↗️
          </div>
        </div>

        {/* Additional Metric - Day's Change */}
        <div 
          style={statCardStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 8px 25px rgba(0, 0, 0, 0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          
          <div style={labelStyle}>Today's Change</div>
          <div style={{ ...valueStyle, ...positiveStyle }}>+$245</div>
          <div style={{ ...subValueStyle, ...positiveStyle }}>
            +0.63% ↗️
          </div>
        </div>
      </div>

      {/* Bottom indicator */}
      <div className="mt-3 d-flex justify-content-center">
        <div style={{
          height: "4px",
          width: "60px",
          background: "linear-gradient(90deg, #4ade80, #22c55e)",
          borderRadius: "2px",
          opacity: 0.8
        }}></div>
      </div>
    </div>
  );
}