import React, { useEffect, useState } from "react";
import "./PortfolioPage.css";

export default function PortfolioPage() {
  const [portfolio, setPortfolio] = useState([]);
  const [stocksData, setStocksData] = useState([]); // stock details (symbol, name, etc)
  const [currentPrices, setCurrentPrices] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        // 1. Fetch portfolio holdings
        const portfolioRes = await fetch("http://localhost:8080/portfolio/all");
        const portfolioData = await portfolioRes.json();
        setPortfolio(portfolioData);

        // 2. Extract unique symbolIds
        const symbolIds = [...new Set(portfolioData.map((item) => item.symbolId))];

        // 3. Fetch stock details by symbolId
        const stockDetailsFetches = symbolIds.map((id) =>
          fetch(`http://localhost:8080/api/stock/${id}`).then((res) => {
            if (!res.ok) throw new Error(`Failed to fetch stock ${id}`);
            return res.json();
          })
        );
        const stocksDetails = await Promise.all(stockDetailsFetches);
        setStocksData(stocksDetails);
        console.log("Stocks Details:", stocksDetails);

        // 4. Extract symbols for current price fetch
       } catch (err) {
        setError(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);
  useEffect(() => {
    let intervalId;
  
    async function fetchCurrentPrices() {
      try {
        // Extract symbols from stocksData
        const symbols = stocksData.map(stock => stock.symbol);
  
        // Fetch prices one by one (like your existing logic)
        const priceFetches = symbols.slice(1).map(symbol =>
          fetch(`http://localhost:4000/api/stocks/${symbol}`).then(res => {
            if (!res.ok) throw new Error(`Failed to fetch price for ${symbol}`);
            return res.json().then(data => ({ symbol, data }));
          })
        );
  
        const pricesArray = await Promise.all(priceFetches);
  
        const priceMap = {};
        pricesArray.forEach(({ symbol, data }) => {
          if (data && data.length > 0) {
            priceMap[symbol] = data[0].price;
          } else {
            priceMap[symbol] = 0;
          }
        });
  
        setCurrentPrices(priceMap);
      } catch (err) {
        console.error("Error fetching prices:", err);
      }
    }
  
    if (stocksData.length > 0) {
      // Initial fetch
      fetchCurrentPrices();
  
      // Set interval to fetch every 20ms
      intervalId = setInterval(fetchCurrentPrices, 20);
    }
  
    // Cleanup on unmount
    return () => clearInterval(intervalId);
  }, [stocksData]);
  

  if (loading) return <div>Loading portfolio...</div>;
  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;

  // Build symbolId => stockDetail map for quick lookup
  const symbolIdToStock = {};
  stocksData.forEach((stock) => {
    if (stock && stock.symbolId !== undefined) {
      symbolIdToStock[stock.symbolId] = stock;
    }
  });
  // Build a map symbol => total money invested for that symbol
const investedMap = {};

// Loop over portfolio entries
portfolio.forEach(item => {
  const stockDetail = symbolIdToStock[item.symbolId];
  if (!stockDetail) return;
  const symbol = stockDetail.symbol;

  // Initialize or accumulate
  if (!investedMap[symbol]) {
    investedMap[symbol] = 0;
  }
  investedMap[symbol] += item.moneyInvested * item.stockQuantity;
});
console.log("Invested Map:", investedMap);

  // Calculate total invested (sum of moneyInvested)
  const totalInvested = portfolio.reduce((sum, item) => sum + item.moneyInvested*item.stockQuantity, 0);

  // Calculate total current value (sum of stockQuantity * current price)
  const totalCurrent = portfolio.reduce((sum, item) => {
    // Find symbol for this item's symbolId
    const symbol = stocksData[item.symbolId]?.symbol;
    if (!symbol) return sum; // skip if missing
  
    // Get current price from currentPrices map (default 0)
    const currentPrice = currentPrices[symbol] || 0;
  
    // Add quantity * current price to sum
    return sum + item.stockQuantity * currentPrice;
  }, 0);
  

  const returns = totalCurrent - totalInvested;
  const returnsPercent = totalInvested ? ((returns / totalInvested) * 100).toFixed(2) : 0;

  return (
    <div style={{ marginLeft: "250px", padding: "20px" }}  className="portfolio-container">
      {/* Top Stats */}
      <div className="portfolio-summary">
        <div className="summary-item">
          <h3>Invested</h3>
          <p>₹{totalInvested.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
        <div className="summary-item">
          <h3>Current</h3>
          <p>₹{totalCurrent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
        <div className={`summary-item ${returns >= 0 ? "positive" : "negative"}`}>
          <h3>Returns</h3>
          <p>
            ₹{returns.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({returnsPercent}%)
          </p>
        </div>
      </div>

      {/* Holdings List */}
      <div className="holdings-list">
        {portfolio.map((item, index) => {
          const stockDetail = symbolIdToStock[item.symbolId];
          if (!stockDetail) return null;

          const symbol = stockDetail.symbol;
          const name = stockDetail.name || symbol; // fallback if name missing
          const investedAmt = item.moneyInvested;
          const currentPrice = currentPrices[symbol] || 0;
          const currentAmt = currentPrice * item.stockQuantity;
          const profit = currentAmt - investedAmt;
          const profitPercent = investedAmt ? ((profit / investedAmt) * 100).toFixed(2) : "0.00";

          return (
            <div key={index} className="holding-card">
              <div className="holding-info">
                <h4>{name}</h4>
                <span>{item.stockQuantity} shares</span>
              </div>
              <div className="holding-values">
                <p className={profit >= 0 ? "positive" : "negative"}>
                  ₹{currentAmt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <br />
                  <small>(₹{investedAmt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })})</small>
                </p>
                <p>
                  Profit: <span className={profit >= 0 ? "positive" : "negative"}>
                    ₹{profit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({profitPercent}%)
                  </span>
                </p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="stocks-details-list">
      {/* <h3 className="text-center mb-4">Individual Stocks Details</h3> */}
      {stocksData.map((stock, idx) => {
        const symbol = stock.symbol;
        const stock_id = stock.symbol_id;
        let moneyInvested = 0;
        {portfolio.map((item) => {
          if (item.symbolId === stock_id) { 
            moneyInvested = item.moneyInvested ;
          }
        })}
        const name = stock.name || symbol;
        const companyName = stock.companyName || "Company Name"; // fallback if not available
        const currentPrice = currentPrices[symbol] || 0;

        const investedObj = portfolio.find((p) => symbolIdToStock[p.symbolId]?.symbol === symbol);
        const invested = investedObj ? investedObj.moneyInvested : 0;


        return (
          <div key={idx} className="stock-detail-card">
            <div className="stock-info-left">
            <div className="company-name">{companyName}</div>

              <div className="stock-name">{name}</div>
            </div>
            <div className="price-invested-right">
            <div className="current-price"
                style={{ color: currentPrice > moneyInvested ? "green" : "red" }}
              >
                ₹{currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="money-invested">
                (₹{moneyInvested.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
              </div>        
                  </div>
          </div>
        );
      })}
    </div>


    </div>
  );

}
