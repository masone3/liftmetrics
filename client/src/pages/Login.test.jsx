import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext.jsx";
import { ToastProvider } from "../context/ToastContext.jsx";
import Login from "./Login.jsx";

function renderLogin() {
  render(
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Login />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

describe("Login page", () => {
  it("renders the login form", () => {
    renderLogin();
    expect(screen.getByRole("heading", { name: "Log In" })).toBeInTheDocument();
  });

  it("shows validation errors on empty submit", async () => {
    renderLogin();
    fireEvent.click(screen.getByRole("button", { name: "Log In" }));

    expect(await screen.findByText("Email is required")).toBeInTheDocument();
    expect(await screen.findByText("Password is required")).toBeInTheDocument();
  });
});