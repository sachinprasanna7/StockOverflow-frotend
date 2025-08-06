import React, { useState, useRef, useEffect } from "react";
import { Form, InputGroup } from "react-bootstrap";
import { FaSearch, FaTimes, FaClock } from "react-icons/fa";

export default function SearchBar() {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef(null);

  // Sample search results - replace with your actual search logic
  const sampleResults = [
    { symbol: "AAPL", name: "Apple Inc.", price: "$173.50", change: "+2.34%" },
    { symbol: "GOOGL", name: "Alphabet Inc.", price: "$2,734.23", change: "+1.87%" },
    { symbol: "TSLA", name: "Tesla Inc.", price: "$248.42", change: "-0.56%" },
    { symbol: "MSFT", name: "Microsoft Corp.", price: "$378.91", change: "+0.92%" },
    { symbol: "AMZN", name: "Amazon.com Inc.", price: "$3,094.67", change: "+1.23%" }
  ];

  const recentSearches = ["AAPL", "GOOGL", "TSLA", "NVDA"];

  const filteredResults = searchQuery 
    ? sampleResults.filter(stock => 
        stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stock.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleSearchFocus = () => {
    setIsSearchActive(true);
  };

  const handleCloseSearch = () => {
    setIsSearchActive(false);
    setSearchQuery("");
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Close search on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        handleCloseSearch();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const normalSearchStyle = {
    borderRadius: "12px",
    border: "2px solid #e9ecef",
    transition: "all 0.3s ease",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)"
  };

  const overlaySearchStyle = {
    position: "fixed",
    top: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    width: "90%",
    maxWidth: "600px",
    zIndex: 1050,
    borderRadius: "16px",
    border: "2px solid #113F67",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
    backgroundColor: "white"
  };

  const backdropStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    backdropFilter: "blur(8px)",
    zIndex: 1040,
    transition: "all 0.3s ease"
  };

  const searchInputStyle = {
    border: "none",
    fontSize: "18px",
    padding: "16px 20px",
    borderRadius: isSearchActive ? "16px 0 0 16px" : "12px 0 0 12px",
    outline: "none",
    boxShadow: "none"
  };

  const searchButtonStyle = {
    backgroundColor: "#113F67",
    border: "2px solid #113F67",
    borderLeft: "none",
    borderRadius: isSearchActive ? "0 16px 16px 0" : "0 12px 12px 0",
    padding: "16px 20px",
    transition: "all 0.3s ease"
  };

  const resultsContainerStyle = {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderRadius: "0 0 16px 16px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
    maxHeight: "400px",
    overflowY: "auto",
    zIndex: 1051
  };

  const resultItemStyle = {
    padding: "12px 20px",
    borderBottom: "1px solid #f1f3f4",
    cursor: "pointer",
    transition: "background-color 0.2s ease"
  };

  return (
     <div  style={{ marginLeft: "250px", padding: "20px" }}>
      {/* Backdrop */}
      {isSearchActive && <div style={backdropStyle} onClick={handleCloseSearch}></div>}
      
      {/* Search Bar */}
      <div style={isSearchActive ? overlaySearchStyle : normalSearchStyle} className="mb-4 position-relative">
        <InputGroup>
          <Form.Control
            ref={searchInputRef}
            type="text"
            placeholder="Search stocks, ETFs, cryptocurrencies..."
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={handleSearchFocus}
            style={searchInputStyle}
          />
          <InputGroup.Text 
            style={searchButtonStyle}
            className={isSearchActive ? "" : ""}
          >
            {isSearchActive ? (
              <FaTimes 
                style={{ color: "white", cursor: "pointer" }} 
                onClick={handleCloseSearch}
              />
            ) : (
              <FaSearch style={{ color: "white" }} />
            )}
          </InputGroup.Text>
        </InputGroup>

        {/* Search Results */}
        {isSearchActive && (
          <div style={resultsContainerStyle}>
            {searchQuery === "" ? (
              // Recent Searches
              <div style={{ padding: "20px" }}>
                <div style={{ 
                  color: "#6c757d", 
                  fontSize: "14px", 
                  fontWeight: "600", 
                  marginBottom: "12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}>
                  <FaClock /> Recent Searches
                </div>
                {recentSearches.map((search, index) => (
                  <div
                    key={index}
                    style={{
                      ...resultItemStyle,
                      border: "none",
                      padding: "8px 16px",
                      backgroundColor: "#f8f9fa",
                      borderRadius: "8px",
                      margin: "4px 0",
                      fontSize: "14px"
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = "#e9ecef"}
                    onMouseLeave={(e) => e.target.style.backgroundColor = "#f8f9fa"}
                  >
                    {search}
                  </div>
                ))}
              </div>
            ) : filteredResults.length > 0 ? (
              // Search Results
              <>
                <div style={{ 
                  padding: "16px 20px 8px", 
                  color: "#6c757d", 
                  fontSize: "14px", 
                  fontWeight: "600",
                  borderBottom: "1px solid #f1f3f4"
                }}>
                  Search Results ({filteredResults.length})
                </div>
                {filteredResults.map((stock, index) => (
                  <div
                    key={index}
                    style={resultItemStyle}
                    onMouseEnter={(e) => e.target.style.backgroundColor = "#f8f9fa"}
                    onMouseLeave={(e) => e.target.style.backgroundColor = "white"}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <div style={{ fontWeight: "600", fontSize: "16px", color: "#113F67" }}>
                          {stock.symbol}
                        </div>
                        <div style={{ fontSize: "14px", color: "#6c757d" }}>
                          {stock.name}
                        </div>
                      </div>
                      <div className="text-end">
                        <div style={{ fontWeight: "600", fontSize: "16px" }}>
                          {stock.price}
                        </div>
                        <div style={{ 
                          fontSize: "14px", 
                          color: stock.change.startsWith('+') ? "#22c55e" : "#ef4444",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-end",
                          gap: "4px"
                        }}>
                          <FaClock size={12} />
                          {stock.change}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              // No Results
              <div style={{ 
                padding: "40px 20px", 
                textAlign: "center", 
                color: "#6c757d" 
              }}>
                <div style={{ fontSize: "18px", marginBottom: "8px" }}>📊</div>
                <div style={{ fontWeight: "500" }}>No results found</div>
                <div style={{ fontSize: "14px" }}>Try searching for a different stock symbol or company name</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}