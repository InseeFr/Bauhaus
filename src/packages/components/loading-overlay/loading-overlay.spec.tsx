import { render, screen } from "@testing-library/react";
import { vi, describe, it, expect } from "vitest";

import { LoadingOverlay } from "./";

vi.mock("../i18n", () => ({
  default: {
    loading: {
      saving: "Saving...",
      loading: "Loading...",
    },
  },
}));

vi.mock("primereact/progressspinner", () => ({
  ProgressSpinner: () => <div data-testid="progress-spinner">Spinner</div>,
}));

describe("LoadingOverlay Component", () => {
  it("renders a full-screen overlay with spinner and text", () => {
    render(<LoadingOverlay text="Saving in progress..." />);

    expect(screen.getByTestId("progress-spinner")).toBeInTheDocument();
    expect(screen.getByText("Saving in progress...")).toBeInTheDocument();
  });

  it("has correct accessibility attributes", () => {
    render(<LoadingOverlay text="Saving in progress..." />);

    const statusElement = screen.getByRole("status");
    expect(statusElement).toHaveAttribute("aria-live", "polite");
    expect(statusElement).toHaveAttribute("aria-label", "Saving in progress...");
  });

  it("covers the whole screen above the page content", () => {
    render(<LoadingOverlay text="Saving in progress..." />);

    expect(screen.getByRole("status")).toHaveClass("loading-overlay");
  });

  it("falls back on the shared dictionary when a textType is given", () => {
    render(<LoadingOverlay textType="saving" />);

    expect(screen.getByText("Saving...")).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveAttribute("aria-label", "Saving...");
  });

  it("defaults to the shared loading text without any prop", () => {
    render(<LoadingOverlay />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });
});
