import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Route, Routes } from "react-router-dom";
import { vi } from "vitest";

import { ConceptsApi, saveComponent, StructureApi } from "@sdk/index";

import { createStructuresWrapper } from "../../../render.testing";
import { Component } from "./page";

vi.mock("@sdk/index", async () => ({
  StructureApi: {
    getMutualizedComponent: vi.fn(),
    getMutualizedAttributes: vi.fn(),
  },
  ConceptsApi: { getConceptList: vi.fn() },
  ...(await import("../../../mocks.testing")).emptyCodelistsAndStampsApi(),
  saveComponent: vi.fn(),
}));

vi.mock("@sdk/codelists-api", () => ({
  CodelistsApi: {
    getCodelists: vi.fn().mockResolvedValue([]),
    getCodelistsPartial: vi.fn().mockResolvedValue([]),
  },
}));

vi.mock("@components/business/creators-input", () => ({ CreatorsInput: () => <div /> }));
vi.mock("@components/business/contributors-input/contributors-input", () => ({
  ContributorsInput: () => <div />,
}));

vi.mock("@utils/hooks/users", async (importOriginal) =>
  (await import("../../../mocks.testing")).usersHookWithCreatePrivilege(
    await importOriginal(),
    "STRUCTURE_COMPONENT",
  ),
);

const mutualizedComponent = {
  id: "c1",
  identifiant: "c1",
  labelLg1: "Composante 1",
  labelLg2: "Component 1",
  type: "http://purl.org/linked-data/cube#DimensionProperty",
};

const Wrapper = (path: string) =>
  createStructuresWrapper({
    initialEntries: [path],
    routes: (children) => (
      <Routes>
        <Route path="/structures/components/edit/:id" element={children} />
        <Route path="/structures/components/create" element={children} />
      </Routes>
    ),
  });

const renderPage = async (path = "/structures/components/edit/c1") => {
  const view = render(<Component />, { wrapper: Wrapper(path) });
  await screen.findByDisplayValue("Composante 1");
  return view;
};

describe("page d'édition d'une composante mutualisée", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(StructureApi.getMutualizedComponent).mockResolvedValue(mutualizedComponent);
    vi.mocked(StructureApi.getMutualizedAttributes).mockResolvedValue([]);
    vi.mocked(ConceptsApi.getConceptList).mockResolvedValue([]);
  });

  it("charge la composante à modifier", async () => {
    await renderPage();

    expect(StructureApi.getMutualizedComponent).toHaveBeenCalledWith("c1");
    expect(screen.getByDisplayValue("Composante 1")).toBeInTheDocument();
  });

  it("ne charge aucune composante à la création", async () => {
    vi.mocked(StructureApi.getMutualizedComponent).mockResolvedValue({});
    render(<Component />, { wrapper: Wrapper("/structures/components/create") });

    await waitFor(() => expect(ConceptsApi.getConceptList).toHaveBeenCalled());
    expect(StructureApi.getMutualizedComponent).not.toHaveBeenCalled();
  });

  it("enregistre la composante", async () => {
    vi.mocked(saveComponent).mockResolvedValue("c1");
    await renderPage();

    fireEvent.click(screen.getByRole("button", { name: /save|sauvegarder/i }));

    await waitFor(() =>
      expect(saveComponent).toHaveBeenCalledWith(expect.objectContaining({ identifiant: "c1" })),
    );
  });

  it("affiche l'erreur renvoyée par le serveur", async () => {
    vi.mocked(saveComponent).mockRejectedValue("Erreur serveur");
    await renderPage();

    fireEvent.click(screen.getByRole("button", { name: /save|sauvegarder/i }));

    expect(await screen.findByText("Erreur serveur")).toBeInTheDocument();
  });
});
