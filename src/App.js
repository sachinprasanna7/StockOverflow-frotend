import React from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import InvestmentSummary from "./components/InvestmentSummary";
import SearchBar from "./components/SearchBar";
import StockLists from "./components/StockLists";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function App() {
  return (
    <div className="d-flex min-vh-100">
      <Sidebar />
      <div className="flex-grow-1 bg-white p-4">
        <Header />
        <InvestmentSummary />
        <SearchBar />
        <StockLists />
      </div>
    </div>
  );
}
