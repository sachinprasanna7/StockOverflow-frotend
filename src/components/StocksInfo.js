import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import WebFont from "webfontloader";
import axios from "axios";
import StockChart from "../cards/StockChart";
import StockManipulation from "../cards/StockManipulation";
import "../styles/styleInfo.css"; // Assuming you have a CSS file for styles

WebFont.load({
    google: {
        families: ["Mozilla Headline:200-700"],
    },
});

export default function StocksInfo({ selectedStock }) {
    const { symbol } = useParams();
    const symbolLow = symbol.toLowerCase();

    const [stockData, setStockData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [tradingBalance, setTradingBalance] = useState({
        amount: 0,
        loading: false,
    });

    // http://localhost:8080/useraccount/getTradingMoney?userId=1
    // fetch not axios
    useEffect(() => {

        const fetchTradingBalance = async () => {
            setTradingBalance((prev) => ({ ...prev, loading: true }));
            try {
                const response = await fetch(`http://localhost:8080/useraccount/getTradingMoney?userId=1`);
                const data = await response.json();
                setTradingBalance({ amount: data.trading_money, loading: false });
            } catch (error) {
                console.error('Error fetching trading balance:', error);
                setTradingBalance((prev) => ({ ...prev, loading: false }));
            }
        };

        fetchTradingBalance();

    }, [symbolLow]);

    // Fetch stock details
    useEffect(() => {
        const fetchStockDetails = async () => {
            try {
                const res = await axios.get(`http://localhost:4000/api/currentStockValue/${symbolLow}`);
                if (res.data && res.data.length > 0) {
                    setStockData(res.data[0]);
                    setError(null);
                } else {
                    setError("No stock data found");
                }
            } catch (err) {
                console.error(err);
                setError("Failed to fetch stock details");
            } finally {
                setLoading(false);
            }
        };

        // Fetch immediately once
        fetchStockDetails();

        // Then set interval to fetch every 2 seconds
        const intervalId = setInterval(fetchStockDetails, 2000);

        // Cleanup on unmount or when symbolLow changes
        return () => clearInterval(intervalId);
    }, [symbolLow]);



    // Track current price for live updates
    const [currentPrice, setCurrentPrice] = useState(null);
    useEffect(() => {
        if (stockData?.price !== undefined) {
            setCurrentPrice(stockData.price);
        }
    }, [stockData]);
    useEffect(() => {
        if (selectedStock?.price !== undefined) {
            setCurrentPrice(selectedStock.price);
        }
    }, [selectedStock]);

    const handlePriceUpdate = (newPrice) => {
        setCurrentPrice(newPrice);
    };

    if (loading) {
        return (
            <div style={{ marginLeft: "250px", padding: "20px", textAlign: "center", fontSize: "1.5rem", color: "#113F67" }}>
                <span className="spinner"></span>
                Loading stock data...
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ marginLeft: "250px", padding: "20px", color: "red" }}>
                {error}
            </div>
        );
    }

    return (
        <div
            style={{
                marginLeft: "250px",
                padding: "5px",
                width: `calc(100vw - 300px)`,
                boxSizing: "border-box",
            }}
        >

            <div style={{ textAlign: "right", fontSize: "1.2rem", marginBottom: "10px" }}>
                {tradingBalance.loading
                    ? "Loading balance..."
                    : `Trading Balance: $${tradingBalance.amount.toFixed(2)}`}
            </div>

            {/* Stock Chart */}
            <StockChart symbol={stockData.symbol} companyName={stockData.companyName} currentPrice={currentPrice} onPriceUpdate={handlePriceUpdate} />

            {/* Buy/Sell UI */}
            <StockManipulation symbol={stockData.symbol} currentPrice={currentPrice} />
        </div>
    );
}
