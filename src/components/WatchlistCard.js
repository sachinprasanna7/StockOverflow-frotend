import axios from "axios";
import React, { useState, useRef, useEffect } from "react";

function WatchlistCard({ watchlistId, title, stocks, isPositive, refreshData }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [stockList, setStockList] = useState([]);
  const buttonRef = useRef(null);

  useEffect(() => {
    axios.get("http://localhost:8080/api/stock/getStocks")
      .then(res => {
        setStockList(res.data);
        console.log("Stock list fetched:", res.data);
      })
      .catch(err => console.error("Error fetching stock list:", err));
  }, []);
  

  const handleNameClick = (stock) => {
    console.log("Selected Watchlist ID:", watchlistId);
    console.log("Selected Stock ID:", stock.symbol_id);
    var watchlistStockData = {
      watchlistId: parseInt(watchlistId, 10),
      symbolId: parseInt(stock.symbol_id, 10)
    };
    axios.post(`http://localhost:8080/watchlistStocks/add`, watchlistStockData)
      .then(res => {
        console.log("Stock added to watchlist:", res.data);
        setShowDropdown(false);
        setSearchTerm("");
        refreshData(); // Call the function to refresh the watchlist data
      })
      .catch(err => console.error("Error adding stock to watchlist:", err));
  
  };

  const filteredStocks = stockList.filter(stock =>
    stock.companyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`card border-${isPositive ? "success" : "danger"} mb-4 position-relative`}>
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="card-title mb-0 fst-italic">{title}</h5>

        <div style={{ position: "relative" }}>
          <button
            ref={buttonRef}
            className="btn btn-sm btn-outline-secondary"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            +
          </button>

          {showDropdown && (
            <div
              className="position-absolute"
              style={{
                top: "100%",
                right: 0,
                zIndex: 1000,
                width: "220px",
                backgroundColor: "#fff",
                border: "1px solid #ccc",
                boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                padding: "8px",
                borderRadius: "4px"
              }}
            >
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Search company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <ul className="list-group">
                {filteredStocks.length > 0 ? (
                  filteredStocks.map((stock) => (
                    <li
                      key={stock.symbol_id}
                      className="list-group-item list-group-item-action"
                      onClick={() => handleNameClick(stock)}
                      style={{ cursor: "pointer" }}
                    >
                      {stock.companyName}
                    </li>
                  ))
                ) : (
                  <li className="list-group-item text-muted">No matches</li>
                )}
              </ul>
            </div>
          )}
        </div>
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
