import React, { useEffect, useState } from 'react';
import * as axios from "axios";
import OrderCard from '../cards/OrderCard';
import WebFont from 'webfontloader';
import '../styles/OrderHistory.css'; // Assuming you have a CSS file for styles

WebFont.load({
  google: {
    families: ['Mozilla Headline:200-700']
  }
});

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/orders')
      .then(res => {
        setOrders(res.data);
        console.log('Fetched orders:', res.data);
        setFilteredOrders(res.data);
      })
      .catch(err => console.error('Error:', err));
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredOrders(orders);
      return;
    }

    const filtered = orders.filter(order => {
      const symbol = order.stock?.symbol?.toLowerCase() || "";
      const companyName = order.stock?.companyName?.toLowerCase() || "";
      const query = searchQuery.toLowerCase();
      return symbol.includes(query) || companyName.includes(query);
    });

    setFilteredOrders(filtered);
  }, [searchQuery, orders]);

  const alertInfoStyle = {
    backgroundColor: '#d1ecf1',
    color: '#0c5460',
    border: '1px solid #bee5eb',
    textAlign: 'center',
    padding: '15px 20px',
    borderRadius: '6px',
    maxWidth: '400px',
    width: '100%'
  };


  return (
    <div style={{ marginLeft: "250px", padding: "20px", width: `calc(100vw - 300px)`, boxSizing: 'border-box' }}>

      <h2 className="page-title">Order History</h2>

      <input
        type="text"
        placeholder="Search by stock symbol or name..."
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        className="search-input"
      />

      {filteredOrders.length === 0 ? (
        <p className="no-orders-message">No orders found.</p>
      ) : (
        filteredOrders.map(order => (
          <OrderCard key={order.orderId} order={order} />
        ))
      )}
    </div>
  );
}
