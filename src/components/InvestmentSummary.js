import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

export default function InvestmentSummary() {
  const [totalInvested, setTotalInvested] = useState(0);
  const [currentValue, setCurrentValue] = useState(0);
  const [totalReturns, setTotalReturns] = useState(0);
  const [periodChange, setPeriodChange] = useState({ value: 0, percent: 0 });
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper to get current period number
  function getCurrentPeriod() {
    const now = new Date();
    const totalSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
    return Math.floor(totalSeconds / 20) + 1;
  }

  // Store period start prices for change calculation
  const periodStartPricesRef = useRef({});

  // Fetch all required data
  useEffect(() => {
    let interval;
    async function fetchAllData() {
      setLoading(true);
      try {
        // 1. Get total invested
        const investedRes = await axios.get("http://localhost:8080/useraccount/getStockInvestmentsMoney", {
          params: { userId: 1 }
        });
        setTotalInvested(investedRes.data.stock_investments_money || 0);

        // 2. Get portfolio holdings
        const holdingsRes = await axios.get("http://localhost:8080/portfolio/all");
        const holdingsData = holdingsRes.data || [];
        setHoldings(holdingsData);

        // 3. For each holding, get latest price and period start price
        let totalCurrent = 0;
        let totalPeriodStart = 0;
        let periodPrices = {};

        const currentPeriod = getCurrentPeriod();

        await Promise.all(
          holdingsData.map(async (holding) => {
            // Get symbol for this symbolId
            const stockInfoRes = await axios.get(`http://localhost:8080/api/stock/${holding.symbolId}`);
            const symbol = stockInfoRes.data.symbol;

            // Get latest price
            const latestPriceRes = await axios.get(
              `https://marketdata.neueda.com/API/StockFeed/GetStockPricesForSymbol/${symbol}`
            );
            const latestPrice = latestPriceRes.data[0]?.price || 0;

            // Get period start price (first price for current period)
            const periodStartRes = await axios.get(
              `https://marketdata.neueda.com/API/StockFeed/GetStockPricesForSymbol/${symbol}?HowManyValues=20`
            );
            const periodStartPriceObj = periodStartRes.data.find(
              (item) => item.periodNumber === currentPeriod
            );
            const periodStartPrice = periodStartPriceObj ? periodStartPriceObj.price : latestPrice;
            periodPrices[symbol] = periodStartPrice;

            totalCurrent += latestPrice * holding.stockQuantity;
            totalPeriodStart += periodStartPrice * holding.stockQuantity;
          })
        );

        setCurrentValue(totalCurrent);
        setTotalReturns(totalCurrent - (investedRes.data.stock_investments_money || 0));
        setPeriodChange({
          value: totalCurrent - totalPeriodStart,
          percent: totalPeriodStart > 0 ? ((totalCurrent - totalPeriodStart) / totalPeriodStart) * 100 : 0
        });
      } catch (err) {
        setTotalInvested(0);
        setCurrentValue(0);
        setTotalReturns(0);
        setPeriodChange({ value: 0, percent: 0 });
      } finally {
        setLoading(false);
      }
    }

    fetchAllData();
    interval = setInterval(fetchAllData, 20000);

    return () => clearInterval(interval);
  }, []);

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
            Principal amount
          </div>
        </div>
        {/* Current Value */}
        <div style={statCardStyle}>
          <div style={labelStyle}>Current Value</div>
          <div style={valueStyle}>
            {loading ? "..." : `$${currentValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
          </div>
          <div style={{ ...subValueStyle, color: "rgba(255, 255, 255, 0.6)" }}>
            Market value
          </div>
        </div>
        {/* Returns */}
        <div style={statCardStyle}>
          <div style={labelStyle}>Total Returns</div>
          <div style={{ ...valueStyle, color: totalReturns >= 0 ? "#4ade80" : "#ef4444" }}>
            {loading ? "..." : `${totalReturns >= 0 ? "+" : ""}$${totalReturns.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
          </div>
          <div style={{ ...subValueStyle, color: totalReturns >= 0 ? "#4ade80" : "#ef4444" }}>
            {loading ? "..." : `${totalReturns >= 0 ? "+" : ""}${((totalReturns / (totalInvested || 1)) * 100).toFixed(2)}% ${totalReturns >= 0 ? "↗️" : "↘️"}`}
          </div>
        </div>
        {/* Period's Change */}
        <div style={statCardStyle}>
          <div style={labelStyle}>Period's Change</div>
          <div style={{ ...valueStyle, color: periodChange.value >= 0 ? "#4ade80" : "#ef4444" }}>
            {loading ? "..." : `${periodChange.value >= 0 ? "+" : ""}$${periodChange.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
          </div>
          <div style={{ ...subValueStyle, color: periodChange.value >= 0 ? "#4ade80" : "#ef4444" }}>
            {loading ? "..." : `${periodChange.value >= 0 ? "+" : ""}${periodChange.percent.toFixed(2)}% ${periodChange.value >= 0 ? "↗️" : "↘️"}`}
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

