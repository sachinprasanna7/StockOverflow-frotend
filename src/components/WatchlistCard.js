import React from "react";

function WatchlistCard({ title, stocks, isPositive }) {
  return (
    <div className={`card border-${isPositive ? "success" : "danger"} mb-4`}>
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="card-title mb-0 fst-italic">{title}</h5>
        <button className="btn btn-sm btn-outline-secondary">+</button>
      </div>
      <ul className="list-group list-group-flush">
        {stocks.map((stock, index) => (
          <li key={index} className="list-group-item d-flex justify-content-between">
            <span className="fst-italic">{stock.name}</span>
            <span className={`fw-semibold text-${isPositive ? "success" : "danger"}`}>
              {stock.change}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default WatchlistCard;
