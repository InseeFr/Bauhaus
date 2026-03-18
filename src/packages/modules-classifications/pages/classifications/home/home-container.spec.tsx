import { render, screen } from "@testing-library/react";
import { Mock, vi } from "vitest";

import { useClassifications } from "../../../hooks/useClassifications";

import { Component } from "./home-container";

vi.mock("../../../hooks/useClassifications", () => ({
  useClassifications: vi.fn(),
}));

vi.mock("@components/loading", () => ({
  Loading: () => <div data-testid="loading">Loading...</div>,
}));

vi.mock("./home", () => ({
  default: ({ classifications }: { classifications: any[] }) => (
    <div data-testid="classifications-home">{JSON.stringify(classifications)}</div>
  ),
}));

describe("Component", () => {
  it("renders the Loading component when isLoading is true", () => {
    (useClassifications as Mock).mockReturnValue({
      isLoading: true,
      data: null,
    });

    render(<Component />);

    screen.getByTestId("loading");
  });

  it("renders the ClassificationsHome component when isLoading is false", () => {
    const mockClassifications = [
      { id: 1, name: "Classification 1" },
      { id: 2, name: "Classification 2" },
    ];

    (useClassifications as Mock).mockReturnValue({
      isLoading: false,
      data: mockClassifications,
    });

    render(<Component />);

    screen.getByTestId("classifications-home");
  });
});
