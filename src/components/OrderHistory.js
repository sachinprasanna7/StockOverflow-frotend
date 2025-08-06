import React, { useEffect, useState } from 'react';
import axios from 'axios';
import OrderCard from '../cards/OrderCard';

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/orders') // Replace with your actual endpoint
      .then(res => setOrders(res.data))
      .catch(err => console.error('Error:', err));
  }, []);

  return (
    <div style={{ marginLeft: "250px", padding: "20px" }}>
      <h2>Order History</h2>
      {orders.map(order => (
        <OrderCard key={order.orderId} order={order} />
      ))}
    </div>
  );
}
