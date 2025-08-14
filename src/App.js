import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

// Pages
import Dashboard from "./pages/Dashboard";
import OrderHistoryPage from "./pages/OrderHistoryPage";
import Watchlists from "./pages/Watchlists";
import SettingsPage from "./pages/SettingsPage";
import PortfolioPage1 from "./pages/PortfolioPage1";
import StocksPage from "./pages/StocksPage";
import TransactPage from "./pages/TransactPage";
import HelpPage from "./pages/HelpPage";

export default function App() {
  return (  
  
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/order-history" element={<OrderHistoryPage />} />
        <Route path="/watchlists" element={<Watchlists />} />
        <Route path="/portfolio" element={<PortfolioPage1 />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/transact" element={<TransactPage />} />
        <Route path="/stock/:symbol" element={<StocksPage />} />
        <Route path="/help" element={<HelpPage />} />
      </Routes>
    </Router>
  );
}
