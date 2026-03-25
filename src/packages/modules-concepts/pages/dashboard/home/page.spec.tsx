import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import { Component } from "./page";

vi.mock("@sdk/concepts-api", () => ({
  ConceptsApi: {
    getConceptSearchList: vi.fn(),
  },
}));

vi.mock("@sdk/new-collection-api", () => ({
  CollectionApi: {
    getCollectionDashboardList: vi.fn(),
  },
}));

vi.mock("@components/loading", () => ({
  Loading: () => <div data-testid="loading">Loading...</div>,
}));

vi.mock("@components/errors-bloc", () => ({
  ErrorBloc: ({ error }: { error: unknown }) => <div data-testid="error">{String(error)}</div>,
}));

vi.mock("./home", () => ({
  default: () => <div data-testid="dashboard">Dashboard</div>,
}));

import { ConceptsApi } from "@sdk/concepts-api";
import { CollectionApi } from "@sdk/new-collection-api";

const renderComponent = () =>
  render(
    <MemoryRouter>
      <Component />
    </MemoryRouter>,
  );

describe("dashboard page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading while fetching data", () => {
    (ConceptsApi.getConceptSearchList as ReturnType<typeof vi.fn>).mockReturnValue(
      new Promise(() => {}),
    );
    (CollectionApi.getCollectionDashboardList as ReturnType<typeof vi.fn>).mockReturnValue(
      new Promise(() => {}),
    );

    renderComponent();

    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  it("shows dashboard after successful fetch", async () => {
    (ConceptsApi.getConceptSearchList as ReturnType<typeof vi.fn>).mockResolvedValue([]);
    (CollectionApi.getCollectionDashboardList as ReturnType<typeof vi.fn>).mockResolvedValue([]);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId("dashboard")).toBeInTheDocument();
    });
    expect(screen.queryByTestId("loading")).not.toBeInTheDocument();
  });

  it("shows error when fetch fails", async () => {
    (ConceptsApi.getConceptSearchList as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error("Network error"),
    );
    (CollectionApi.getCollectionDashboardList as ReturnType<typeof vi.fn>).mockResolvedValue([]);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId("error")).toBeInTheDocument();
    });
    expect(screen.queryByTestId("dashboard")).not.toBeInTheDocument();
  });
});
