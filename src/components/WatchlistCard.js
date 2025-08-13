import axios from "axios";
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
function getPeriodFromTime() {
  const now = new Date();
  

  now.setHours(now.getHours() - 5);
  now.setMinutes(now.getMinutes() - 30);
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  const totalSeconds = (hours * 3600) + (minutes * 60) + seconds;
  const period = Math.floor(totalSeconds / 20) + 1;
  return period;
}

function WatchlistCard({ watchlistId, title, stocks, isPositive, refreshData }) {
  const navigate = useNavigate();
  const [dropdownAlignRight, setDropdownAlignRight] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [stockList, setStockList] = useState([]);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [currentPrices, setCurrentPrices] = useState({});
  const [periodChanges, setPeriodChanges] = useState({});
  const [periodStartPrices, setPeriodStartPrices] = useState({});
  const [loadingPrices, setLoadingPrices] = useState(false);
  const currentPeriodRef = useRef(-1);
  const buttonRef = useRef(null);

  // Fetch stock list for dropdown
  useEffect(() => {
    axios.get("http://localhost:8080/api/stock/getStocks")
      .then(res => {
        setStockList(res.data);
      })
      .catch(err => console.error("Error fetching stock list:", err));
  }, []);

  // Fetch current prices and calculate period changes
  const fetchStockPrices = async () => {
    if (stocks.length === 0) return;
    
    setLoadingPrices(true);
    try {
      const symbols = stocks.map(stock => stock.symbol).filter(Boolean);
      
      if (symbols.length === 0) return;

      const priceFetches = symbols.map(async symbol => {
        try {
          const res = await fetch(`http://localhost:4000/api/currentStockValue/${symbol}`);
          if (!res.ok) {
            console.error(`Failed to fetch price for ${symbol}: ${res.status}`);
            return { symbol, price: 0, periodNumber: null };
          }
          const data = await res.json();
          return {
            symbol,
            price: data?.[0]?.price ?? 0,
            periodNumber: data?.[0]?.periodNumber ?? null
          };
        } catch (err) {
          console.error(`Error fetching price for ${symbol}:`, err);
          return { symbol, price: 0, periodNumber: null };
        }
      });

      const pricesArray = await Promise.all(priceFetches);
      
      const priceMap = {};
      pricesArray.forEach(({ symbol, price }) => {
        priceMap[symbol] = price;
      });

      setCurrentPrices(priceMap);

      // Get the current period and handle period changes
      const runningPeriod = getPeriodFromTime();

      if (currentPeriodRef.current === -1 || currentPeriodRef.current < runningPeriod) {
        // New period started, save current prices as period start prices
        setPeriodStartPrices(prev => ({
          ...prev,
          ...priceMap
        }));
        currentPeriodRef.current = runningPeriod;
      }

      // Calculate period changes
      const changes = {};
      Object.keys(priceMap).forEach(symbol => {
        const currentPrice = priceMap[symbol];
        const startPrice = periodStartPrices[symbol] || currentPrice;
        const change = startPrice > 0 ? ((currentPrice - startPrice) / startPrice) * 100 : 0;
        changes[symbol] = change.toFixed(2);
      });

      setPeriodChanges(changes);

    } catch (err) {
      console.error("Error fetching stock prices:", err);
    } finally {
      setLoadingPrices(false);
    }
  };

  // Fetch prices on component mount and when stocks change
  useEffect(() => {
    fetchStockPrices();
  }, [stocks]);

  // Set up automatic price updates every 3 seconds (matching your portfolio component)
  useEffect(() => {
    if (stocks.length === 0) return;

    const interval = setInterval(() => {
      fetchStockPrices();
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, [stocks, periodStartPrices]);

  // Adjust dropdown alignment to keep it in viewport
  useEffect(() => {
    if (showDropdown && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const dropdownWidth = 280;
      const spaceRight = window.innerWidth - buttonRect.left;
      setDropdownAlignRight(spaceRight < dropdownWidth);
    }
  }, [showDropdown]);

  const handleNameClick = (stock) => {
    setLoadingAdd(true);
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
      .catch(err => console.error("Error adding stock to watchlist:", err))
      .finally(() => setLoadingAdd(false));
  };

  const handleDeleteWatchlist = () => {
    if (window.confirm(`Are you sure you want to delete the "${title}" watchlist? This action cannot be undone.`)) {
      setLoadingDelete(true);
      axios.delete(`http://localhost:8080/watchlist/delete/${watchlistId}`)
        .then(() => {
          console.log(`Watchlist ${watchlistId} deleted`);
          refreshData();
        })
        .catch(err => console.error("Error deleting watchlist:", err))
        .finally(() => setLoadingDelete(false));
    }
  };

  const handleDeleteStock = (stock) => {
    if (window.confirm(`Remove ${stock.name} from this watchlist?`)) {
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

  // Calculate total change percentage using period changes
  const totalChange = stocks.reduce((sum, stock) => {
    const change = parseFloat(periodChanges[stock.symbol]) || 0;
    return sum + change;
  }, 0);

  const averageChange = stocks.length > 0 ? (totalChange / stocks.length).toFixed(2) : "0.00";
  const handleStockClick = (symbol) => {
    
    navigate(`/stock/${symbol.toLowerCase()}`);
  };
  return (
    <div
      className="card h-100 position-relative"
      style={{
        border: "1px solid rgba(17, 63, 103, 0.15)",
        borderRadius: "16px",
        boxShadow: "0 4px 16px rgba(17, 63, 103, 0.08)",
        transition: "all 0.3s ease",
        backgroundColor: "white",
        overflow: "hidden"
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 8px 24px rgba(17, 63, 103, 0.15)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 16px rgba(17, 63, 103, 0.08)";
      }}
    >
      {/* Header */}
      <div 
        className="card-header border-0"
        style={{
          backgroundColor: "white",
          color: "rgb(17, 63, 103)",
          padding: "1.5rem",
          borderBottom: "1px solid rgba(17, 63, 103, 0.1)"
        }}
      >
        <div className="d-flex flex-grow-1 align-items-start ms-auto">
          <div className="flex-grow-1">
            <h5 className="mb-1" style={{ fontWeight: 600, fontSize: "1.25rem", color: "rgb(17, 63, 103)" }}>
              {title}
            </h5>
            <div className="d-flex align-items-center gap-2">
              <small style={{ color: "rgba(17, 63, 103, 0.7)" }}>
                {stocks.length} stock{stocks.length !== 1 ? 's' : ''}
              </small>
              {stocks.length > 0 && (
                <>
                  <span style={{ color: "rgba(17, 63, 103, 0.4)" }}>•</span>
                  <small 
                    style={{ fontWeight: 500, color: "rgba(17, 63, 103, 0.7)" }}
                  >
                    Avg: {averageChange > 0 ? '+' : ''}{averageChange}%
                  </small>
                 
                </>
              )}
            </div>
          </div>

          <div className="d-flex gap-2 align-items-center">
            {/* Add Stock Button */}
            <div className="position-relative">
              <button
                ref={buttonRef}
                className="btn btn-sm"
                style={{
                  backgroundColor: "rgba(17, 63, 103, 0.1)",
                  color: "rgb(17, 63, 103)",
                  border: "1px solid rgba(17, 63, 103, 0.2)",
                  borderRadius: "8px",
                  width: "32px",
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "18px"
                }}
                onClick={() => setShowDropdown(!showDropdown)}
                disabled={loadingAdd}
              >
                {loadingAdd ? (
                  <div
                    className="spinner-border spinner-border-sm"
                    style={{ width: "12px", height: "12px", color: "rgb(17, 63, 103)" }}
                  />
                ) : (
                  <i className="fas fa-plus" style={{ fontSize: "12px" }}></i>
                )}
                +
              </button>

              {showDropdown && (
                <div
                  className="position-absolute"
                  style={{
                    top: "110%",
                    left: dropdownAlignRight ? 'auto' : 0,
                    right: dropdownAlignRight ? 0 : 'auto',
                    zIndex: 1050,
                    width: "260px",
                    backgroundColor: "white",
                    border: "1px solid rgba(17, 63, 103, 0.2)",
                    boxShadow: "0 8px 24px rgba(17, 63, 103, 0.15)",
                    borderRadius: "12px",
                    padding: "16px",
                    maxWidth: '95vw',
                    overflowX: 'auto',
                  }}
                >
                  <h6 className="mb-3" style={{ color: "rgb(17, 63, 103)", fontWeight: 600 }}>
                    Add Stock
                  </h6>
                  <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Search companies..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      borderRadius: "8px",
                      border: "1px solid rgba(17, 63, 103, 0.2)",
                      padding: "8px 12px"
                    }}
                  />
                  <div
                    style={{
                      maxHeight: "200px",
                      overflowY: "auto",
                      border: "1px solid rgba(17, 63, 103, 0.1)",
                      borderRadius: "8px"
                    }}
                  >
                    {filteredStocks.length > 0 ? (
                      filteredStocks.slice(0, 10).map((stock) => (
                        <div
                          key={stock.symbol_id}
                          className="p-2"
                          onClick={() => handleNameClick(stock)}
                          style={{ 
                            cursor: "pointer",
                            borderBottom: "1px solid rgba(17, 63, 103, 0.05)",
                            transition: "background-color 0.2s ease"
                          }}
                          onMouseOver={(e) => {
                            e.target.style.backgroundColor = "rgba(17, 63, 103, 0.05)";
                          }}
                          onMouseOut={(e) => {
                            e.target.style.backgroundColor = "transparent";
                          }}
                        >
                          <div style={{ fontSize: "0.9rem", fontWeight: 500 }}>
                            {stock.companyName}
                          </div>
                          <small className="text-muted">{stock.symbol}</small>
                        </div>
                      ))
                    ) : (
                      <div className="p-3 text-center text-muted">
                        <i className="fas fa-search mb-2"></i>
                        <div>No matches found</div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Delete Watchlist Button */}
            <button
              className="btn btn-sm"
              style={{
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                color: "#ef4444",
                border: "1px solid rgba(239, 68, 68, 0.2)",
                borderRadius: "8px",
                width: "32px",
                height: "32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px"
                
              }}
              onClick={handleDeleteWatchlist}
              disabled={loadingDelete}
            >
              {loadingDelete ? (
                <div
                  className="spinner-border spinner-border-sm"
                  style={{ width: "12px", height: "12px", color: "#ef4444" }}
                />
              ) : (
                <i className="fas fa-trash" style={{ fontSize: "11px" }}></i>
              )}
              -
            </button>
          </div>
        </div>
      </div>

      {/* Stock List */}
      <div className="card-body p-0" style={{ minHeight: "200px" }}>
        {stocks.length === 0 ? (
          <div className="text-center py-5">
            <div 
              className="mb-3 mx-auto"
              style={{
                width: "60px",
                height: "60px",
                backgroundColor: "rgba(17, 63, 103, 0.1)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <i className="fas fa-chart-area" style={{ fontSize: "1.5rem", color: "rgb(17, 63, 103)" }}></i>
            </div>
            <h6 style={{ color: "rgb(17, 63, 103)", fontWeight: 600 }}>No Stocks Added</h6>
            <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>
              Click the + button to add stocks to this watchlist
            </p>
          </div>
        ) : (
          <div style={{ maxHeight: "400px", overflowY: "auto", cursor: "pointer" }}>
            {stocks.map((stock, index) => (
              <div 
                key={index} 
                className="d-flex justify-content-between align-items-center p-3"
                style={{ 
                  borderBottom: index < stocks.length - 1 ? "1px solid rgba(17, 63, 103, 0.05)" : "none",
                  transition: "background-color 0.2s ease"
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(17, 63, 103, 0.02)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              onClick={() => handleStockClick(stock.symbol)}>
                <div className="flex-grow-1">
                  <div style={{ fontWeight: 600, color: "rgb(17, 63, 103)", fontSize: "0.95rem" }}>
                    {stock.name}
                  </div>
                  <div className="d-flex align-items-center gap-2 mt-1">
                    <small className="text-muted">{stock.symbol}</small>
                    {currentPrices[stock.symbol] ? (
                      <small style={{ color: "rgb(17, 63, 103)", fontWeight: 500 }}>
                        ${parseFloat(currentPrices[stock.symbol]).toFixed(2)}
                      </small>
                    ) : loadingPrices ? (
                      <small className="text-muted">
                        <i className="fas fa-spinner fa-spin" style={{ fontSize: "10px" }}></i>
                      </small>
                    ) : (
                      <small className="text-muted">Price N/A</small>
                    )}
                  </div>
                </div>
                
                <div className="d-flex gap-3 align-items-center">
                  <div className="text-end">
                    <div 
                      className="fw-semibold"
                      style={{ 
                        color: parseFloat(periodChanges[stock.symbol] || 0) >= 0 ? "#22c55e" : "#ef4444",
                        fontSize: "0.95rem"
                      }}
                    >
                      {parseFloat(periodChanges[stock.symbol] || 0) >= 0 ? '+' : ''}{periodChanges[stock.symbol] || "0.00"}%
                    </div>
                    <small className="text-muted" style={{ fontSize: "0.75rem" }}>
                      Period's Change
                    </small>
                  </div>
                  
                  <button
                    className="btn btn-sm"
                    style={{
                      backgroundColor: "rgba(239, 68, 68, 0.1)",
                      color: "#ef4444",
                      border: "1px solid rgba(239, 68, 68, 0.2)",
                      borderRadius: "6px",
                      width: "28px",
                      height: "28px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "18px"
                    }}
                    onClick={() => handleDeleteStock(stock)}
                    title="Remove from watchlist"
                  >
                    <i className="fas fa-times" style={{ fontSize: "10px" }}></i>
                    -
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Performance Indicator Bar */}
      {stocks.length > 0 && (
        <div
          style={{
            height: "4px",
            background: `linear-gradient(90deg, ${
              parseFloat(averageChange) >= 0 ? '#22c55e' : '#ef4444'
            } 0%, ${
              parseFloat(averageChange) >= 0 ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'
            } 100%)`
          }}
        />
      )}
    </div>
  );
}

export default WatchlistCard;