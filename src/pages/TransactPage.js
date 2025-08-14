import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from '../components/Sidebar';
import TimePeriod from '../components/TimePeriod';
import IndexDataRibbon from '../components/IndexDataRibbon';
import axios from "axios";
import '../styles/PortfolioPage.css';

export default function TransactPage() {
  const [error, setError] = useState(null);
  const [tradingBalance, setTradingBalance] = useState({ amount: 0, loading: false });
  const [stockInvestments, setStockInvestments] = useState({ amount: 0, loading: false });
  const [transaction, setTransaction] = useState({ type: 'deposit', amount: '', loading: false });
  const [stocksData, setStocksData] = useState([]);
  const [currentPrices, setCurrentPrices] = useState({});
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);


  // Fetch stock investments
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

      } catch (err) {
        console.error("Error fetching prices:", err);
      }
    };

    fetchCurrentPrices();

    // Fetch every 3s
    intervalId = setInterval(fetchCurrentPrices, 3000);

    return () => clearInterval(intervalId);
  }, [stocksData, portfolio]);
  // const fetchStockInvestments = async () => {
  //   try {
  //     setStockInvestments(prev => ({ ...prev, loading: true }));
  //     const res = await fetch('http://localhost:8080/useraccount/getStockInvestmentsMoney?userId=1');
  //     const data = await res.json();
  //     setStockInvestments({ amount: data.stock_investments_money, loading: false });
  //   } catch (err) {
  //     setError(err.message || 'Failed to load investments');
  //     setStockInvestments(prev => ({ ...prev, loading: false }));
  //   }
  // };

  // Fetch trading balance
  const fetchTradingBalance = async () => {
    try {
      setTradingBalance(prev => ({ ...prev, loading: true }));
      const response = await axios.get('http://localhost:8080/useraccount/getTradingMoney?userId=1');
      setTradingBalance({ amount: response.data.trading_money, loading: false });
    } catch (error) {
      console.error('Error fetching balance:', error);
      setTradingBalance(prev => ({ ...prev, loading: false }));
    }
  };

  // Handle deposit/withdraw
  const handleTransaction = async () => {
    if (!transaction.amount || parseFloat(transaction.amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    const amount = parseFloat(transaction.amount);
    if (transaction.type === 'withdraw' && amount > tradingBalance.amount) {
      alert('Insufficient funds');
      return;
    }
    try {
      setTransaction(prev => ({ ...prev, loading: true }));
      await axios.post('http://localhost:8080/useraccount/updateTradingMoney', null, {
        params: { userId: 1, amount: amount, isDeposit: transaction.type === 'deposit' }
      });
      setTradingBalance(prev => ({
        ...prev,
        amount: transaction.type === 'deposit' ? prev.amount + amount : prev.amount - amount
      }));
      setTransaction({ type: 'deposit', amount: '', loading: false });
      alert(`${transaction.type === 'deposit' ? 'Deposit' : 'Withdrawal'} successful!`);
    } catch (error) {
      console.error('Transaction error:', error);
      alert('Transaction failed. Please try again.');
      setTransaction(prev => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    fetchTradingBalance();
    
  }, []);


  const totalCurrent = portfolio.reduce((sum, item) => {
    const stock = stocksData.find(s => s.symbolId === item.symbolId);
    const symbol = stock?.symbol;
    if (!symbol) return sum;

    const currentPrice = currentPrices[symbol] || 0;
    return sum + item.stockQuantity * currentPrice;
  }, 0);

  return (
    <div className="d-flex min-vh-100 bg-light">
      <Sidebar />
      <div className="flex-grow-1 p-4">
        <TimePeriod />
        <div className="container mt-4 custom-layout">
          {/* Account Balance Card */}
          <div
            className="card shadow-lg border-0 mb-4"
            style={{ borderRadius: '15px', maxWidth: '650px', margin: '0 auto' }}
          >
            <div
              className="card-header d-flex align-items-center"
              style={{
                backgroundColor: '#0d3b66',
                color: '#ffffff',
                fontSize: '1.25rem',
                fontWeight: '600',
                borderTopLeftRadius: '15px',
                borderTopRightRadius: '15px'
              }}
            >
              💰 Account Balance
            </div>
            <div className="card-body text-center">
              <div className="row g-4">
                <div className="col-6 border-end">
                  <h6 className="text-muted">Available Cash</h6>
                  <h3 className="fw-bold text-success">
                    {tradingBalance.loading ? (
                      <div className="spinner-border text-success" role="status"></div>
                    ) : (
                      `$${tradingBalance.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                    )}
                  </h3>
                  <small className="text-muted">Ready to trade</small>
                </div>
                <div className="col-6">
                  <h6 className="text-muted">Stock Investment Assests</h6>
                  <h3 className="fw-bold text-primary">
                    
                    ${totalCurrent.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    
                  </h3>
                  <small className="text-muted">Currently value</small>
                </div>
              </div>
              <hr />
              <h6 className="mt-3">Total Assest</h6>
              <h2 className="fw-bold text-warning">
                ${(tradingBalance.amount + stockInvestments.amount).toLocaleString('en-US', {
                  minimumFractionDigits: 2
                })}
              </h2>
            </div>
          </div>

          {/* Transaction Form */}
          <div
            className="card shadow-lg border-0"
            style={{ borderRadius: '15px', maxWidth: '650px', margin: '0 auto' }}
          >
            <div
              className="card-header"
              style={{
                backgroundColor: '#0d3b66',
                color: '#ffffff',
                fontSize: '1.25rem',
                fontWeight: '600',
                borderTopLeftRadius: '15px',
                borderTopRightRadius: '15px'
              }}
            >
              💳 Add/Withdraw Funds
            </div>
            <div className="card-body">
              {/* Transaction Type */}
              <div className="mb-4 text-center">
                <div className="btn-group w-75" role="group">
                  <input
                    type="radio"
                    className="btn-check"
                    name="transactionType"
                    id="deposit"
                    checked={transaction.type === 'deposit'}
                    onChange={() => setTransaction(prev => ({ ...prev, type: 'deposit' }))}
                  />
                  <label
                    className="btn"
                    style={{
                      backgroundColor: transaction.type === 'deposit' ? '#0d3b66' : '#ffffff',
                      color: transaction.type === 'deposit' ? '#ffffff' : '#0d3b66',
                      border: '1px solid #0d3b66',
                      fontWeight: '500'
                    }}
                    htmlFor="deposit"
                  >
                    ⬆️ Add Money
                  </label>

                  <input
                    type="radio"
                    className="btn-check"
                    name="transactionType"
                    id="withdraw"
                    checked={transaction.type === 'withdraw'}
                    onChange={() => setTransaction(prev => ({ ...prev, type: 'withdraw' }))}
                  />
                  <label
                    className="btn"
                    style={{
                      backgroundColor: transaction.type === 'withdraw' ? '#d9534f' : '#ffffff',
                      color: transaction.type === 'withdraw' ? '#ffffff' : '#d9534f',
                      border: '1px solid #d9534f',
                      fontWeight: '500'
                    }}
                    htmlFor="withdraw"
                  >
                    ⬇️ Withdraw Money
                  </label>
                </div>
              </div>

              {/* Amount Input */}
              <div className="mb-4">
                <label className="form-label fw-semibold">Amount ($)</label>
                <input
                  type="number"
                  className="form-control form-control-lg"
                  placeholder="Enter amount"
                  step="0.01"
                  min="0"
                  value={transaction.amount}
                  onChange={e => setTransaction(prev => ({ ...prev, amount: e.target.value }))}
                  style={{ borderRadius: '10px' }}
                />
                {transaction.type === 'withdraw' && (
                  <small className="text-muted">
                    Available: $
                    {tradingBalance.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </small>
                )}
              </div>

              {/* Submit Button */}
              <button
                className="btn btn-lg w-100"
                style={{
                  backgroundColor: transaction.type === 'deposit' ? '#0d3b66' : '#d9534f',
                  color: '#ffffff',
                  borderRadius: '10px',
                  fontWeight: '500'
                }}
                onClick={handleTransaction}
                disabled={transaction.loading || !transaction.amount}
              >
                {transaction.loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Processing...
                  </>
                ) : (
                  `${transaction.type === 'deposit' ? '💰 Deposit' : '💸 Withdraw'} $${transaction.amount || '0.00'}`
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
