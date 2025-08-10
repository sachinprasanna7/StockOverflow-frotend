import TimePeriod from "../components/TimePeriod";
import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import WatchlistCard from "../components/WatchlistCard";
import axios from "axios";

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

  const fetchData = async () => {
    axios.get("http://localhost:8080/watchlistStocks/getAll")
      .then((res) => {
        const newarr = res.data.map((item) => ({
          ...item,
          title: item.watchlistName,
          isPositive: true,
          stocks: item.stocks.map((stock) => ({
            symbol_id: stock.symbolId,
            name: stock.companyName,
            change: "+4.2",
          })),
        }));
        setWatchlist(newarr);
      })
      .catch((err) => console.error("Error:", err));
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    console.log("Watchlists fetched:", watchlists);
  }, [watchlists]);

  const handleAddWatchlist = async () => {
    if (newWatchlistName.trim().length < 3) {
      setError("Name must be at least 3 characters.");
      return;
    }

    try {
      await axios.post("http://localhost:8080/watchlist/addWatchlist", {
        name: newWatchlistName.trim(),
      });
      setNewWatchlistName("");
      setShowInput(false);
      setError("");
      fetchData(); // Refresh the list
    } catch (err) {
      console.error("Failed to add watchlist:", err);
      setError("Something went wrong.");
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
              />
              {error && <small className="text-danger">{error}</small>}
              <div className="mt-2">
                <button
                  className="btn btn-success btn-sm me-2"
                  onClick={handleAddWatchlist}
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
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="row">
          {watchlists.map((list, idx) => (
            <div className="col-md-6" key={idx}>
              <WatchlistCard {...list} refreshData={fetchData} />
            </div>
          ))}
        </div>
      </div>

      <div className="flex-grow-1 bg-white p-4">
        <h2 className="fst-italic mb-0" style={{ left: "300px", position: "absolute" }}>
          Watchlists
        </h2>
        <TimePeriod />
      </div>
    </div>
  );
}
