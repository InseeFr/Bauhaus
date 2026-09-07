import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { ClassificationsApi } from "@sdk/classification";
import { Component } from "./page";

vi.mock("@sdk/classification", () => ({
  ClassificationsApi: { getFamiliesList: vi.fn() },
}));

vi.mock("./components/FamiliesHome", () => ({
  FamiliesHome: ({ families }: any) => (
    <ul>
      {families.map((family: any) => (
        <li key={family.id}>{family.label}</li>
      ))}
    </ul>
  ),
}));

describe("Classifications families home page", () => {
  beforeEach(() => vi.clearAllMocks());

  it("affiche le chargement tant que la liste n'est pas là", () => {
    vi.mocked(ClassificationsApi.getFamiliesList).mockReturnValue(new Promise(() => {}) as any);
    render(<Component />);

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it("affiche les familles retournées par le serveur", async () => {
    vi.mocked(ClassificationsApi.getFamiliesList).mockResolvedValue([
      { id: "f-1", label: "NAF" },
      { id: "f-2", label: "PCS" },
    ] as any);
    render(<Component />);

    await waitFor(() => expect(screen.getAllByRole("listitem")).toHaveLength(2));
    expect(screen.getByText("NAF")).toBeInTheDocument();
  });

  it("affiche une liste vide plutôt que le chargement quand il n'y a aucune famille", async () => {
    vi.mocked(ClassificationsApi.getFamiliesList).mockResolvedValue([] as any);
    render(<Component />);

    await waitFor(() => expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument());
    expect(screen.queryAllByRole("listitem")).toHaveLength(0);
  });
});
