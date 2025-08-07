// components/PortfolioCard.jsx
import React from "react";

export default function PortfolioCard({ name, change }) {
  const isPositive = change >= 0;
  const cardClass = isPositive ? "border-success bg-light" : "border-danger bg-light";
  const textClass = isPositive ? "text-success" : "text-danger";
  const borderStyle = isPositive ? "2px solid #28a745" : "2px solid #dc3545";

  return (
    <div className="p-3 rounded mb-2 d-flex justify-content-between align-items-center" style={{ border: borderStyle, width: "300px" }}>
      <span className="fw-bold">{name}</span>
      <span className={`fw-bold ${textClass}`}>{change > 0 ? "+" : ""}{change}%</span>
    </div>
  );
}
