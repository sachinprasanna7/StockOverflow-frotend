import React from "react";

export default function Header() {
  return (
    <div>
      <div className="d-flex justify-content-between text-center mb-3">
        {["NASDAQ", "Dow Jones", "Russell 2000", "S&P 500", "S&P 500 Financial", "S&P 500 Energy"].map((name, i) => (
          <div key={i} className="border p-2 flex-fill mx-1">
            <div>24841</div>
            <small>{name}</small>
          </div>
        ))}
      </div>
      <h2 className="text-center mb-4"><em>Hello, Santhosh Kumar!</em></h2>
    </div>
  );
}
