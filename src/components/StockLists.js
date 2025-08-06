import React from "react";
import { Card } from "react-bootstrap";

const data = {
  gainers: [
    { name: "GOOGLE", change: "+5.2%" },
    { name: "NETFLIX", change: "+4.7%" },
    { name: "CAMS", change: "+3.9%" },
  ],
  losers: [
    { name: "GOLDMAN", change: "-4.2%" },
    { name: "JPMC", change: "-3.5%" },
    { name: "SAMSUNG", change: "-2.9%" },
  ],
  midcap: [
    { name: "XYZ1", change: "+6.1%" },
    { name: "XYZ2", change: "+5.5%" },
    { name: "XYZ3", change: "+5.0%" },
  ]
};

function StockCard({ title, stocks }) {
  return (
    <Card className="flex-fill me-3">
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Subtitle className="mb-3 text-muted">Stocks that changed the most this period</Card.Subtitle>
        {stocks.map((stock, i) => (
          <div key={i} className="d-flex justify-content-between align-items-center border-bottom py-2">
            <div className="d-flex align-items-center">
              <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2" style={{ width: 30, height: 30 }}>
                A
              </div>
              {stock.name}
            </div>
            <span>{stock.change}</span>
          </div>
        ))}
        <div className="text-end mt-2">
          <a href="#">View More</a>
        </div>
      </Card.Body>
    </Card>
  );
}

export default function StockLists() {
  return (
    <div className="d-flex">
      <StockCard title="Top Gainers" stocks={data.gainers} />
      <StockCard title="Top Losers" stocks={data.losers} />
      <StockCard title="Top Midcap" stocks={data.midcap} />
    </div>
  );
}
