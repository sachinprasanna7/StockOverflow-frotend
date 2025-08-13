import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import PortfolioPage from "../PortfolioPage"; // adjust path if needed
import { MemoryRouter } from "react-router-dom";

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// Mock fetch globally
beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.resetAllMocks();
});

test("renders portfolio overview and holdings", async () => {
  // Mock portfolio fetch
  fetch
    .mockResolvedValueOnce({
      ok: true,
      json: async () => [
        { symbolId: 1, stockQuantity: 10, averagePrice: 100 },
        { symbolId: 2, stockQuantity: 5, averagePrice: 50 },
      ],
    })
    // Mock stock details fetch
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({ symbol: "AAPL", name: "Apple Inc", companyName: "Apple" }),
    })
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({ symbol: "GOOG", name: "Alphabet Inc", companyName: "Google" }),
    })
    // Mock current prices fetch
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
    console.log("Checking portfolio heading...");
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
  console.log("Found stock card:", card);

  fireEvent.click(card.closest(".card"));
  console.log("Clicked on stock card");

  expect(mockNavigate).toHaveBeenCalledWith("/stock/aapl");
  console.log("Navigation called correctly");
});
