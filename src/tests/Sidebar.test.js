// Sidebar.test.js
import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Sidebar from "../components/Sidebar";

// Mock images
jest.mock("../assets/stock-overflow-logo.jpeg", () => "bull-bear-mock");
jest.mock("../assets/bull-bear.png", () => "bull-bear-mock");

describe("Sidebar Component", () => {
  test("renders logo and platform name", () => {
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    );

    const logoImg = screen.getByAltText(/Stock Overflow Logo/i);
    expect(logoImg).toBeInTheDocument();
    expect(logoImg).toHaveAttribute("src", "bull-bear-mock");

    const platformName = screen.getByText(/Stock Overflow/i);
    expect(platformName).toBeInTheDocument();

    const platformDesc = screen.getByText(/Trading Platform/i);
    expect(platformDesc).toBeInTheDocument();
  });

  test("renders all navigation links", () => {
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    );

    const navLinks = [
      "Dashboard",
      "Portfolio",
      "Orders",
      "Transact",
      "Watchlist",
      "Settings",
      "Help",
    ];

    navLinks.forEach((linkText) => {
      const link = screen.getByText(linkText);
      expect(link).toBeInTheDocument();
    });
  });

  test("renders bottom image with correct alt text", () => {
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    );

    const bottomImg = screen.getByAltText(/Bull and Bear/i);
    expect(bottomImg).toBeInTheDocument();
    expect(bottomImg).toHaveAttribute("src", "bull-bear-mock");
  });

  test("applies active styles for current route", () => {
    // Simulate starting at /portfolio
    render(
      <MemoryRouter initialEntries={["/portfolio"]}>
        <Sidebar />
      </MemoryRouter>
    );

    const activeLink = screen.getByText("Portfolio").closest("a");
    expect(activeLink).toHaveStyle("background-color: rgba(255, 255, 255, 0.2)");
  });
});
