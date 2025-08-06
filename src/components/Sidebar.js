import React from "react";
import { Nav } from "react-bootstrap";
import logo from "../assets/stock-overflow-logo.jpeg"; // Import image
import bullBear from "../assets/bull-bear.png"; 

export default function Sidebar() {
  const sidebarStyle = {
    width: "250px",
    backgroundColor: "#113F67",
    height: "100vh",   // full viewport height
    position: "fixed", // stays fixed when scrolling
    top: 0,
    left: 0,
    display: "flex",
    flexDirection: "column",
    zIndex: 1000       // ensures sidebar is above content if needed
  };
  

  const navLinkStyle = {
    color: "white",
    padding: "12px 16px",
    borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
    transition: "all 0.3s ease",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "500"
  };

  const navLinkHoverStyle = {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingLeft: "20px"
  };

  const logoContainerStyle = {
    width: "80px",
    height: "80px",
    backgroundColor: "white",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)"
  };

  const bottomImageStyle = {
  position: "sticky", 
  bottom: 0,
  left: 0,
  width: "100%",       
  height: "200px",  
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
};


  return (
    <div className="d-flex flex-column text-white p-3" style={sidebarStyle}>
      {/* Logo Section */}
      <div className="text-center mb-4">
        <div style={logoContainerStyle}>
          <img 
            src={logo} 
            alt="Stock Overflow Logo" 
            className="img-fluid rounded-circle" 
            style={{ width: "70px", height: "70px", objectFit: "cover" }}
          />
        </div>
        <h5 className="mt-3 mb-0 text-white" style={{ fontWeight: "600", fontSize: "18px" }}>
          Stock Overflow
        </h5>
        <small style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "12px" }}>
          Trading Platform
        </small>
      </div>

      {/* Navigation Links */}
     {/* Scrollable Navigation Section */}
<div style={{ flex: 1, overflowY: "auto", marginBottom: "20px" }}>
  <Nav className="flex-column">
    {[
      { name: "Dashboard", icon: "📊" },
      { name: "Portfolio", icon: "💼" },
      { name: "Orders", icon: "📋" },
      { name: "Transact", icon: "💳" },
      { name: "SIPs", icon: "🔄" },
      { name: "Watchlist", icon: "👁️" },
      { name: "Settings", icon: "⚙️" }
    ].map((item, index) => (
      <Nav.Link
        key={index}
        href="#"
        style={navLinkStyle}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = navLinkHoverStyle.backgroundColor;
          e.target.style.paddingLeft = navLinkHoverStyle.paddingLeft;
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = "transparent";
          e.target.style.paddingLeft = "16px";
        }}
      >
        <span style={{ marginRight: "10px" }}>{item.icon}</span>
        {item.name}
      </Nav.Link>
    ))}
  </Nav>
</div>

      {/* Bottom Image Placeholder */}
      <div style={bottomImageStyle}>
        <img 
          src={bullBear} 
          alt="Bull and Bear" 
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
    </div>
  );
}