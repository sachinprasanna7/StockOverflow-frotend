import React, { useEffect, useState } from 'react';
import axios from 'axios';
import OrderCard from '../cards/OrderCard';
import WebFont from 'webfontloader';
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

  return (
    <div style={{ marginLeft: "250px", padding: "20px", width: `calc(100vw - 300px)`, boxSizing: 'border-box' }}>
      
      <h2 
        style={{
          textAlign: "center",
          fontFamily: "'Mozilla Headline', sans-serif'",
          fontWeight: "900",
          fontSize: "2.9rem",
          marginBottom: "30px",
          color: "#113F67"
        }}
      >
        Order History
      </h2>

      <input
        type="text"
        placeholder="Search by stock symbol or name..."
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        style={{
          width: "100%",
          padding: "12px 16px",
          fontSize: "18px",
          borderRadius: "10px",
          border: "1.5px solid #113F67",
          boxSizing: "border-box",
          marginBottom: "25px",
          boxShadow: "0 2px 6px rgba(17, 63, 103, 0.15)",
          transition: "border-color 0.3s ease, box-shadow 0.3s ease",
          outline: "none",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        }}
        onFocus={e => {
          e.target.style.borderColor = "#0b2a4d";
          e.target.style.boxShadow = "0 4px 12px rgba(11, 42, 77, 0.3)";
        }}
        onBlur={e => {
          e.target.style.borderColor = "#113F67";
          e.target.style.boxShadow = "0 2px 6px rgba(17, 63, 103, 0.15)";
        }}
      />

      {filteredOrders.length === 0 ? (
        <p style={{ textAlign: "center", color: "#6c757d", fontSize: "1.1rem" }}>No orders found.</p>
      ) : (
        filteredOrders.map(order => (
          <OrderCard key={order.orderId} order={order} />
        ))
      )}
    </div>
  );
}
