import React, { useEffect, useState } from "react";
import * as axios from "axios";
import TimePeriod from "../components/TimePeriod";
import Sidebar from "../components/Sidebar";
import WatchlistCard from "../components/WatchlistCard";

const watchlistsContainerStyle = {
  position: "fixed",
  top: "10%",
  left: "240px", // Matches sidebar width
  width: "calc(100% - 240px)",
  height: "100vh",
  padding: "30px",
  backgroundColor: "#f5f7fa",
  overflowY: "auto",
  borderLeft: "1px solid #ddd", // Optional
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
    <div className="d-flex min-vh-100">
      <Sidebar />

      <div style={watchlistsContainerStyle}>
        <div className="d-flex flex-column mb-4">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <button
              className="btn btn-outline-primary"
              onClick={() => setShowInput(!showInput)}
              disabled={loading}
            >
              + Add a Watchlist
            </button>
          </div>

          {showInput && (
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Enter watchlist name"
                value={newWatchlistName}
                onChange={(e) => {
                  setNewWatchlistName(e.target.value);
                  setError("");
                }}
                disabled={loading}
              />
              {error && <small className="text-danger">{error}</small>}
              <div className="mt-2">
                <button
                  className="btn btn-success btn-sm me-2"
                  onClick={handleAddWatchlist}
                  disabled={loading}
                >
                  Submit
                </button>
                <button
                  className="btn btn-secondary btn-sm"
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
          )}
        </div>

        {loading ? (
          <div className="text-center py-5">
            {/* Simple spinner or you can replace with fancier spinner */}
            <div
              className="spinner-border text-primary"
              role="status"
              style={{ width: "3rem", height: "3rem" }}
            >
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="row">
            {watchlists.map((list, idx) => (
              <div className="col-md-6" key={list.id || idx}>
                <WatchlistCard {...list} refreshData={fetchData} />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex-grow-1 bg-white p-4">
        <h2
          className="fst-italic mb-0"
          style={{ left: "300px", position: "absolute" }}
        >
          Watchlists
        </h2>
        <TimePeriod />
      </div>
    </div>
  );
}
