import React from "react";

export default function InvestmentSummary() {
  return (
    <div className="bg-success bg-opacity-25 rounded p-3 d-flex justify-content-around mb-4 text-center">
      <div>
        <h4>Invested</h4>
        <h5>$38143</h5>
      </div>
      <div>
        <h4>Current</h4>
        <h5>$39245</h5>
      </div>
      <div>
        <h4>Returns</h4>
        <h5>+$1102 (2%)</h5>
      </div>
    </div>
  );
}
