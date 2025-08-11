import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from '../components/Sidebar';
import TimePeriod from '../components/TimePeriod';
import IndexDataRibbon from '../components/IndexDataRibbon';
import axios from 'axios';
import '../styles/PortfolioPage.css'; // Import custom CSS for styling

export default function TransactPage() {
  const [portfolio, setPortfolio] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [tradingBalance, setTradingBalance] = useState({
    amount: 0,
    loading: false
  });

  const [stockInvestments, setStockInvestments] = useState({
    amount: 0,
    loading: false
  });

  const [transaction, setTransaction] = useState({
    type: 'deposit',
    amount: '',
    loading: false
  });

  // Fetch portfolio & calculate stock investments
  const fetchStockInvestments = async () => {
    try {
      setStockInvestments(prev => ({ ...prev, loading: true }));
      const stockInvestmentsRes = await fetch('http://localhost:8080/useraccount/getStockInvestmentsMoney?userId=1');
      const stockInvestmentsData = await stockInvestmentsRes.json();

      setStockInvestments({
        amount: stockInvestmentsData.stock_investments_money,
        loading: false
      });
    
    } catch (err) {
      setError(err.message || 'Failed to load investments');
      setStockInvestments(prev => ({ ...prev, loading: false }));
    }
  };

  // Fetch current trading balance
  const fetchTradingBalance = async () => {
    try {
      setTradingBalance(prev => ({ ...prev, loading: true }));
      const response = await axios.get(
        'http://localhost:8080/useraccount/getTradingMoney?userId=1'
      );
      setTradingBalance({
        amount: response.data.trading_money,
        loading: false
      });
      console.log('Trading Balance:', response.data.trading_money);
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

      await axios.post(
        'http://localhost:8080/useraccount/updateTradingMoney',
        null,
        {
          params: {
            userId: 1,
            amount: amount,
            isDeposit: transaction.type === 'deposit'
          }
        }
      );

      setTradingBalance(prev => ({
        ...prev,
        amount:
          transaction.type === 'deposit'
            ? prev.amount + amount
            : prev.amount - amount
      }));

      setTransaction({
        type: 'deposit',
        amount: '',
        loading: false
      });

      alert(
        `${transaction.type === 'deposit' ? 'Deposit' : 'Withdrawal'} successful!`
      );
    } catch (error) {
      console.error('Transaction error:', error);
      alert('Transaction failed. Please try again.');
      setTransaction(prev => ({ ...prev, loading: false }));
    }
  };

  // Initial load
  useEffect(() => {
    fetchTradingBalance();
    fetchStockInvestments();
  }, []);

  return (
    <div className="d-flex min-vh-100">
      <Sidebar />
      <div className="flex-grow-1 bg-white p-4">
        <TimePeriod />
        <IndexDataRibbon />

        <div className="container d-flex flex-column align-items-center mt-4 custom-layout">
          {/* Balance Card */}
          <div
            className="card border-primary mb-4"
            style={{ maxWidth: '500px', width: '100%' }}
          >
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">💰 Account Balance</h5>
            </div>
            <div className="card-body text-center">
              <div className="row">
                <div className="col-6">
                  <h6 className="text-success">Available Cash</h6>
                  <h4 className="fw-bold">
                    {tradingBalance.loading ? (
                      <div
                        className="spinner-border text-success"
                        role="status"
                      ></div>
                    ) : (
                      `$${tradingBalance.amount.toLocaleString('en-US', {
                        minimumFractionDigits: 2
                      })}`
                    )}
                  </h4>
                  <small className="text-muted">Ready to trade</small>
                </div>
                <div className="col-6">
                  <h6 className="text-primary">Stock Investments</h6>
                  <h4 className="fw-bold">
                    {stockInvestments.loading ? (
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      ></div>
                    ) : (
                      `$${stockInvestments.amount.toLocaleString('en-US', {
                        minimumFractionDigits: 2
                      })}`
                    )}
                  </h4>
                  <small className="text-muted">Currently invested</small>
                </div>
              </div>
              <hr />
              <h6>Total Portfolio Value</h6>
              <h3 className="fw-bold text-warning">
                ${(tradingBalance.amount + stockInvestments.amount).toLocaleString(
                  'en-US',
                  { minimumFractionDigits: 2 }
                )}
              </h3>
            </div>
          </div>

          {/* Transaction Form */}
          <div
            className="card border-success"
            style={{ maxWidth: '500px', width: '100%' }}
          >
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">💳 Add/Withdraw Funds</h5>
            </div>
            <div className="card-body">
              {/* Transaction Type */}
              <div className="mb-3">
                <div className="btn-group w-100" role="group">
                  <input
                    type="radio"
                    className="btn-check"
                    name="transactionType"
                    id="deposit"
                    checked={transaction.type === 'deposit'}
                    onChange={() =>
                      setTransaction(prev => ({ ...prev, type: 'deposit' }))
                    }
                  />
                  <label
                    className="btn btn-outline-success"
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
                    onChange={() =>
                      setTransaction(prev => ({ ...prev, type: 'withdraw' }))
                    }
                  />
                  <label
                    className="btn btn-outline-danger"
                    htmlFor="withdraw"
                  >
                    ⬇️ Withdraw Money
                  </label>
                </div>
              </div>

              {/* Amount Input */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Amount ($)</label>
                <input
                  type="number"
                  className="form-control form-control-lg"
                  placeholder="Enter amount"
                  step="0.01"
                  min="0"
                  value={transaction.amount}
                  onChange={e =>
                    setTransaction(prev => ({
                      ...prev,
                      amount: e.target.value
                    }))
                  }
                />
                {transaction.type === 'withdraw' && (
                  <small className="text-muted">
                    Available: $
                    {tradingBalance.amount.toLocaleString('en-US', {
                      minimumFractionDigits: 2
                    })}
                  </small>
                )}
              </div>

              {/* Submit Button */}
              <button
                className={`btn ${
                  transaction.type === 'deposit'
                    ? 'btn-success'
                    : 'btn-danger'
                } btn-lg w-100`}
                onClick={handleTransaction}
                disabled={transaction.loading || !transaction.amount}
              >
                {transaction.loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                    ></span>
                    Processing...
                  </>
                ) : (
                  `${transaction.type === 'deposit' ? '💰 Deposit' : '💸 Withdraw'} $${
                    transaction.amount || '0.00'
                  }`
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
