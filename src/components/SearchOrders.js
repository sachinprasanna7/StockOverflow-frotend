import React, { useState, useEffect, useRef } from "react";
import { InputGroup, FormControl } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import * as axios from "axios";
import OrderCard from "../cards/OrderCard"; // Adjust path if needed

export default function SearchOrders() {
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const searchBarRef = useRef(null);

  // Fetch all orders on component mount
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:8080/orders");
        setOrders(response.data);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      }
    };
    fetchOrders();
  }, []);

  // Fetch search results when searchQuery changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    const fetchSearchResults = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get("http://localhost:8080/orders/search", {
          params: { name: searchQuery.trim() },
        });
        setSearchResults(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch search results");
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimeout = setTimeout(() => {
      fetchSearchResults();
    }, 300);

    return () => clearTimeout(debounceTimeout);
  }, [searchQuery]);

  // Close search results if clicked outside search area (optional UX)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target)) {
        // Optionally clear search input or just keep it
        // setSearchQuery("");
        // setSearchResults([]);
        // Or do nothing to keep showing results
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Determine what to display
  const isSearching = searchQuery.trim().length > 0;
  const hasResults = searchResults.length > 0;
  const ordersToDisplay = isSearching ? (hasResults ? searchResults : []) : orders;

  return (
    <div
      style={{
        marginLeft: "250px",
        padding: "20px",
        position: "relative",
        zIndex: 100,
        maxWidth: "800px",
      }}
      ref={searchBarRef}
    >
  <InputGroup className="mb-3" style={{ width: "100%" }}>
  <InputGroup.Text>
    <FaSearch />
  </InputGroup.Text>
  <FormControl
    placeholder="Search by stock name or symbol"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    style={{ width: "100%" }}
  />
</InputGroup>
      

      {isLoading && (
        <div style={{ padding: "20px", color: "#6c757d" }}>Loading...</div>
      )}

      {error && (
        <div style={{ padding: "20px", color: "#ef4444" }}>{error}</div>
      )}

      {isSearching && !hasResults && !isLoading && (
        <div style={{ padding: "20px", color: "#6c757d" }}>No results found.</div>
      )}

      {ordersToDisplay.map((order) => (
        <OrderCard key={order.orderId} order={order} />
      ))}
    </div>
  );
}
