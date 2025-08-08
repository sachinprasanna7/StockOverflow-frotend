import React from "react";
import Sidebar from "../components/Sidebar";
import WelcomeText from "../components/WelcomeText";
import TimePeriod from "../components/TimePeriod";
import IndexDataRibbon from "../components/IndexDataRibbon";
import InvestmentSummary from "../components/InvestmentSummary";
import SearchBar from "../components/SearchBar";
import StockLists from "../components/StockLists";
import 'bootstrap/dist/css/bootstrap.min.css';
import Settings from "../components/Settings"; 

export default function SettingsPage() {
  return (
    <div className="d-flex min-vh-100">
      <Sidebar />
      <div className="flex-grow-1 bg-white p-4">
        <TimePeriod />
    
        <Settings />
      </div>
    </div>
  );
}
