import React, { useEffect, useState } from "react";
import * as axios from "axios";
import TimePeriod from "../components/TimePeriod";
import Sidebar from "../components/Sidebar";
import WatchlistCard from "../components/WatchlistCard";

const watchlistsContainerStyle = {
  position: "fixed",
  top: "0",
  left: "240px",
  width: "calc(100% - 240px)",
  height: "100vh",
  
  overflowY: "auto",
};

const headerStyle = {
 
  color: "rgb(17, 63, 103)",
  padding: "2rem 2rem 1.5rem",
  borderBottom: "3px solid rgba(17, 63, 103, 0.1)",
  boxShadow: "0 4px 12px rgba(17, 63, 103, 0.15)",
};

const contentStyle = {
  padding: "2rem",
  minHeight: "calc(100vh - 140px)",
};

export default function Watchlists() {
  const [watchlists, setWatchlist] = useState([]);
  const [showInput, setShowInput] = useState(false);
  const [newWatchlistName, setNewWatchlistName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8080/watchlistStocks/getAll");

      const allSymbols = res.data.flatMap((item) =>
        item.stocks.map((stock) => stock.symbol)
      );

      const currentPriceRequests = allSymbols.map((symbol) =>
        axios.get(`http://localhost:4000/api/currentStockValue/${symbol}`)
      );
      const currentPriceResponses = await Promise.all(currentPriceRequests);

      const currentPriceMap = {};
      currentPriceResponses.forEach((response) => {
        response.data.forEach((item) => {
          currentPriceMap[item.symbol] = {
            price: item.price,
            periodNumber: item.periodNumber,
          };
        });
      });

      const prevPeriodRequests = allSymbols.map((symbol) => {
        const currentPeriod = currentPriceMap[symbol]?.periodNumber;
        const prevPeriod = currentPeriod && currentPeriod > 1 ? currentPeriod - 1 : null;

        if (!prevPeriod) {
          return Promise.resolve({ data: [] });
        }

        return axios.get(
          `http://localhost:4000/api/prevStockValue/${symbol}?periodNumber=${prevPeriod}`
        );
      });

      const prevPeriodResponses = await Promise.all(prevPeriodRequests);

      const prevCloseMap = {};
      prevPeriodResponses.forEach((response, idx) => {
        const symbol = allSymbols[idx];
        if (response.data.length > 0) {
          prevCloseMap[symbol] = response.data[0].maxPrice;
        } else {
          prevCloseMap[symbol] = 0;
        }
      });

      const priceDifferences = {};
      allSymbols.forEach((symbol) => {
        const currentPrice = currentPriceMap[symbol]?.price || 0;
        const prevClose = prevCloseMap[symbol] || 0;
        priceDifferences[symbol] =
          prevClose > 0 ? ((currentPrice - prevClose) * 100) / prevClose : 0;
      });

      const newWatchlists = res.data.map((item) => {
        const totalChange = item.stocks.reduce((sum, stock) => {
          return sum + (priceDifferences[stock.symbol] || 0);
        }, 0);

        return {
          ...item,
          title: item.watchlistName,
          isPositive: totalChange > 0,
          stocks: item.stocks.map((stock) => ({
            symbol_id: stock.symbolId,
            name: stock.companyName,
            symbol: stock.symbol,
            change: priceDifferences[stock.symbol]?.toFixed(2) || "N/A",
          })),
        };
      });

      setWatchlist(newWatchlists);
    } catch (err) {
      console.error("Error in fetchData:", err);
      setError("Failed to load watchlists.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddWatchlist = async () => {
    if (newWatchlistName.trim().length < 3) {
      setError("Name must be at least 3 characters.");
      return;
    }

    setLoading(true);
    try {
      await axios.post("http://localhost:8080/watchlist/addWatchlist", {
        name: newWatchlistName.trim(),
      });
      setNewWatchlistName("");
      setShowInput(false);
      setError("");
      await fetchData();
    } catch (err) {
      console.error("Failed to add watchlist:", err);
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex min-vh-100" style={{ backgroundColor: "#f1f5f9" }}>
      <Sidebar />

      <div style={watchlistsContainerStyle}>
        {/* Header Section */}
        <div style={headerStyle}>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="mb-2" style={{ fontWeight: 600, fontSize: "2.25rem" }}>
                My Watchlists
              </h1>
              <p className="mb-0 opacity-90" style={{ fontSize: "1.1rem" }}>
                Track and monitor your favorite stocks
              </p>
            </div>
            <TimePeriod />
          </div>
        </div>

        {/* Content Section */}
        <div style={contentStyle}>
          {/* Add Watchlist Section */}
          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <button
                className="btn px-4 py-2"
                style={{
                  backgroundColor: "rgb(17, 63, 103)",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: 500,
                  fontSize: "0.95rem",
                  boxShadow: "0 2px 8px rgba(17, 63, 103, 0.25)",
                  transition: "all 0.2s ease"
                }}
                onClick={() => setShowInput(!showInput)}
                disabled={loading}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = "rgb(25, 80, 130)";
                  e.target.style.transform = "translateY(-1px)";
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = "rgb(17, 63, 103)";
                  e.target.style.transform = "translateY(0)";
                }}
              >
                <i className="fas fa-plus me-2"></i>
                Add New Watchlist
              </button>
            </div>

            {showInput && (
              <div 
                className="p-4 mb-4"
                style={{
                  backgroundColor: "white",
                  border: "1px solid rgba(17, 63, 103, 0.1)",
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(17, 63, 103, 0.08)"
                }}
              >
                <h6 className="mb-3" style={{ color: "rgb(17, 63, 103)", fontWeight: 600 }}>
                  Create New Watchlist
                </h6>
                <div className="row g-3">
                  <div className="col-md-8">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter watchlist name (min. 3 characters)"
                      value={newWatchlistName}
                      onChange={(e) => {
                        setNewWatchlistName(e.target.value);
                        setError("");
                      }}
                      disabled={loading}
                      style={{
                        borderRadius: "8px",
                        border: error ? "2px solid #dc3545" : "1px solid rgba(17, 63, 103, 0.2)",
                        padding: "10px 16px",
                        fontSize: "0.95rem"
                      }}
                    />
                    {error && <small className="text-danger mt-1 d-block">{error}</small>}
                  </div>
                  <div className="col-md-4">
                    <div className="d-flex gap-2">
                      <button
                        className="btn flex-fill"
                        style={{
                          backgroundColor: "#22c55e",
                          color: "white",
                          border: "none",
                          borderRadius: "8px",
                          fontWeight: 500
                        }}
                        onClick={handleAddWatchlist}
                        disabled={loading}
                      >
                        {loading ? "Adding..." : "Create"}
                      </button>
                      <button
                        className="btn btn-outline-secondary flex-fill"
                        style={{ borderRadius: "8px" }}
                        onClick={() => {
                          setShowInput(false);
                          setNewWatchlistName("");
                          setError("");
                        }}
                        disabled={loading}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Watchlists Grid */}
          {loading ? (
            <div className="text-center py-5">
              <div
                className="spinner-border"
                role="status"
                style={{ 
                  width: "3rem", 
                  height: "3rem",
                  color: "rgb(17, 63, 103)"
                }}
              >
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3 text-muted">Loading your watchlists...</p>
            </div>
          ) : watchlists.length === 0 ? (
            <div className="text-center py-5">
              <div 
                className="mb-4 mx-auto"
                style={{
                  width: "80px",
                  height: "80px",
                  backgroundColor: "rgba(17, 63, 103, 0.1)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <i className="fas fa-chart-line" style={{ fontSize: "2rem", color: "rgb(17, 63, 103)" }}></i>
              </div>
              <h4 style={{ color: "rgb(17, 63, 103)", fontWeight: 600 }}>No Watchlists Yet</h4>
              <p className="text-muted mb-4">Create your first watchlist to start tracking stocks</p>
              <button
                className="btn px-4 py-2"
                style={{
                  backgroundColor: "rgb(17, 63, 103)",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: 500
                }}
                onClick={() => setShowInput(true)}
              >
                Create Watchlist
              </button>
            </div>
          ) : (
            <div className="row g-4">
              {watchlists.map((list, idx) => (
                <div className="col-xl-4 col-lg-6 col-md-12" key={list.id || idx}>
                  <WatchlistCard {...list} refreshData={fetchData} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}