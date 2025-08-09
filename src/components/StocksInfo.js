import {React, useState, useEffect} from "react";
import WebFont from 'webfontloader';
import StockChart from '../cards/StockChart';
import StockManipulation from '../cards/StockManipulation';
WebFont.load({
    google: {
      families: ['Mozilla Headline:200-700']
    }
});

export default function StocksInfo({ selectedStock }){
    // Use selectedStock prop or fallback to default
    const stockData = selectedStock || {
        symbol: "AAPL",
        companyName: "Apple Inc.",
        price: 150.25
    };
    
    // State to track current price from API
    const [currentPrice, setCurrentPrice] = useState(stockData.price);
    
    // Update current price when selectedStock changes
    useEffect(() => {
        if (selectedStock) {
            setCurrentPrice(selectedStock.price);
        }
    }, [selectedStock]);
    
    // Handler for price updates from StockChart
    const handlePriceUpdate = (newPrice) => {
        setCurrentPrice(newPrice);
    };
    
    return (
        <div style={{ marginLeft: "250px", padding: "5px", width: `calc(100vw - 300px)`, boxSizing: 'border-box' }}>
            <h2 
                style={{
                    textAlign: "center",
                    fontFamily: "'Mozilla Headline', sans-serif'",
                    fontWeight: "900",
                    fontSize: "2.9rem",
                    marginBottom: "10px",
                    color: "#113F67"
                    }}
                >
                {stockData.companyName} ({stockData.symbol})
            </h2>
            <div style={{
                textAlign: "center",
                fontSize: "2.2rem",
                fontWeight: "600",
            }}>
                <p style={{                
                    color: "#113F67",
                }}>Price: ${currentPrice.toFixed(2)}</p>
            </div>
            {/* Stock Chart Component */}
            <StockChart 
                symbol={stockData.symbol} 
                onPriceUpdate={handlePriceUpdate}
            />
            {/* Option to Buy, Sell, Order Type and Add to Watchlist */}
            <StockManipulation symbol={stockData.symbol} currentPrice={currentPrice} />        
        </div>
    )
}