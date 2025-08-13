// src/tests/portfolio-transact.test.js
import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PortfolioPage from "../components/PortfolioCard"; // adjust path
import TransactPage from "../pages/TransactPage"; // adjust path
import axios from "axios";

// ------------------------
// Mock react-router useNavigate
// ------------------------
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// ------------------------
// Mock axios
// ------------------------
jest.mock("axios");

// ------------------------
// Mock global fetch
// ------------------------
beforeEach(() => {
  global.fetch = jest.fn();
  jest.clearAllMocks();
});

afterEach(() => {
  jest.resetAllMocks();
});

// ------------------------
// PortfolioPage Tests
// ------------------------
describe("PortfolioPage", () => {
  test("renders portfolio overview and holdings", async () => {
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [
          { symbolId: 1, stockQuantity: 10, averagePrice: 100 },
          { symbolId: 2, stockQuantity: 5, averagePrice: 50 },
        ],
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ symbol: "AAPL", name: "Apple Inc", companyName: "Apple" }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ symbol: "GOOG", name: "Alphabet Inc", companyName: "Google" }),
      })
      .mockResolvedValue({
        ok: true,
        json: async () => [{ price: 150 }],
      });

    render(
      <MemoryRouter>
        <PortfolioPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Portfolio Overview/i)).toBeInTheDocument();
      expect(screen.getByText(/Your Holdings/i)).toBeInTheDocument();
      expect(screen.getByText(/APPLE/i)).toBeInTheDocument();
      expect(screen.getByText(/GOOGLE/i)).toBeInTheDocument();
    });
  });

  test("clicking a stock navigates to its detail page", async () => {
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [{ symbolId: 1, stockQuantity: 10, averagePrice: 100 }],
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ symbol: "AAPL", name: "Apple Inc", companyName: "Apple" }),
      })
      .mockResolvedValue({
        ok: true,
        json: async () => [{ price: 150 }],
      });

    render(
      <MemoryRouter>
        <PortfolioPage />
      </MemoryRouter>
    );

    const card = await screen.findByText(/APPLE/i);
    fireEvent.click(card.closest(".card"));

    expect(mockNavigate).toHaveBeenCalledWith("/stock/aapl");
  });

  test("displays message when portfolio is empty", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    render(
      <MemoryRouter>
        <PortfolioPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/add some stocks/i)).toBeInTheDocument();
    });
  });

  test("displays error message on fetch failure", async () => {
    fetch.mockRejectedValueOnce(new Error("Network error"));

    render(
      <MemoryRouter>
        <PortfolioPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/network error/i)).toBeInTheDocument();
    }
  );
  });
});

