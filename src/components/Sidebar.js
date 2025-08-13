import React from "react";
import { Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";  // <-- import NavLink
import logo from "../assets/stock-overflow-logo.jpeg"; 
import bullBear from "../assets/bull-bear.png"; 

export default function Sidebar() {
  const sidebarStyle = {
    width: "250px",
    backgroundColor: "#113F67",
    height: "100vh", 
    position: "fixed",
    top: 0,
    left: 0,
    display: "flex",
    flexDirection: "column",
    zIndex: 1000
  };

  const navLinkStyle = {
    color: "white",
    padding: "12px 16px",
    borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
    fontSize: "14px",
    fontWeight: "500",
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    transition: "all 0.3s ease",
  };

  const navLinkActiveStyle = {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingLeft: "20px",
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

  // Navigation items with routes
  const navItems = [
    { name: "Dashboard", icon: "📊", path: "/dashboard" },
    { name: "Portfolio", icon: "💼", path: "/portfolio" },
    { name: "Orders", icon: "📋", path: "/order-history" },
    { name: "Transact", icon: "💳", path: "/transact" },
    { name: "Watchlist", icon: "👁️", path: "/watchlists" },
    { name: "Settings", icon: "⚙️", path: "/settings" },
    { name: "Chat With Us", icon: "❓", path: "/help" }  
  ];

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
      <div style={{ flex: 1, overflowY: "auto", marginBottom: "20px" }}>
        <Nav className="flex-column">
          {navItems.map(({ name, icon, path }, index) => (
            <NavLink
              key={index}
              to={path}
              style={({ isActive }) =>
                isActive
                  ? { ...navLinkStyle, ...navLinkActiveStyle }
                  : navLinkStyle
              }
              end
            >
              <span style={{ marginRight: "10px" }}>{icon}</span>
              {name}
            </NavLink>
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