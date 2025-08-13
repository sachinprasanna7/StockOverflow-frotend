import React, { useState, useRef, useEffect } from "react";
import { Form, InputGroup } from "react-bootstrap";
import { FaSearch, FaTimes, FaClock } from "react-icons/fa";
import  axios from "axios";
import { useNavigate } from "react-router-dom";

export default function SearchBar({ onStockSelect }) {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [loading, setLoading] = useState(false);
  const searchInputRef = useRef(null);
  const debounceTimeout = useRef(null);

  // Debounced API search
  useEffect(() => {
    if (!searchQuery) {
      setSearchResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/stock/search", {
          params: { query: searchQuery }
        });
        console.log(res.data);
        for (let stock of res.data) {
          stock.symbol = stock.symbol.toUpperCase();
        }
        setSearchResults(res.data || []);
      } catch (err) {
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    }, 350); // 350ms debounce
    return () => clearTimeout(debounceTimeout.current);
  }, [searchQuery]);

  const handleSearchFocus = () => {
    setIsSearchActive(true);
  };

  const handleCloseSearch = () => {
    setIsSearchActive(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // // Handle stock selection
  // const handleStockClick = async (stock) => {

  //   // navigate to the stocks page

  //   if (onStockSelect) {
  //     // Optionally fetch price here if needed
  //     onStockSelect(stock);
  //   }
  //   setRecentSearches(prev => {
  //     const filtered = prev.filter(item => item.symbol !== stock.symbol);
  //     return [stock, ...filtered].slice(0, 4);
  //   });
  //   handleCloseSearch();
  // };

  const navigate = useNavigate();

 // SearchBar.js
const handleStockClick = (stock) => {
  const symbolLower = stock.symbol.toLowerCase();

  navigate(`/stock/${symbolLower}`, { state: { stock } });
  handleCloseSearch();
};

  const handleRecentSearchClick = (recentStock) => {
    if (onStockSelect) {
      onStockSelect(recentStock);
    }
    handleCloseSearch();
  };

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
    <div style={{ marginLeft: "250px", padding: "20px" }}>
      {isSearchActive && <div style={backdropStyle} onClick={handleCloseSearch}></div>}
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
          <InputGroup.Text style={searchButtonStyle}>
            {isSearchActive ? (
              <FaTimes style={{ color: "white", cursor: "pointer" }} onClick={handleCloseSearch} />
            ) : (
              <FaSearch style={{ color: "white" }} />
            )}
          </InputGroup.Text>
        </InputGroup>

        {isSearchActive && (
          <div style={resultsContainerStyle}>
            {searchQuery === "" ? (
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
                  <FaClock /> {recentSearches.length > 0 ? "Recent Searches" : "Popular Searches"}
                </div>
                {recentSearches.length > 0 ? (
                  recentSearches.map((recentStock, index) => (
                    <div
                      key={index}
                      style={{
                        ...resultItemStyle,
                        border: "none",
                        padding: "12px 16px",
                        backgroundColor: "#f8f9fa",
                        borderRadius: "8px",
                        margin: "4px 0",
                        fontSize: "14px"
                      }}
                      onMouseEnter={e => e.target.style.backgroundColor = "#e9ecef"}
                      onMouseLeave={e => e.target.style.backgroundColor = "#f8f9fa"}
                      onClick={() => handleRecentSearchClick(recentStock)}
                    >
                      <div>
                        <div style={{ fontWeight: "600", color: "#113F67" }}>
                          {recentStock.symbol}
                        </div>
                        <div style={{ fontSize: "12px", color: "#6c757d" }}>
                          {recentStock.companyName}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  // Show popular suggestions when no recent searches
                  ["AAPL", "GOOGL", "GS", "NVDA"].map((symbol, index) => (
                    <div
                      key={index}
                      style={{
                        ...resultItemStyle,
                        border: "none",
                        padding: "12px 16px",
                        backgroundColor: "#f8f9fa",
                        borderRadius: "8px",
                        margin: "4px 0",
                        fontSize: "14px"
                      }}
                      onMouseEnter={e => e.target.style.backgroundColor = "#e9ecef"}
                      onMouseLeave={e => e.target.style.backgroundColor = "#f8f9fa"}
                      onClick={() => handleStockClick({ symbol, companyName: symbol })}
                    >
                      <div>
                        <div style={{ fontWeight: "600", color: "#113F67" }}>
                          {symbol}
                        </div>
                        <div style={{ fontSize: "12px", color: "#6c757d" }}>
                          {symbol}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : loading ? (
              <div style={{ padding: "40px 20px", textAlign: "center", color: "#6c757d" }}>
                <div style={{ fontSize: "18px", marginBottom: "8px" }}>🔎</div>
                <div style={{ fontWeight: "500" }}>Searching...</div>
              </div>
            ) : searchResults.length > 0 ? (
              <>
                <div style={{
                  padding: "16px 20px 8px",
                  color: "#6c757d",
                  fontSize: "14px",
                  fontWeight: "600",
                  borderBottom: "1px solid #f1f3f4"
                }}>
                  Search Results ({searchResults.length})
                </div>
                {searchResults.map((stock, index) => (
                  <div
                    key={index}
                    style={resultItemStyle}
                    onMouseEnter={e => e.target.style.backgroundColor = "#f8f9fa"}
                    onMouseLeave={e => e.target.style.backgroundColor = "white"}
                    onClick={() => handleStockClick(stock)}
                  >
                    <div>
                      <div style={{ fontWeight: "600", fontSize: "16px", color: "#113F67" }}>
                        {stock.symbol}
                      </div>
                      <div style={{ fontSize: "14px", color: "#6c757d" }}>
                        {stock.companyName}
                      </div>
                    </div>
                  </div>
                ))}
              </>
            ) : (
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