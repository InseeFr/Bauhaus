import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import SeriesHome from "./home";
import type { PartialClassificationSerie } from "@model/Classification";

vi.mock("@components/layout", () => ({
  Row: ({ children }: { children: React.ReactNode }) => <div data-testid="row">{children}</div>,
}));

vi.mock("@components/page-title", () => ({
  PageTitle: ({ title, col, offset }: { title: string; col: number; offset: number }) => (
    <div data-testid="page-title" data-title={title} data-col={col} data-offset={offset} />
  ),
}));

vi.mock("@components/searchable-list", () => ({
  SearchableList: ({
    items,
    childPath,
    autoFocus,
  }: {
    items: unknown[];
    childPath: string;
    autoFocus?: boolean;
  }) => (
    <div
      data-testid="searchable-list"
      data-count={Array.isArray(items) ? items.length : -1}
      data-child-path={childPath}
      data-autofocus={!!autoFocus}
    />
  ),
}));

vi.mock("../../deprecated-locales", () => ({
  default: {
    classificationsTitle: "Classifications",
    seriesTitle: "Series",
    seriesSearchTitle: "Search in series",
  },
}));

const useTitleSpy = vi.fn();
vi.mock("../../utils/hooks/useTitle", async () => {
  return {
    useTitle: (...args: unknown[]) => useTitleSpy(...args),
  };
});

describe("SeriesHome", () => {
  beforeEach(() => {
    useTitleSpy.mockClear();
  });

  it("returns null when series is undefined", () => {
    const { container } = render(<SeriesHome series={undefined} />);
    expect(container.firstChild).toBeNull();
    expect(useTitleSpy).toHaveBeenCalledWith("Classifications", "Series");
  });

  it("calls useTitle with correct titles when series is provided (even empty)", () => {
    render(<SeriesHome series={[]} />);
    expect(useTitleSpy).toHaveBeenCalledTimes(1);
    expect(useTitleSpy).toHaveBeenCalledWith("Classifications", "Series");
  });

  it("renders layout, title and searchable list when series is an empty array", () => {
    render(<SeriesHome series={[]} />);

    expect(screen.getByTestId("row")).toBeInTheDocument();

    const title = screen.getByTestId("page-title");
    expect(title).toHaveAttribute("data-title", "Search in series");
    expect(title).toHaveAttribute("data-col", "12");
    expect(title).toHaveAttribute("data-offset", "0");

    const list = screen.getByTestId("searchable-list");
    expect(list).toHaveAttribute("data-count", "0");
    expect(list).toHaveAttribute("data-child-path", "classifications/series");
    expect(list).toHaveAttribute("data-autofocus", "true");
  });

  it("passes the series items to SearchableList", () => {
    const series: PartialClassificationSerie[] = [
      { id: "A", label: "Serie A" } as any,
      { id: "B", label: "Serie B" } as any,
    ];

    render(<SeriesHome series={series} />);

    const list = screen.getByTestId("searchable-list");
    expect(list).toHaveAttribute("data-count", "2");
  });
});
