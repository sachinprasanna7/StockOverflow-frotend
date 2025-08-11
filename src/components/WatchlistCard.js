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
        
      })
      .catch(err => console.error("Error fetching stock list:", err));
  }, []);

  const handleNameClick = (stock) => {
    const watchlistStockData = {
      watchlistId: parseInt(watchlistId, 10),
      symbolId: stock.symbol_id,
    };
    axios.post(`http://localhost:8080/watchlistStocks/add`, watchlistStockData)
      .then(() => {
        setShowDropdown(false);
        setSearchTerm("");
        refreshData();
      })
      .catch(err => console.error("Error adding stock to watchlist:", err));
  };

  const handleDeleteWatchlist = () => {
    axios.delete(`http://localhost:8080/watchlist/delete/${watchlistId}`)
      .then(() => {
        console.log(`Watchlist ${watchlistId} deleted`);
        refreshData();
      })
      .catch(err => console.error("Error deleting watchlist:", err));
  };

  const handleDeleteStock = (stock) => {
    if (window.confirm("Remove this stock from the watchlist?")) {
      const wlId = parseInt(watchlistId, 10);
      const symbolId = stock.symbol_id;

      if (isNaN(wlId) || isNaN(symbolId)) {
        console.error("Invalid watchlistId or symbol_id, aborting delete");
        return;
      }

      const url = `http://localhost:8080/watchlistStocks/delete/${wlId}/${symbolId}`;
      axios.delete(url)
        .then(() => {
          console.log(`Stock ${symbolId} removed from watchlist ${wlId}`);
          refreshData();
        })
        .catch(err => console.error("Error removing stock:", err));
    }
  };

  const filteredStocks = stockList.filter(stock =>
    stock.companyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`card border-${isPositive ? "success" : "danger"} mb-4 position-relative`}>
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="card-title mb-0 fst-italic">{title}</h5>

        <div className="d-flex gap-2 align-items-center">
          {/* Wrap button and dropdown in relative container */}
          <div className="position-relative">
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
                  top: "110%", // slightly below the button
                  left: 0,
                  zIndex: 1000,
                  width: "220px",
                  backgroundColor: "#fff",
                  border: "1px solid #ccc",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                  padding: "8px",
                  borderRadius: "4px",
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

          {/* Delete watchlist button */}
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={handleDeleteWatchlist}
          >
            -
          </button>
        </div>
      </div>

      <ul className="list-group list-group-flush">
        {stocks.map((stock, index) => (
          <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
            <span className="fst-italic">{stock.name}</span>
            <div className="d-flex gap-2 align-items-center">
              <span className={`fw-semibold text-${isPositive ? "success" : "danger"}`}>
                {stock.change}
              </span>
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => handleDeleteStock(stock)}
              >
                ❌
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default WatchlistCard;
