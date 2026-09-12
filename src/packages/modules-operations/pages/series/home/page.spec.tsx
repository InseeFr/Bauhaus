import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { OperationsApi } from "@sdk/operations-api";

import { Component } from "./page";

vi.mock("@sdk/operations-api", () => ({ OperationsApi: { getSeriesList: vi.fn() } }));

vi.mock("./components/SeriesHome", () => ({
  SeriesHome: ({ series }: any) => (
    <ul>
      {series.map((serie: any) => (
        <li key={serie.id}>{serie.label}</li>
      ))}
    </ul>
  ),
}));

describe("Series home page", () => {
  beforeEach(() => vi.clearAllMocks());

  it("affiche le chargement tant que la liste n'est pas là", () => {
    vi.mocked(OperationsApi.getSeriesList).mockReturnValue(new Promise(() => {}) as any);
    render(<Component />);

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it("trie les séries par libellé", async () => {
    vi.mocked(OperationsApi.getSeriesList).mockResolvedValue([
      { id: "s-2", label: "Zèbre" },
      { id: "s-1", label: "Abeille" },
    ] as any);
    render(<Component />);

    await waitFor(() => expect(screen.getAllByRole("listitem")).toHaveLength(2));
    expect(screen.getAllByRole("listitem")[0]).toHaveTextContent("Abeille");
  });

  it("affiche une liste vide quand il n'y a aucune série", async () => {
    vi.mocked(OperationsApi.getSeriesList).mockResolvedValue([] as any);
    render(<Component />);

    await waitFor(() => expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument());
    expect(screen.queryAllByRole("listitem")).toHaveLength(0);
  });
});
