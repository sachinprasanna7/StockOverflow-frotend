// import {React, useState, useEffect} from "react";
// import WebFont from 'webfontloader';
// import StockChart from '../cards/StockChart';
// import StockManipulation from '../cards/StockManipulation';
// WebFont.load({
//     google: {
//       families: ['Mozilla Headline:200-700']
//     }
// });

// export default function StocksInfo({ selectedStock }){
//     // Use selectedStock prop or fallback to default
//     const { symbol } = useParams(); // e.g. "cpgx"
//     const symbolLow = symbol.toLowerCase(); // Ensure symbol is lowercase
  
//     const [stockData, setStockData] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
  
//     useEffect(() => {
//       const fetchStockDetails = async () => {
//         try {
//           const res = await axios.get(
//             `http://localhost:4000/api/stocks/${symbolLow}`
//           );
//           console.log("Stock Data:", res.data);
//           setStockData(res.data[0]); // response is an array
//         } catch (err) {
//           setError("Failed to fetch stock details");
//         } finally {
//           setLoading(false);
//         }
//       };
  
//       fetchStockDetails();
//     }, [symbol]);
    
    
//     // State to track current price from API
//     const [currentPrice, setCurrentPrice] = useState(stockData.price);
    
//     // Update current price when selectedStock changes
//     useEffect(() => {
//         if (selectedStock) {
//             setCurrentPrice(selectedStock.price);
//         }
//     }, [selectedStock]);
    
//     // Handler for price updates from StockChart
//     const handlePriceUpdate = (newPrice) => {
//         setCurrentPrice(newPrice);
//     };
    
//     return (
//         <div style={{ marginLeft: "250px", padding: "5px", width: `calc(100vw - 300px)`, boxSizing: 'border-box' }}>
//             <h2 
//                 style={{
//                     textAlign: "center",
//                     fontFamily: "'Mozilla Headline', sans-serif'",
//                     fontWeight: "900",
//                     fontSize: "2.9rem",
//                     marginBottom: "10px",
//                     color: "#113F67"
//                     }}
//                 >
//                 {stockData.companyName} ({stockData.symbol})
//             </h2>
//             <div style={{
//                 textAlign: "center",
//                 fontSize: "2.2rem",
//                 fontWeight: "600",
//             }}>
//                 <p style={{                
//                     color: "#113F67",
//                 }}>Price: ${currentPrice.toFixed(2)}</p>
//             </div>
//             {/* Stock Chart Component */}
//             <StockChart 
//                 symbol={stockData.symbol} 
//                 onPriceUpdate={handlePriceUpdate}
//             />
//             {/* Option to Buy, Sell, Order Type and Add to Watchlist */}
//             <StockManipulation symbol={stockData.symbol} currentPrice={currentPrice} />        
//         </div>
//     )
// }




import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import WebFont from "webfontloader";
import axios from "axios";
import StockChart from "../cards/StockChart";
import StockManipulation from "../cards/StockManipulation";

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

  // Fetch stock details
  useEffect(() => {
    const fetchStockDetails = async () => {
      try {
        const res = await axios.get(
          ` http://localhost:4000/api/currentStockValue/${symbolLow}`
        );
        if (res.data && res.data.length > 0) {
          setStockData(res.data[0]);
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

    fetchStockDetails();
    
  }, [symbolLow]);

  // Fetch trading balance
  useEffect(() => {
    const fetchTradingBalance = async () => {
      try {
        setTradingBalance((prev) => ({ ...prev, loading: true }));
        const response = await axios.get(
          "http://localhost:8080/useraccount/getTradingMoney?userId=1"
        );
        setTradingBalance({
          amount: response.data.trading_money,
          loading: false,
        });
        console.log("Trading Balance:", response.data.trading_money);
      } catch (error) {
        console.error("Error fetching balance:", error);
        setTradingBalance((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchTradingBalance();
  }, []);
  useEffect(() => {
    console.log("Trading Balance updated:", tradingBalance.amount);
  }, [tradingBalance.amount]);

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
      <div style={{ marginLeft: "250px", padding: "20px" }}>
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
      {/* Balance */}
      <div style={{ textAlign: "right", fontSize: "1.2rem", marginBottom: "10px" }}>
  {tradingBalance.loading
    ? "Loading balance..."
    : `Trading Balance: $${tradingBalance.amount.toFixed(2)}`}
</div>


      {/* Stock Title */}
      <h2
        style={{
          textAlign: "center",
          fontFamily: "'Mozilla Headline', sans-serif",
          fontWeight: "900",
          fontSize: "2.9rem",
          marginBottom: "10px",
          color: "#113F67",
        }}
      >
        {stockData.companyName} ({stockData.symbol.toUpperCase()})
      </h2>

      {/* Price */}
      <div style={{ textAlign: "center", fontSize: "2.2rem", fontWeight: "600" }}>
        <p style={{ color: "#113F67" }}>
          Price: ${currentPrice?.toFixed(2)}
        </p>
      </div>

      {/* Stock Chart */}
      <StockChart symbol={stockData.symbol} onPriceUpdate={handlePriceUpdate} />

      {/* Buy/Sell UI */}
      <StockManipulation symbol={stockData.symbol} currentPrice={currentPrice} />
    </div>
  );
}
