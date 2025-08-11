import React, { useEffect, useState, useRef } from "react";

//Styles 
const containerStyle = {
  background: "linear-gradient(135deg, #113F67 0%, #1a5a8a 100%)",
  borderRadius: "16px",
  padding: "32px",
  marginBottom: "24px",
  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
  position: "relative",
  overflow: "hidden"
};

const backgroundPattern = {
  position: "absolute",
  top: 0,
  right: 0,
  width: "200px",
  height: "200px",
  background: "radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)",
  backgroundSize: "20px 20px",
  opacity: 0.3
};

const statCardStyle = {
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(10px)",
  borderRadius: "12px",
  padding: "24px 20px",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  transition: "all 0.3s ease",
  position: "relative",
  minWidth: "200px"
};

const labelStyle = {
  color: "rgba(255, 255, 255, 0.8)",
  fontSize: "14px",
  fontWeight: "500",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  marginBottom: "8px"
};

const valueStyle = {
  color: "white",
  fontSize: "28px",
  fontWeight: "700",
  marginBottom: "4px",
  lineHeight: "1.2"
};

const subValueStyle = {
  fontSize: "14px",
  fontWeight: "500",
  marginTop: "4px"
};

const positiveStyle = {
  color: "#4ade80"
};

const negativeStyle = {
  color: "#ef4444"
};

const iconStyle = {
  position: "absolute",
  top: "16px",
  right: "16px",
  fontSize: "20px",
  opacity: 0.6
};

function getPeriodFromTime() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  const totalSeconds = (hours * 3600) + (minutes * 60) + seconds;
  const period = Math.floor(totalSeconds / 20) + 1;
  return period;
}


export default function InvestmentSummary() {
    const [portfolio, setPortfolio] = useState([]);
    const [stocksData, setStocksData] = useState([]);
    const [currentPrices, setCurrentPrices] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [periodStartValue, setPeriodStartValue] = useState(null);
    let currentPeriodRef = useRef(-1);
  
    // Add debug logging
    useEffect(() => {
      console.log("Portfolio data:", portfolio);
      console.log("Stocks data:", stocksData);
      console.log("Current prices:", currentPrices);
    }, [portfolio, stocksData, currentPrices]);
  
    useEffect(() => {
      async function fetchData() {
        try {
          setLoading(true);
          setError(null);
  
          // 1. Fetch portfolio holdings
          console.log("Fetching portfolio...");
          const portfolioRes = await fetch("http://localhost:8080/portfolio/all");
          if (!portfolioRes.ok) {
            throw new Error(`Portfolio fetch failed: ${portfolioRes.status}`);
          }
          const portfolioData = await portfolioRes.json();
          console.log("Portfolio fetched:", portfolioData);
          setPortfolio(portfolioData);
  
          // Check if portfolio is empty
          if (!portfolioData || portfolioData.length === 0) {
            console.log("No portfolio data found");
            setLoading(false);
            return;
          }
  
          // 2. Extract unique symbolIds
          const symbolIds = [...new Set(portfolioData.map((item) => item.symbolId))];
          console.log("Symbol IDs:", symbolIds);
  
          // 3. Fetch stock details by symbolId
          const stockDetailsFetches = symbolIds.map(async (id) => {
            try {
              const res = await fetch(`http://localhost:8080/api/stock/${id}`);
              if (!res.ok) {
                console.error(`Failed to fetch stock ${id}: ${res.status}`);
                return null;
              }
              const data = await res.json();
              console.log(`Stock data for ${id}:`, data);
              return { ...data, symbolId: id }; // Ensure symbolId is included
            } catch (err) {
              console.error(`Error fetching stock ${id}:`, err);
              return null;
            }
          });
  
          const stocksDetails = await Promise.all(stockDetailsFetches);
          const validStocks = stocksDetails.filter(stock => stock !== null);
          console.log("Valid stocks:", validStocks);
          setStocksData(validStocks);
  
        } catch (err) {
          console.error("Fetch error:", err);
          setError(err.message || "Failed to load data");
        } finally {
          setLoading(false);
        }
      }
  
      fetchData();
    }, []);
  
    useEffect(() => {
      if (!stocksData || stocksData.length === 0) return;
  
      let intervalId;
  
      const fetchCurrentPrices = async () => {
        try {
          const symbols = stocksData.map(stock => stock.symbol).filter(Boolean);
          console.log("Fetching prices for symbols:", symbols);
  
          if (symbols.length === 0) return;
  
          const priceFetches = symbols.map(async symbol => {
            try {
              const res = await fetch(`http://localhost:4000/api/currentStockValue/${symbol}`);
              if (!res.ok) {
                console.error(`Failed to fetch price for ${symbol}: ${res.status}`);
                return { symbol, price: 0 };
              }
              const data = await res.json();
              return {
                symbol,
                price: data?.[0]?.price ?? 0
              };
            } catch (err) {
              console.error(`Error fetching price for ${symbol}:`, err);
              return { symbol, price: 0 };
            }
          });
  
          const pricesArray = await Promise.all(priceFetches);
          console.log("Prices fetched:", pricesArray);
  
          const priceMap = pricesArray.reduce((acc, { symbol, price }) => {
            acc[symbol] = price;
            return acc;
          }, {});
  
          setCurrentPrices(priceMap);
  
          // get the current period
          const runningPeriod = getPeriodFromTime();
  
          if (currentPeriodRef.current === -1 || currentPeriodRef.current < runningPeriod) {
            const totalCurrent = portfolio.reduce((sum, item) => {
              const stock = stocksData.find(s => s.symbolId === item.symbolId);
              const symbol = stock?.symbol;
              if (!symbol) return sum;
  
              const currentPrice = priceMap[symbol] || 0;
              return sum + item.stockQuantity * currentPrice;
            }, 0);
  
            setPeriodStartValue(totalCurrent);
            currentPeriodRef.current = runningPeriod;
          }
  
        } catch (err) {
          console.error("Error fetching prices:", err);
        }
      };
  
      fetchCurrentPrices();
  
      // Fetch every 3s
      intervalId = setInterval(fetchCurrentPrices, 3000);
  
      return () => clearInterval(intervalId);
    }, [stocksData, portfolio]);
  
    if (loading) return <div>Loading portfolio...</div>;
    if (error) return <div style={{ color: "red" }}>Error: {error}</div>;
  
    // Build symbolId => stockDetail map for quick lookup - FIXED
    const symbolIdToStock = {};
    stocksData.forEach((stock) => {
      if (stock && stock.symbolId !== undefined) {
        symbolIdToStock[stock.symbolId] = stock;
      }
    });
  
    console.log("symbolIdToStock mapping:", symbolIdToStock);
  
    // Calculate totals
    const totalInvested = portfolio.reduce((sum, item) => sum + item.averagePrice * item.stockQuantity, 0);
  
    const totalCurrent = portfolio.reduce((sum, item) => {
      const stock = stocksData.find(s => s.symbolId === item.symbolId);
      const symbol = stock?.symbol;
      if (!symbol) return sum;
  
      const currentPrice = currentPrices[symbol] || 0;
      return sum + item.stockQuantity * currentPrice;
    }, 0);
  
    const returns = totalCurrent - totalInvested;
    const periodChange = periodStartValue !== null ? totalCurrent - periodStartValue : 0;
    const periodChangePercent = periodStartValue ? ((periodChange / periodStartValue) * 100).toFixed(2) : "0.00";

  return (
    <div style={Object.assign({ marginLeft: "250px", padding: "20px" }, containerStyle)}>
      <div style={backgroundPattern}></div>
      <div className="mb-4">
        <h3 style={{ color: "white", fontWeight: "600", marginBottom: "8px", fontSize: "24px" }}>
          Portfolio Overview
        </h3>
      </div>
      <div className="d-flex justify-content-between gap-4">
        {/* Invested Amount */}
        <div style={statCardStyle}>
          <div style={labelStyle}>Total Invested</div>
          <div style={valueStyle}>
            {loading ? "..." : `$${totalInvested.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
          </div>
          <div style={{ ...subValueStyle, color: "rgba(255, 255, 255, 0.6)" }}>
            Principal Amount
          </div>
        </div>
        {/* Current Value */}
        <div style={statCardStyle}>
          <div style={labelStyle}>Current Value</div>
          <div style={valueStyle}>
            {loading ? "..." : `$${totalCurrent.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
          </div>
          <div style={{ ...subValueStyle, color: "rgba(255, 255, 255, 0.6)" }}>
            Market Value
          </div>
        </div>
        {/* Returns */}
        <div style={statCardStyle}>
          <div style={labelStyle}>Total Returns</div>
          <div style={{ ...valueStyle, color: returns >= 0 ? "#4ade80" : "#ef4444" }}>
            {loading ? "..." : `${returns >= 0 ? "+" : ""}$${returns.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
          </div>
          <div style={{ ...subValueStyle, color: returns >= 0 ? "#4ade80" : "#ef4444" }}>
            {loading ? "..." : `${returns >= 0 ? "+" : ""}${((returns / (totalInvested || 1)) * 100).toFixed(2)}% ${returns >= 0 ? "↗️" : "↘️"}`}
          </div>
        </div>
        {/* Period's Change */}
        <div style={statCardStyle}>
          <div style={labelStyle}>Period's Change</div>
          <div style={{ ...valueStyle, color: periodChange >= 0 ? "#4ade80" : "#ef4444" }}>
            {loading ? "..." : `${periodChange >= 0 ? "+" : ""}$${periodChange.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
          </div>
          <div style={{ ...subValueStyle, color: periodChange >= 0 ? "#4ade80" : "#ef4444" }}>
            {loading ? "..." : `${periodChange >= 0 ? "+" : ""}${periodChangePercent}% ${periodChange >= 0 ? "↗️" : "↘️"}`}
          </div>
        </div>
      </div>
      <div className="mt-3 d-flex justify-content-center">
        <div style={{
          height: "4px",
          width: "60px",
          background: "linear-gradient(90deg, #4ade80, #22c55e)",
          borderRadius: "2px",
          opacity: 0.8
        }}></div>
      </div>
    </div>
  );
}

