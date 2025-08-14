import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // for navigation
import axios from "axios";
import "../styles/StockLists.css"; // custom CSS file

var initialData = {
  gainers: [
    { name: "GOOGLE", symbol: "GOOGL", price: 0, change: "+5.2%", changeValue: "+140.87" },
    { name: "NETFLIX", symbol: "NFLX", price: 0, change: "+4.7%", changeValue: "+29.56" },
    { name: "NVIDIA", symbol: "NVDA", price: 0, change: "+3.9%", changeValue: "+32.87" },
    { name: "APPLE", symbol: "AAPL", price: 0, change: "+2.8%", changeValue: "+5.15" },
  ],
  losers: [
    { name: "GOLDMAN", symbol: "GS", price: 0, change: "-4.2%", changeValue: "-16.94" },
    { name: "JP MORGAN", symbol: "JPM", price: 0, change: "-3.5%", changeValue: "-5.68" },
    { name: "CONNCOPHILPS", symbol: "COP", price: 0, change: "-2.9%", changeValue: "-7.20" },
    { name: "CPGX", symbol: "CPGX", price: 0, change: "-2.1%", changeValue: "-10.38" },
  ],
  trending: [
    { name: "AUTODESK INC", symbol: "ADSK", price: 0, change: "+8.7%", changeValue: "+3.83" },
    { name: "J P Morgan Chase Co", symbol: "JPM", price: 0, change: "+6.2%", changeValue: "+7.29" },
    { name: "SNDK", symbol: "SNDK", price: 0, change: "+5.8%", changeValue: "+14.67" },
    { name: "Western Digital Corporation", symbol: "WDC", price: 0, change: "+4.3%", changeValue: "+6.45" },
  ]
};

function StockCard({ title, stocks, category }) {
  const navigate = useNavigate();

  const getCardStyle = () => {
    switch (category) {
      case "gainers": return "border-success border-2";
      case "losers": return "border-danger border-2";
      case "trending": return "border-warning border-2";
      default: return "border-light";
    }
  };

  const getTitleColor = () => {
    switch (category) {
      case "gainers": return "text-success";
      case "losers": return "text-danger";
      case "trending": return "text-warning";
      default: return "text-dark";
    }
  };

  const getIcon = () => {
    switch (category) {
      case "gainers": return "📈";
      case "losers": return "📉";
      case "trending": return "🔥";
      default: return "📊";
    }
  };

  return (
    <div style={{ width: "100%" }} className={`card h-100 shadow-sm ${getCardStyle()}`}>
      <div className="card-body">
        <div className="d-flex align-items-center mb-3">
          <span className="fs-4 me-2">{getIcon()}</span>
          <h5 className={`card-title mb-0 ${getTitleColor()}`}>{title}</h5>
        </div>

        <p className="card-subtitle text-muted small mb-3">
          {category === "trending"
            ? "Most active stocks right now"
            : "Stocks that moved the most today"}
        </p>

        <div className="list-group list-group-flush w-100 stock-list-container">
          {stocks.map((stock, i) => (
            <div
              key={i}
              className="list-group-item py-3 border-0 border-bottom stock-item"
              style={{ cursor: "pointer" }}
              onClick={() => navigate(`/stock/${stock.symbol}`)} // ✅ Navigate on click
            >
              <div className="d-flex justify-content-between align-items-start">
                <div className="flex-grow-1">
                  <div className="d-flex align-items-center mb-1">
                    <span className="fw-semibold text-dark me-2 stock-name">
                      {stock.name}
                    </span>
                    <span className="badge bg-light text-muted small">
                      {stock.symbol}
                    </span>
                  </div>
                  <div className="small text-muted">
                    {stock.price !== null ? `$${stock.price}` : "Loading..."}
                  </div>
                </div>

                <div className="text-end">
                  <div
                    className={`fw-bold small ${stock.change.startsWith("+") ? "text-success" : "text-danger"
                      }`}
                  >
                    {stock.change}
                  </div>
                  <div
                    className={`small ${stock.changeValue.startsWith("+") ? "text-success" : "text-danger"
                      }`}
                  >
                    {stock.changeValue}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* <div className="text-center mt-3">
          <button className="btn btn-outline-primary btn-sm">
            View All {title.split(" ")[1]}
          </button>
        </div> */}
      </div>
    </div>
  );
}

export default function StockLists() {
  const [stocksData, setStocksData] = useState(initialData);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const updatedData = { ...stocksData };

        for (let category in updatedData) {
          for (let stock of updatedData[category]) {

            const res = await axios.get(`http://localhost:4000/api/currentStockValue/${stock.symbol.toLowerCase()}`);
            console.log((res.data[0].price))

           const newPrice = Array.isArray(res.data)
              ? res.data[0]?.price
              : res.data?.price;

            if (newPrice != null) {
              // Calculate change and changeValue
              if (stock.price && stock.price !== 0) {
                const oldPrice = stock.price;
                const diff = newPrice - oldPrice;
                const percentChange = ((diff / oldPrice) * 100).toFixed(2);

                stock.change = `${diff >= 0 ? "+" : ""}${percentChange}%`;
                stock.changeValue = `${diff >= 0 ? "+" : ""}${diff.toFixed(2)}`;
              }

              // Update price
              stock.price = parseFloat(newPrice.toFixed(2));
            }
          }
        }

        setStocksData(updatedData);
      } catch (err) {
        console.error("Error fetching stock prices:", err);
      }
    };
    console.log("Fetching stock prices...");
    console.log(initialData);
    // First fetch immediately
    fetchPrices();

    // Fetch every 2 seconds
    const intervalId = setInterval(fetchPrices, 3000);

    // Cleanup on unmount
    return () => clearInterval(intervalId);
  },);


  return (
    <div style={{ marginLeft: "250px", padding: "20px" }} className="container-fluid px-0">
      <div className="row g-4 center pe-4">
        <div style={{ width: "28%" }} className="col-md-4">
          <StockCard title="Top Gainers" stocks={stocksData.gainers} category="gainers" />
        </div>
        <div style={{ width: "28%" }} className="col-md-4">
          <StockCard title="Top Losers" stocks={stocksData.losers} category="losers" />
        </div>
        <div style={{ width: "28%" }} className="col-md-4">
          <StockCard title="Trending Now" stocks={stocksData.trending} category="trending" />
        </div>
      </div>
    </div>
  );
}



