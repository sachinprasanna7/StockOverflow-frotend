// SearchBar.test.js
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SearchBar from "../components/SearchBar";
import axios from "axios";
import { BrowserRouter } from "react-router-dom";

// Mock axios
jest.mock("axios");

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// Helper to render with router
const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe("SearchBar component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders search input", () => {
    renderWithRouter(<SearchBar />);
    const input = screen.getByPlaceholderText(
      /Search stocks, ETFs, cryptocurrencies.../i
    );
    expect(input).toBeInTheDocument();
  });

  test("activates search on focus and shows popular searches", () => {
    renderWithRouter(<SearchBar />);
    const input = screen.getByPlaceholderText(
      /Search stocks, ETFs, cryptocurrencies.../i
    );
    console.log("Input element:", input);
    fireEvent.focus(input);

    expect(screen.getByText(/Popular Searches/i)).toBeInTheDocument();
    // expect(screen.getByText(/AAPL/i)).toBeInTheDocument();
    // expect(screen.getByText(/GS/i)).toBeInTheDocument();
  });

  // test("displays search results after typing", async () => {
  //   const searchResults = [
  //     { symbol: "aapl", companyName: "Apple Inc." },
  //     { symbol: "googl", companyName: "Alphabet Inc." },
  //   ];
  //   axios.get.mockResolvedValueOnce({ data: searchResults });

  //   renderWithRouter(<SearchBar />);
  //   const input = screen.getByPlaceholderText(
  //     /Search stocks, ETFs, cryptocurrencies.../i
  //   );

  //   fireEvent.change(input, { target: { value: "a" } });

  //   await waitFor(() => {
  //     expect(screen.getByText(/aapl/i)).toBeInTheDocument();
  //     expect(screen.getByText(/googl/i)).toBeInTheDocument();
  //   });
  // });
  
  // test("shows loading state while fetching search results", async () => {
  //   let resolveAxios;
  //   const axiosPromise = new Promise((resolve) => {
  //     resolveAxios = resolve;
  //   });
  //   axios.get.mockReturnValueOnce(axiosPromise);

  //   renderWithRouter(<SearchBar />);
  //   const input = screen.getByPlaceholderText(
  //     /Search stocks, ETFs, cryptocurrencies.../i
  //   );
  //   fireEvent.change(input, { target: { value: "a" } });

  //   // Should show loading
  //   expect(screen.getByText(/Searching.../i)).toBeInTheDocument();

  //   // Resolve axios promise
  //   resolveAxios({ data: [] });

  //   await waitFor(() => {
  //     expect(screen.getByText(/No results found/i)).toBeInTheDocument();
  //   });
  // });
 
  // test('shows "No results found" when API returns empty', async () => {
  //   axios.get.mockResolvedValueOnce({ data: [] });

  //   renderWithRouter(<SearchBar />);
  //   const input = screen.getByPlaceholderText(
  //     /Search stocks, ETFs, cryptocurrencies.../i
  //   );
  //   fireEvent.change(input, { target: { value: "xyz" } });

  //   await waitFor(() => {
  //     expect(screen.getByText(/No results found/i)).toBeInTheDocument();
  //   });
  // });

  test("clicking popular search calls handleStockClick (navigation)", async () => {
    renderWithRouter(<SearchBar />);
    const input = screen.getByPlaceholderText(
      /Search stocks, ETFs, cryptocurrencies.../i
    );
    fireEvent.focus(input);

    const symbol = screen.getAllByText(/aapl/i)[0]; // First one
    fireEvent.click(symbol);

    expect(mockNavigate).toHaveBeenCalledWith(
      "/stock/aapl",
      expect.any(Object)
    );
  });
});
