import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

// Pages
import Dashboard from "./pages/Dashboard";
import OrderHistoryPage from "./pages/OrderHistoryPage";
import Watchlists from "./pages/Watchlists";
import SettingsPage from "./pages/SettingsPage";
import PortfolioPage from "./pages/PortfolioPage";
import StocksPage from "./pages/StocksPage";
import TransactPage from "./pages/TransactPage";
import SipPage from "./pages/SipPage"; // Make sure this file exists

export default function App() {
  return (
  
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/order-history" element={<OrderHistoryPage />} />
        <Route path="/watchlists" element={<Watchlists />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/transact" element={<TransactPage />} />
        <Route path="/sip" element={<SipPage />} />
        <Route path="/stock/:symbol" element={<StocksPage />} />
      </Routes>
    </Router>
  );
}
