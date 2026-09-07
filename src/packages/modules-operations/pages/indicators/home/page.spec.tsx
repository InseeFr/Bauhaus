import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { OperationsApi } from "@sdk/operations-api";
import { Component } from "./page";

vi.mock("react-i18next", async () => ({
  ...(await vi.importActual<typeof import("react-i18next")>("react-i18next")),
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("@sdk/operations-api", () => ({ OperationsApi: { getAllIndicators: vi.fn() } }));
vi.mock("@utils/hooks/useTitle", () => ({ useTitle: vi.fn() }));

vi.mock("@components/searchable-list", () => ({
  SearchableList: ({ items, childPath }: any) => (
    <ul data-testid={childPath}>
      {items.map((item: any) => (
        <li key={item.id}>{item.label}</li>
      ))}
    </ul>
  ),
}));
vi.mock("./menu", () => ({ Menu: () => <nav>menu</nav> }));

const renderPage = () =>
  render(
    <MemoryRouter>
      <Component />
    </MemoryRouter>,
  );

describe("Indicators home page", () => {
  beforeEach(() => vi.clearAllMocks());

  it("affiche le chargement tant que la liste n'est pas là", () => {
    vi.mocked(OperationsApi.getAllIndicators).mockReturnValue(new Promise(() => {}) as any);
    renderPage();

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it("liste les indicateurs, chacun menant à sa fiche", async () => {
    vi.mocked(OperationsApi.getAllIndicators).mockResolvedValue([
      { id: "i-1", label: "Taux de chômage" },
    ] as any);
    renderPage();

    await waitFor(() => expect(screen.getByText("Taux de chômage")).toBeInTheDocument());
    expect(screen.getByTestId("operations/indicator")).toBeInTheDocument();
  });

  it("affiche une liste vide quand il n'y a aucun indicateur", async () => {
    vi.mocked(OperationsApi.getAllIndicators).mockResolvedValue([] as any);
    renderPage();

    await waitFor(() => expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument());
    expect(screen.queryAllByRole("listitem")).toHaveLength(0);
  });
});
