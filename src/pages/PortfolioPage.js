// components/PortfolioPage.jsx
import React from "react";
import Sidebar from "../components/Sidebar";
import PortfolioCard from "../components/PortfolioCard";
import PortfolioSummary from "../components/PortfolioSummary";

export default function PortfolioPage() {
  const investedAmount = 2334343;
  const currentValue = 2334343;

  const holdings = [
    { name: "ABC", change: 5.2 },
    { name: "ABC", change: 5.2 },
    { name: "ABC", change: 5.2 },
    { name: "ABC", change: 5.2 },
  ];

  const losses = [
    { name: "ABC", change: -5.2 },
    { name: "ABC", change: -5.2 },
    { name: "ABC", change: -5.2 },
    { name: "ABC", change: -5.2 },
  ];

  return (
    // components/PortfolioPage.jsx (partial)
<div className="d-flex">
  <Sidebar />
  <div className="flex-grow-1 bg-light p-4" style={{ marginLeft: '20%' }}>
    <PortfolioSummary invested={investedAmount} current={currentValue} />
    <div className="d-flex justify-content-center gap-5 flex-wrap">
      <div>
        {holdings.map((stock, index) => (
          <PortfolioCard key={index} {...stock} />
        ))}
      </div>
      <div>
        {losses.map((stock, index) => (
          <PortfolioCard key={index} {...stock} />
        ))}
      </div>
    </div>
  </div>
</div>

  );
}
