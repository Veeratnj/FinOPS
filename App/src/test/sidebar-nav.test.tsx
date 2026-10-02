import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import { Sidebar } from "../components/layout/Sidebar";
import { AppProvider } from "../context/AppContext";
import { SubscriptionProvider } from "../context/SubscriptionContext";

describe("Sidebar navigation", () => {
  it("renders Agent Ops, LLM Ops and Token-OPS entries", () => {
    render(
      <MemoryRouter>
        <AppProvider>
          <SubscriptionProvider>
            <Sidebar />
          </SubscriptionProvider>
        </AppProvider>
      </MemoryRouter>
    );

    expect(screen.getByRole("link", { name: /agent ops/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /llm ops/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /token-ops/i })).toBeInTheDocument();
  });
});
