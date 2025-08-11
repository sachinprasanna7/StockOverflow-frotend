import {React, useState, useEffect} from "react";
import bootstrap from "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "../components/Sidebar";
import TimePeriod from "../components/TimePeriod";
import IndexDataRibbon from "../components/IndexDataRibbon";
import StocksInfo from "../components/StocksInfo";
import SearchBar from "../components/SearchBar";

export default function StocksPage() {
    // State to manage selected stock
    const [selectedStock, setSelectedStock] = useState({
        symbol: "AAPL",
        companyName: "Apple Inc.",
        price: 150.25
    });

    // Handler for when user selects a stock from search
    const handleStockSelect = (stock) => {
        setSelectedStock({
            symbol: stock.symbol,
            companyName: stock.companyName,
            price: typeof stock.price === 'number' ? stock.price : parseFloat(stock.price.toString().replace('$', '').replace(',', ''))
        });
    };

    return (
        <div className="d-flex min-vh-100">
            <Sidebar />
            <div className="flex-grow-1 bg-white p-4">
                <TimePeriod />
                <SearchBar onStockSelect={handleStockSelect} />
                <StocksInfo selectedStock={selectedStock} />
            </div>
        </div>
    )
}  