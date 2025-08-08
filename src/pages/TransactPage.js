import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from '../components/Sidebar';
import TimePeriod from '../components/TimePeriod';
import IndexDataRibbon from '../components/IndexDataRibbon';

export default function TransactPage() {
  // State for account balance
  const [accountBalance, setAccountBalance] = useState({
    tradingMoney: 25750.50,
    stockInvestments: 18420.75,
    loading: false
  });

  // State for transaction
  const [transaction, setTransaction] = useState({
    type: 'deposit', // 'deposit' or 'withdraw'
    amount: '',
    loading: false
  });

  // Fetch current balance from backend
  const fetchBalance = async () => {
    try {
      setAccountBalance(prev => ({ ...prev, loading: true }));
      
      // Replace with your actual API call
      // const response = await fetch('/api/account/balance');
      // const data = await response.json();
      // setAccountBalance({
      //   tradingMoney: data.trading_account_money,
      //   stockInvestments: data.stock_investments_money,
      //   loading: false
      // });
      
      // Simulated API delay
      setTimeout(() => {
        setAccountBalance(prev => ({ ...prev, loading: false }));
      }, 1000);
      
    } catch (error) {
      console.error('Error fetching balance:', error);
      setAccountBalance(prev => ({ ...prev, loading: false }));
    }
  };

  // Handle deposit/withdraw
  const handleTransaction = async () => {
    if (!transaction.amount || parseFloat(transaction.amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    const amount = parseFloat(transaction.amount);
    
    // Check withdrawal limit
    if (transaction.type === 'withdraw' && amount > accountBalance.tradingMoney) {
      alert('Insufficient funds');
      return;
    }

    try {
      setTransaction(prev => ({ ...prev, loading: true }));
      
      // Replace with your actual API call
      // const response = await fetch('/api/account/update-trading-money', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     type: transaction.type,
      //     amount: amount
      //   })
      // });
      
      // Simulate API call
      setTimeout(() => {
        // Update balance locally
        setAccountBalance(prev => ({
          ...prev,
          tradingMoney: transaction.type === 'deposit' 
            ? prev.tradingMoney + amount 
            : prev.tradingMoney - amount
        }));

        // Reset form
        setTransaction({
          type: 'deposit',
          amount: '',
          loading: false
        });

        alert(`${transaction.type === 'deposit' ? 'Deposit' : 'Withdrawal'} successful!`);
      }, 1500);
      
    } catch (error) {
      console.error('Transaction error:', error);
      alert('Transaction failed. Please try again.');
      setTransaction(prev => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  return (
    <div className="d-flex min-vh-100">
  <Sidebar />
  <div className="flex-grow-1 bg-white p-4">
    <TimePeriod />
    <IndexDataRibbon />

    {/* Centered container */}
    <div className="container d-flex flex-column align-items-center mt-4">

      {/* Balance Display */}
      <div className="card border-primary mb-4" style={{ maxWidth: '500px', width: '100%' }}>
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">💰 Account Balance</h5>
        </div>
        <div className="card-body text-center">
          <div className="row">
            <div className="col-6">
              <h6 className="text-success">Available Cash</h6>
              <h4 className="fw-bold">
                {accountBalance.loading ? (
                  <div className="spinner-border text-success" role="status"></div>
                ) : (
                  `$${accountBalance.tradingMoney.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                )}
              </h4>
              <small className="text-muted">Ready to trade</small>
            </div>
            <div className="col-6">
              <h6 className="text-primary">Stock Investments</h6>
              <h4 className="fw-bold">
                {accountBalance.loading ? (
                  <div className="spinner-border text-primary" role="status"></div>
                ) : (
                  `$${accountBalance.stockInvestments.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                )}
              </h4>
              <small className="text-muted">Currently invested</small>
            </div>
          </div>
          <hr />
          <h6>Total Portfolio Value</h6>
          <h3 className="fw-bold text-warning">
            ${(accountBalance.tradingMoney + accountBalance.stockInvestments).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </h3>
        </div>
      </div>

      {/* Transaction Form */}
      <div className="card border-success" style={{ maxWidth: '500px', width: '100%' }}>
        <div className="card-header bg-success text-white">
          <h5 className="mb-0">💳 Add/Withdraw Funds</h5>
        </div>
        <div className="card-body">
          {/* Transaction Type Toggle */}
          <div className="mb-3">
            <div className="btn-group w-100" role="group">
              <input 
                type="radio" 
                className="btn-check" 
                name="transactionType" 
                id="deposit"
                checked={transaction.type === 'deposit'}
                onChange={() => setTransaction(prev => ({ ...prev, type: 'deposit' }))}
              />
              <label className="btn btn-outline-success" htmlFor="deposit">
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
              <label className="btn btn-outline-danger" htmlFor="withdraw">
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
              onChange={(e) => setTransaction(prev => ({ ...prev, amount: e.target.value }))}
            />
            {transaction.type === 'withdraw' && (
              <small className="text-muted">
                Available: ${accountBalance.tradingMoney.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </small>
            )}
          </div>

          {/* Submit Button */}
          <button 
            className={`btn ${transaction.type === 'deposit' ? 'btn-success' : 'btn-danger'} btn-lg w-100`}
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