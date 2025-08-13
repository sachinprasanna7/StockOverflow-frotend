import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SearchOrders from "../components/SearchOrders";
import axios from "axios";
import OrderCard from "../cards/OrderCard"; // Make sure path matches

jest.mock("axios");
jest.mock("../cards/OrderCard", () => ({ order }) => (
  <div data-testid="order-card">{order.stockName || order.symbol}</div>
));

describe("SearchOrders Component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders all orders on mount", async () => {
    const orders = [
      { orderId: 1, stockName: "AAPL" },
      { orderId: 2, stockName: "GOOGL" },
    ];
    axios.get.mockResolvedValueOnce({ data: orders });

    render(<SearchOrders />);

    // Wait for orders to render
    await waitFor(() => {
      expect(screen.getAllByTestId("order-card")).toHaveLength(2);
      expect(screen.getByText("AAPL")).toBeInTheDocument();
      expect(screen.getByText("GOOGL")).toBeInTheDocument();
    });
  });

  test("displays search results when typing", async () => {
    const orders = [
      { orderId: 1, stockName: "AAPL" },
      { orderId: 2, stockName: "GOOGL" },
    ];
    axios.get.mockResolvedValueOnce({ data: orders }); // Initial fetch
    const searchResults = [{ orderId: 3, stockName: "MSFT" }];
    axios.get.mockResolvedValueOnce({ data: searchResults }); // Search API

    render(<SearchOrders />);

    const input = screen.getByPlaceholderText(/Search by stock name or symbol/i);
    fireEvent.change(input, { target: { value: "MSFT" } });

    const resultCard = await screen.findByText("MSFT");
    expect(resultCard).toBeInTheDocument();
  });

  test("shows 'No results found' if search returns empty", async () => {
    axios.get.mockResolvedValueOnce({ data: [] }); // Initial fetch
    axios.get.mockResolvedValueOnce({ data: [] }); // Search API

    render(<SearchOrders />);

    const input = screen.getByPlaceholderText(/Search by stock name or symbol/i);
    fireEvent.change(input, { target: { value: "XYZ" } });

    const noResults = await screen.findByText(/No results found/i);
    expect(noResults).toBeInTheDocument();
  });

//   test("shows error message if API fails", async () => {
//     axios.get.mockRejectedValueOnce(new Error("API Error")); // Initial fetch

//     render(<SearchOrders />);

//     const errorMessage = await screen.findByText(/Failed to fetch search results/i);
//     expect(errorMessage).toBeInTheDocument();
//   });
});
