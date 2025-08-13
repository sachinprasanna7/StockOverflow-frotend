import React, { useState } from 'react';
import '../styles/OrderCard.css';

const OrderCard = ({ order }) => {
  const [showModal, setShowModal] = useState(false);
  
  const {
    orderId,
    timeOrdered,
    timeCompleted,
    stock: { symbol, companyName },
    orderType,
    stockQuantity,
    transactionAmount,
    orderStatus,
    buy
  } = order;

  const formatDate = (datetime) => {
    const date = new Date(datetime);
    return date.toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
      hour12: false
    });
  };

  const formatTime = (datetime) => {
    const date = new Date(datetime);
    return date.toLocaleString('en-IN', {
      timeStyle: 'short',
      hour12: false
    });
  };

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'status-completed';
      case 'pending':
        return 'status-pending';
      case 'failed':
        return 'status-failed';
      default:
        return 'status-pending';
    }
  };

  const handleCardClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = (e) => {
    e.stopPropagation();
    setShowModal(false);
  };

  const handleModalContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    <>
      <div className="order-card" onClick={handleCardClick}>
        <div className="card-header">
          <div className="stock-info">
            <span className="fw-semibold text-dark me-2 stock-name">
                      {companyName.toUpperCase()}
                    </span>
                    <span className="badge bg-light text-muted small">
                      {symbol.toUpperCase()}
                    </span>
          </div>
          <div className={`order-side ${buy ? 'buy' : 'sell'}`}>
            {buy ? 'BUY' : 'SELL'}
          </div>
        </div>
        
        <div className="card-details">
          <div className="detail-item">
            <span className="detail-label">Quantity</span>
            <span className="detail-value">{stockQuantity.toLocaleString()}</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Amount</span>
            <span className="detail-value">${transactionAmount.toLocaleString()}</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Time</span>
            <span className="detail-value">{formatTime(timeOrdered)}</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Status</span>
            <span className={`status-badge ${getStatusClass(orderStatus)}`}>
              {orderStatus}
            </span>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={handleModalContentClick}>
            <div className="modal-header">
              <button className="modal-close" onClick={handleCloseModal}>
                ×
              </button>
              <h2 className="modal-title">{companyName.toUpperCase()}</h2> 
              
            </div>
            
            <div className="modal-body">
              <div className="info-grid">
                {/* Order Details Section */}
                <div className="info-section">
                  <h3 className="section-title">Order Details</h3>
                  
                  <div className="info-row">
                    <span className="info-label">Order ID</span>
                    <span className="info-value">#{orderId}</span>
                  </div>
                  
                  <div className="info-row">
                    <span className="info-label">Stock Symbol</span>
                    <span className="info-value">{symbol.toUpperCase()}</span>
                  </div>
                  
                  <div className="info-row">
                    <span className="info-label">Order Type</span>
                    <span className="info-value">{orderType}</span>
                  </div>
                  
                  <div className="info-row">
                    <span className="info-label">Side</span>
                    <span className={`info-value ${buy ? 'buy-highlight' : 'sell-highlight'}`}>
                      {buy ? 'BUY' : 'SELL'}
                    </span>
                  </div>
                  
                  <div className="info-row">
                    <span className="info-label">Status</span>
                    <span className={`status-badge ${getStatusClass(orderStatus)}`}>
                      {orderStatus}
                    </span>
                  </div>
                </div>

                {/* Transaction Details Section */}
                <div className="info-section">
                  <h3 className="section-title">Transaction Details</h3>
                  
                  <div className="info-row">
                    <span className="info-label">Quantity</span>
                    <span className="info-value">{stockQuantity.toLocaleString()} shares</span>
                  </div>
                  
                  <div className="info-row">
                    <span className="info-label">Unit Price</span>
                    <span className="info-value">
                      ${(transactionAmount / stockQuantity).toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="info-row">
                    <span className="info-label">Total Amount</span>
                    <span className="info-value amount-highlight">
                      ${transactionAmount.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Timing Details Section */}
                <div className="info-section">
                  <h3 className="section-title">Timing Details</h3>
                  
                  <div className="info-row">
                    <span className="info-label">Order Placed</span>
                    <span className="info-value">{formatDate(timeOrdered)}</span>
                  </div>
                  
                  <div className="info-row">
                    <span className="info-label">Order Completed</span>
                    <span className="info-value">
                      {timeCompleted ? formatDate(timeCompleted) : 'Not completed'}
                    </span>
                  </div>
                  
                  {timeCompleted && (
                    <div className="info-row">
                      <span className="info-label">Processing Time</span>
                      <span className="info-value">
                        {Math.round((new Date(timeCompleted) - new Date(timeOrdered)) / 1000)}s
                      </span>
                    </div>
                  )}
                </div>

                {/* Summary Section */}
                <div className="info-section">
                  <h3 className="section-title">Summary</h3>
                  
                  <div className="info-row">
                    <span className="info-label">Company</span>
                    <span className="info-value">{companyName}</span>
                  </div>
                  
                  <div className="info-row">
                    <span className="info-label">Action</span>
                    <span className={`info-value ${buy ? 'buy-highlight' : 'sell-highlight'}`}>
                      {buy ? 'Purchased' : 'Sold'} {stockQuantity.toLocaleString()} shares
                    </span>
                  </div>
                  
                  <div className="info-row">
                    <span className="info-label">Value</span>
                    <span className="info-value amount-highlight">
                      ${transactionAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderCard;