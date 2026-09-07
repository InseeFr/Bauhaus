import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { OperationsApi } from "@sdk/operations-api";

import { Component } from "./page";

vi.mock("@sdk/operations-api", () => ({ OperationsApi: { getOperationsList: vi.fn() } }));

vi.mock("./components/OperationsHome", () => ({
  OperationsHome: ({ operations }) => (
    <ul>
      {operations.map((operation) => (
        <li key={operation.id}>{operation.label}</li>
      ))}
    </ul>
  ),
}));

describe("Operations home page", () => {
  beforeEach(() => vi.clearAllMocks());

  it("affiche le chargement tant que la liste n'est pas là", () => {
    vi.mocked(OperationsApi.getOperationsList).mockReturnValue(new Promise(() => {}));
    render(<Component />);

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it("trie les opérations par libellé", async () => {
    vi.mocked(OperationsApi.getOperationsList).mockResolvedValue([
      { id: "o-2", label: "Zèbre" },
      { id: "o-1", label: "Abeille" },
    ]);
    render(<Component />);

    await waitFor(() => expect(screen.getAllByRole("listitem")).toHaveLength(2));
    expect(screen.getAllByRole("listitem")[0]).toHaveTextContent("Abeille");
  });

  it("affiche une liste vide quand il n'y a aucune opération", async () => {
    vi.mocked(OperationsApi.getOperationsList).mockResolvedValue([]);
    render(<Component />);

    await waitFor(() => expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument());
    expect(screen.queryAllByRole("listitem")).toHaveLength(0);
  });
});
