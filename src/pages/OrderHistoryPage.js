import React from "react";
import Sidebar from "../components/Sidebar";
import WelcomeText from "../components/WelcomeText";
import TimePeriod from "../components/TimePeriod";
import IndexDataRibbon from "../components/IndexDataRibbon";
import InvestmentSummary from "../components/InvestmentSummary";
import SearchBar from "../components/SearchBar";
import StockLists from "../components/StockLists";
import 'bootstrap/dist/css/bootstrap.min.css';
import Orders from "../cards/OrderCard";
import OrderHistory from "../components/OrderHistory";
import SearchOrders from "../components/SearchOrders";
export default function OrderHistoryPage() {
  return (
    <div className="d-flex min-vh-100">
      <Sidebar />
      <div className="flex-grow-1 bg-white p-4">
        <TimePeriod />
        <IndexDataRibbon />
        {/* <WelcomeText /> */}
        {/* <SearchOrders /> */}
        <OrderHistory/>
       
      </div>
    </div>
  );
}