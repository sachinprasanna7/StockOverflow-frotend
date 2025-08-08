// components/PortfolioSummary.jsx
import React from "react";

export default function PortfolioSummary({ invested, current }) {
  return (
    <div className="text-center mb-4">
      <h2 className="fw-bold">Portfolio</h2>
      <div className="d-flex justify-content-center gap-5 mt-3">
        <div>
          <div className="text-secondary">Invested Amount</div>
          <div className="fs-4 fw-bold">{invested.toLocaleString()}</div>
        </div>
        <div>
          <div className="text-secondary">Current value</div>
          <div className="fs-4 fw-bold">{current.toLocaleString()}</div>
        </div>
      </div>
      <h5 className="mt-4">Current Holdings</h5>
    </div>
  );
}
