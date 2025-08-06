import React from "react";
import { Nav } from "react-bootstrap";

export default function Sidebar() {
  return (
    <div className="d-flex flex-column bg-dark text-white p-3" style={{ width: "250px" }}>
      <div className="text-center mb-4">
        <div className="bg-white rounded-circle mx-auto" style={{ width: "100px", height: "100px" }}>
          {/* Placeholder logo */}
        </div>
        <h5 className="mt-2 text-white">Stock Overflow</h5>
      </div>
      <Nav className="flex-column">
        <Nav.Link className="text-white" href="#">Dashboard</Nav.Link>
        <Nav.Link className="text-white" href="#">Portfolio</Nav.Link>
        <Nav.Link className="text-white" href="#">Orders</Nav.Link>
        <Nav.Link className="text-white" href="#">Transact</Nav.Link>
        <Nav.Link className="text-white" href="#">SIPs</Nav.Link>
        <Nav.Link className="text-white" href="#">Watchlist</Nav.Link>
        <Nav.Link className="text-white" href="#">Settings</Nav.Link>
      </Nav>
    </div>
  );
}
