import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { ConceptsApi, StructureApi } from "@sdk/index";

import { AppContextProvider } from "../../../../application/app-context";
import { Component } from "./page";

const goBack = vi.fn();

vi.mock("react-router-dom", async () => ({
  ...(await vi.importActual("react-router-dom")),
  useParams: () => ({ id: "comp-1" }),
}));

vi.mock("@sdk/index", () => ({
  StructureApi: {
    getMutualizedComponent: vi.fn(),
    getMutualizedAttributes: vi.fn(),
    deleteMutualizedComponent: vi.fn(),
    publishMutualizedComponent: vi.fn(),
  },
  ConceptsApi: { getConceptList: vi.fn() },
}));

vi.mock("@utils/hooks/useGoBack", () => ({ useGoBack: () => goBack }));
vi.mock("../../../hooks/useFormattedCodelist", () => ({
  useFormattedCodelist: () => ({ data: [{ id: "CL_1" }] }),
}));

vi.mock("../../../components/ComponentTitle", () => ({
  ComponentTitle: ({ component }: any) => <h1>composante:{component.labelLg1}</h1>,
}));
vi.mock("../../../components/ComponentDetailView", () => ({
  ComponentDetailView: ({
    handleBack,
    handleDelete,
    publishComponent,
    handleUpdate,
    serverSideError,
    concepts,
    attributes,
    codelists,
  }: any) => (
    <div>
      <span>concepts:{concepts.length}</span>
      <span>attributs:{attributes.length}</span>
      <span>listes:{codelists.length}</span>
      <span>modifier:{handleUpdate}</span>
      <span>erreur:{serverSideError ?? "(aucune)"}</span>
      <button onClick={handleBack}>retour</button>
      <button onClick={handleDelete}>supprimer</button>
      <button onClick={publishComponent}>publier</button>
    </div>
  ),
}));

const component = { id: "comp-1", labelLg1: "Composante FR" };

const renderPage = () =>
  render(
    <AppContextProvider lg1="fr" lg2="en" version="2.0.0" properties={{} as any}>
      <MemoryRouter>
        <Component />
      </MemoryRouter>
    </AppContextProvider>,
  );

describe("Mutualized component view page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(StructureApi.getMutualizedComponent).mockResolvedValue(component);
    vi.mocked(StructureApi.getMutualizedAttributes).mockResolvedValue([{ id: "a-1" }]);
    vi.mocked(ConceptsApi.getConceptList).mockResolvedValue([{ id: "k-1" }, { id: "k-2" }]);
    vi.mocked(StructureApi.deleteMutualizedComponent).mockResolvedValue({});
    vi.mocked(StructureApi.publishMutualizedComponent).mockResolvedValue({});
  });

  it("attend les trois appels avant d'afficher la composante", async () => {
    renderPage();

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();

    await waitFor(() => expect(screen.getByText("composante:Composante FR")).toBeInTheDocument());
    expect(screen.getByText("concepts:2")).toBeInTheDocument();
    expect(screen.getByText("attributs:1")).toBeInTheDocument();
    expect(screen.getByText("listes:1")).toBeInTheDocument();
    expect(screen.getByText("modifier:/structures/components/comp-1/modify")).toBeInTheDocument();
  });

  it("revient à la liste des composantes", async () => {
    renderPage();
    await waitFor(() => expect(screen.getByRole("button", { name: "retour" })).toBeInTheDocument());

    await userEvent.click(screen.getByRole("button", { name: "retour" }));

    expect(goBack).toHaveBeenCalledWith("/structures/components");
  });

  it("supprime la composante puis revient à la liste", async () => {
    renderPage();
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "supprimer" })).toBeInTheDocument(),
    );

    await userEvent.click(screen.getByRole("button", { name: "supprimer" }));

    await waitFor(() =>
      expect(StructureApi.deleteMutualizedComponent).toHaveBeenCalledWith("comp-1"),
    );
    await waitFor(() => expect(goBack).toHaveBeenCalledWith("/structures/components"));
  });

  it("publie la composante puis la recharge", async () => {
    renderPage();
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "publier" })).toBeInTheDocument(),
    );

    await userEvent.click(screen.getByRole("button", { name: "publier" }));

    await waitFor(() =>
      expect(StructureApi.publishMutualizedComponent).toHaveBeenCalledWith(component),
    );
    await waitFor(() => expect(StructureApi.getMutualizedComponent).toHaveBeenCalledTimes(2));
  });

  it("affiche l'erreur serveur quand la publication échoue", async () => {
    vi.mocked(StructureApi.publishMutualizedComponent).mockRejectedValue("Publication refusée");
    renderPage();
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "publier" })).toBeInTheDocument(),
    );

    await userEvent.click(screen.getByRole("button", { name: "publier" }));

    await waitFor(() => expect(screen.getByText("erreur:Publication refusée")).toBeInTheDocument());
  });
});
