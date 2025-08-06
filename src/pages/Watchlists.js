import TimePeriod from "../components/TimePeriod";
import React from "react";
import Sidebar from "../components/Sidebar";
import WatchlistCard from "../components/WatchlistCard";

const dummyData = [
  {
    title: "Watchlist 1",
    isPositive: true,
    stocks: [
      { name: "Stock 1", change: "+5.2%" },
      { name: "Stock 2", change: "+5.2%" },
      { name: "Stock 3", change: "+5.2%" },
    ],
  },
  {
    title: "Watchlist 2",
    isPositive: false,
    stocks: [
      { name: "Stock 1", change: "+5.2%" },
      { name: "Stock 2", change: "+5.2%" },
      { name: "Stock 3", change: "+5.2%" },
    ],
  },
  {
    title: "Watchlist 1",
    isPositive: false,
    stocks: [
      { name: "Stock 1", change: "+5.2%" },
      { name: "Stock 2", change: "+5.2%" },
      { name: "Stock 3", change: "+5.2%" },
    ],
  },
  {
    title: "Watchlist 1",
    isPositive: true,
    stocks: [
      { name: "Stock 1", change: "+5.2%" },
      { name: "Stock 2", change: "+5.2%" },
      { name: "Stock 3", change: "+5.2%" },
    ],
  },
  {
    title: "Watchlist 1",
    isPositive: true,
    stocks: [
      { name: "Stock 1", change: "+5.2%" },
      { name: "Stock 2", change: "+5.2%" },
      { name: "Stock 3", change: "+5.2%" },
    ],
  },
  {
    title: "Watchlist 1",
    isPositive: true,
    stocks: [
      { name: "Stock 1", change: "+5.2%" },
      { name: "Stock 2", change: "+5.2%" },
      { name: "Stock 3", change: "+5.2%" },
    ],
  },
  {
    title: "Watchlist 1",
    isPositive: false,
    stocks: [
      { name: "Stock 1", change: "+5.2%" },
      { name: "Stock 2", change: "+5.2%" },
      { name: "Stock 3", change: "+5.2%" },
    ],
  },
  {
    title: "Watchlist 1",
    isPositive: false,
    stocks: [
      { name: "Stock 1", change: "+5.2%" },
      { name: "Stock 2", change: "+5.2%" },
      { name: "Stock 3", change: "+5.2%" },
    ],
  },
];

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
  return (
    <div className="d-flex min-vh-100">
        
      <Sidebar />
      <div style={watchlistsContainerStyle}>
          <div className="d-flex justify-content-between align-items-center mb-4" >
        
        <button className="btn btn-outline-primary">+ Add a Watchlist</button>
      </div>

      <div className="row" >
        {dummyData.map((list, idx) => (
          <div className="col-md-6" key={idx}>
            <WatchlistCard {...list} />
          </div>
        ))}
      </div>
      </div>
      <div className="flex-grow-1 bg-white p-4">
  
    <h2 className="fst-italic mb-0" style={{left:"300px",position:"absolute"}}>Watchlists</h2>
    <TimePeriod />
  </div>
    </div>
    
  );
}