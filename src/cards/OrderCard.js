import React from 'react';

const OrderCard = ({ order }) => {
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

  return (
    <div style={styles.card}>
      <div style={styles.left}>
        <p><strong>Order ID:</strong> {orderId}</p>
        <p><strong>Stock:</strong> {symbol} ({companyName})</p>
        <p><strong>Quantity:</strong> {stockQuantity}</p>
        <p><strong>Type:</strong> {orderType}</p>
        <p><strong>Status:</strong> {orderStatus}</p>
      </div>
      <div style={styles.right}>
        <p><strong>Amount:</strong> ₹{transactionAmount.toLocaleString()}</p>
        <p><strong>Side:</strong> <span style={{ color: buy ? 'green' : 'red' }}>{buy ? 'BUY' : 'SELL'}</span></p>
        <p><strong>Ordered:</strong> {formatDate(timeOrdered)}</p>
        <p><strong>Completed:</strong> {timeCompleted ? formatDate(timeCompleted) : '-'}</p>
      </div>
    </div>
  );
};

const styles = {
  card: {
    display: 'flex',
    justifyContent: 'space-between',
    background: '#f0f4f8',
    padding: '12px 16px',
    borderRadius: '10px',
    marginBottom: '12px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
  },
  left: {
    flex: 1,
    fontSize: '0.9rem',
    lineHeight: '1.5'
  },
  right: {
    flex: 1,
    fontSize: '0.9rem',
    lineHeight: '1.5'
  }
};

export default OrderCard;
