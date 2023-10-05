import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import axios from "axios";
import LoginForm from "./App"; // Adjust the path accordingly

// Mocking the axios module
jest.mock("axios");

describe("LoginForm", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly", () => {
    const { getByPlaceholderText, getByText } = render(<LoginForm />);
    expect(getByPlaceholderText("Email")).toBeInTheDocument();
    expect(getByPlaceholderText("Password")).toBeInTheDocument();
    expect(getByText("Login")).toBeInTheDocument();
  });

  it("validates email and password on change", () => {
    const { getByPlaceholderText, getByText } = render(<LoginForm />);
    const emailInput = getByPlaceholderText("Email");
    const passwordInput = getByPlaceholderText("Password");

    // Invalid email format
    fireEvent.change(emailInput, { target: { value: "notAnEmail" } });
    expect(getByText("Invalid email format.")).toBeInTheDocument();

    // Empty password
    fireEvent.change(passwordInput, { target: { value: "" } });
    expect(getByText("Password cannot be empty.")).toBeInTheDocument();
  });

  it("shows login success message on successful login", async () => {
    axios.post.mockResolvedValueOnce({ data: {} });

    const { getByPlaceholderText, getByText } = render(<LoginForm />);
    const emailInput = getByPlaceholderText("Email");
    const passwordInput = getByPlaceholderText("Password");

    fireEvent.change(emailInput, { target: { value: "test@email.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(getByText("Login"));

    await waitFor(() => {
      expect(getByText("Login successful")).toBeInTheDocument();
    });
  });

  it("shows login failure message on login failure", async () => {
    axios.post.mockRejectedValueOnce(new Error("Failed login"));

    const { getByPlaceholderText, getByText, findByText, queryByText } = render(
      <LoginForm />
    );
    const emailInput = getByPlaceholderText("Email");
    const passwordInput = getByPlaceholderText("Password");

    fireEvent.change(emailInput, { target: { value: "test@email.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(queryByText("Invalid email format.")).not.toBeInTheDocument();
    expect(queryByText("Password cannot be empty.")).not.toBeInTheDocument();

    fireEvent.click(getByText("Login"));

    const loginFailedMessage = await findByText("Login failed");
    expect(loginFailedMessage).toBeInTheDocument();
  });
});
