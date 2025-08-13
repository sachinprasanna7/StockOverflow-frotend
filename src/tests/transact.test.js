import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import TransactPage from "../pages/TransactPage";
import axios from "axios";

jest.mock("axios");


beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.resetAllMocks();
});


test("allows user to deposit money", async () => {
    axios.get.mockResolvedValueOnce({ data: { trading_money: 1000 } });
    axios.get.mockResolvedValueOnce({ data: { stock_investments_money: 5000 } });
    axios.post.mockResolvedValueOnce({}); // mock successful post

    render(
      <MemoryRouter>
        <TransactPage />
      </MemoryRouter>
    );

    const input = await screen.findByPlaceholderText(/Enter amount/i);
    fireEvent.change(input, { target: { value: "500" } });

    const depositBtn = screen.getByRole("button", { name: /Deposit/i });
    fireEvent.click(depositBtn);

    await waitFor(() => {
      expect(screen.getByText(/ Deposit /)).toBeInTheDocument();
    });
  });

  test("prevents withdrawal if insufficient funds", async () => {
    window.alert = jest.fn();

    axios.get.mockResolvedValueOnce({ data: { trading_money: 100 } });
    axios.get.mockResolvedValueOnce({ data: { stock_investments_money: 5000 } });

    render(
      <MemoryRouter>
        <TransactPage />
      </MemoryRouter>
    );

    const withdrawRadio = await screen.findByLabelText(/⬇️ Withdraw Money/i);
    fireEvent.click(withdrawRadio);

    const input = screen.getByPlaceholderText(/Enter amount/i);
    fireEvent.change(input, { target: { value: "500" } });

    const withdrawBtn = screen.getByRole("button", { name: /Withdraw/i });
    fireEvent.click(withdrawBtn);

    expect(window.alert).toHaveBeenCalledWith("Insufficient funds");
  });

  test("withdraws money successfully", async () => {
    window.alert = jest.fn();

    axios.get.mockResolvedValueOnce({ data: { trading_money: 1000 } });
    axios.get.mockResolvedValueOnce({ data: { stock_investments_money: 5000 } });
    axios.post.mockResolvedValueOnce({});

    render(
      <MemoryRouter>
        <TransactPage />
      </MemoryRouter>
    );

    const withdrawRadio = await screen.findByLabelText(/⬇️ Withdraw Money/i);
    fireEvent.click(withdrawRadio);

    const input = screen.getByPlaceholderText(/Enter amount/i);
    fireEvent.change(input, { target: { value: "500" } });

    const withdrawBtn = screen.getByRole("button", { name: /Withdraw/i });
    fireEvent.click(withdrawBtn);

    
      await waitFor(() => {
        const balances = screen.getAllByText(/\$500\.00/); // returns array
        expect(balances[0]).toBeInTheDocument(); // pick the first one
        expect(window.alert).toHaveBeenCalledWith("Withdrawal successful!");
      });
      

  });
