import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, vi, expect, beforeEach, Mock } from "vitest";

import { useOidc } from "../create-oidc";
import { LoggedInWrapper } from "./use-oidc";

vi.mock("../create-oidc", () => ({
  useOidc: vi.fn(),
}));

describe("LoggedInWrapper", () => {
  const MockComponent = () => <div data-testid="mock-component">Mock Component</div>;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("devrait afficher WrappedComponent après le chargement des informations", async () => {
    (useOidc as Mock).mockReturnValue({
      oidcTokens: { accessToken: "token" },
      renewTokens: vi.fn().mockResolvedValue(undefined),
    });

    render(<LoggedInWrapper WrappedComponent={MockComponent} />);

    await waitFor(() => {
      expect(screen.getByTestId("mock-component")).toBeInTheDocument();
    });
  });

  it("devrait appeler renewTokens périodiquement", async () => {
    vi.useFakeTimers();
    const mockRenewTokens = vi.fn().mockResolvedValue(undefined);

    (useOidc as Mock).mockReturnValue({
      oidcTokens: { accessToken: "token" },
      renewTokens: mockRenewTokens,
    });

    render(<LoggedInWrapper WrappedComponent={MockComponent} />);

    // Avancer le temps de 120 secondes pour déclencher le setInterval
    await vi.advanceTimersByTimeAsync(120000);

    expect(mockRenewTokens).toHaveBeenCalled();

    vi.useRealTimers();
  });
});
