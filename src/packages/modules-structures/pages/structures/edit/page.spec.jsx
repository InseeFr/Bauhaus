import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { StructureApi } from "@sdk/index";
import { AppContextProvider } from "../../../../application/app-context";
import { Component } from "./page";

const location = vi.fn();
vi.mock("react-router-dom", async () => ({
  ...(await vi.importActual("react-router-dom")),
  useParams: () => ({ id: "str-1" }),
  useLocation: () => location(),
}));

vi.mock("react-i18next", () => ({ useTranslation: () => ({ t: (key) => key }) }));

vi.mock("@sdk/index", () => ({ StructureApi: { getStructure: vi.fn() } }));
vi.mock("@utils/hooks/useTitle", () => ({ useTitle: vi.fn() }));

vi.mock("./components/EditionForm", () => ({
  EditionForm: ({ creation, initialStructure }) => (
    <form>
      <span>création:{String(creation)}</span>
      <span>id:{initialStructure.id === "" ? "(vide)" : initialStructure.id}</span>
      <span>libellé:{initialStructure.labelLg1}</span>
      <span>composantes:{initialStructure.componentDefinitions?.length ?? "(aucune)"}</span>
    </form>
  ),
}));

const structure = {
  id: "str-1",
  identifiant: "STR1",
  labelLg1: "Structure FR",
  labelLg2: "Structure EN",
  creator: "DG75",
  contributor: "DG75",
  disseminationStatus: "public",
  componentDefinitions: [
    { component: { id: "c-1" }, order: 1, required: true, attachment: "DataSet", extra: "à jeter" },
  ],
};

const renderPage = () =>
  render(
    <AppContextProvider lg1="fr" lg2="en" version="2.0.0" properties={{}}>
      <MemoryRouter>
        <Component />
      </MemoryRouter>
    </AppContextProvider>,
  );

describe("Structures edit page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    location.mockReturnValue({ pathname: "/structures/str-1/update" });
    vi.mocked(StructureApi.getStructure).mockResolvedValue(structure);
  });

  it("charge la structure et ouvre le formulaire de modification", async () => {
    renderPage();

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();

    await waitFor(() => expect(screen.getByText("création:false")).toBeInTheDocument());
    expect(screen.getByText("id:str-1")).toBeInTheDocument();
    expect(StructureApi.getStructure).toHaveBeenCalledWith("str-1");
  });

  it("vide l'identifiant en duplication, pour que la copie en obtienne un nouveau", async () => {
    location.mockReturnValue({ pathname: "/structures/str-1/duplicate" });
    renderPage();

    await waitFor(() => expect(screen.getByText("création:true")).toBeInTheDocument());
    expect(screen.getByText("id:(vide)")).toBeInTheDocument();
    expect(screen.getByText("libellé:Structure FR")).toBeInTheDocument();
  });

  it("ne recopie que les champs utiles des composantes en duplication", async () => {
    location.mockReturnValue({ pathname: "/structures/str-1/duplicate" });
    renderPage();

    await waitFor(() => expect(screen.getByText("composantes:1")).toBeInTheDocument());
  });

  it("sort du chargement même quand la structure revient vide", async () => {
    vi.mocked(StructureApi.getStructure).mockResolvedValue({});
    renderPage();

    await waitFor(() => expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument());
    expect(screen.getByText("création:false")).toBeInTheDocument();
  });
});
