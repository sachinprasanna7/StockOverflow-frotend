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
  const { symbol } = useParams(); // from URL, e.g. "cpgx"
  const symbolLow = symbol.toLowerCase();

  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch stock details from external API
  useEffect(() => {
    const fetchStockDetails = async () => {
      try {
          const res = await axios.get(
            `http://localhost:4000/api/stocks/${symbolLow}`
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

  // Track current price separately so it can be updated live
  const [currentPrice, setCurrentPrice] = useState(null);

  // Initialize current price when API loads
  useEffect(() => {
    if (stockData?.price !== undefined) {
      setCurrentPrice(stockData.price);
    }
  }, [stockData]);

  // Update current price when selectedStock changes (if passed as prop)
  useEffect(() => {
    if (selectedStock?.price !== undefined) {
      setCurrentPrice(selectedStock.price);
    }
  }, [selectedStock]);

  // Handler for StockChart live price updates
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
      <div
        style={{
          textAlign: "center",
          fontSize: "2.2rem",
          fontWeight: "600",
        }}
      >
        <p
          style={{
            color: "#113F67",
          }}
        >
          Price: ${currentPrice?.toFixed(2)}
        </p>
      </div>

      {/* Stock Chart Component */}
      <StockChart
        symbol={stockData.symbol}
        onPriceUpdate={handlePriceUpdate}
      />

      {/* Buy/Sell UI */}
      <StockManipulation
        symbol={stockData.symbol}
        currentPrice={currentPrice}
      />
    </div>
  );
}

