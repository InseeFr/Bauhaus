import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { Component } from "./home-container"; // <- adapte ce chemin si nécessaire

vi.mock("@components/loading", () => ({
  Loading: () => <div data-testid="loading">loading…</div>,
}));

vi.mock("./home", () => ({
  __esModule: true,
  default: ({ series }: { series: unknown[] | undefined }) => (
    <div
      data-testid="series-home"
      data-series-len={Array.isArray(series) ? series.length : -1}
      data-series-undefined={String(series === undefined)}
    />
  ),
}));

const hookSpy = vi.fn();
vi.mock("../hooks/useClassificationSeries", () => ({
  useClassificationSeries: () => hookSpy(),
}));

describe("Component (Series wrapper)", () => {
  beforeEach(() => {
    hookSpy.mockReset();
  });

  it("renders <Loading /> while isLoading is true", () => {
    hookSpy.mockReturnValue({ isLoading: true, series: undefined });

    render(<Component />);

    expect(screen.getByTestId("loading")).toBeInTheDocument();
    expect(screen.queryByTestId("series-home")).toBeNull();
  });

  it("renders SeriesHome with undefined series (no loading)", () => {
    hookSpy.mockReturnValue({ isLoading: false, series: undefined });

    render(<Component />);

    const sh = screen.getByTestId("series-home");
    expect(sh).toBeInTheDocument();
    expect(sh).toHaveAttribute("data-series-undefined", "true");
    expect(sh).toHaveAttribute("data-series-len", "-1");
    expect(screen.queryByTestId("loading")).toBeNull();
  });

  it("renders SeriesHome with provided series array", () => {
    const series = [
      { id: "A", label: "Serie A" },
      { id: "B", label: "Serie B" },
    ];
    hookSpy.mockReturnValue({ isLoading: false, series });

    render(<Component />);

    const sh = screen.getByTestId("series-home");
    expect(sh).toBeInTheDocument();
    expect(sh).toHaveAttribute("data-series-undefined", "false");
    expect(sh).toHaveAttribute("data-series-len", "2");
    expect(screen.queryByTestId("loading")).toBeNull();
  });
});
