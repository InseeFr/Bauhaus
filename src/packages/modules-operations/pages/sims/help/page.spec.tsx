import { screen } from "@testing-library/react";

import { renderWithLoaderData } from "../../page.testing";
import { mockMetadataStructure } from "../metadata-structure.testing";
import { Component } from "./page";

vi.mock("../../../hooks/useMetadataStructure");
vi.mock("../../../hooks/useCodelists", () => import("../msd-hooks.testing"));
vi.mock("@utils/hooks/organizations", () => import("../msd-hooks.testing"));

vi.mock("../components/MSDLayout", () => ({
  MSDLayout: ({ children, baseUrl, storeCollapseState, disableSectionAnchor }: any) => (
    <div>
      <span>base:{baseUrl === "" ? "(vide)" : baseUrl}</span>
      <span>mémoriseRepli:{String(storeCollapseState)}</span>
      <span>ancresDésactivées:{String(disableSectionAnchor)}</span>
      {children}
    </div>
  ),
}));
vi.mock("./components/MSDHelp", () => ({
  MSDHelp: ({ codelists, organizations }: any) => (
    <div>
      aide|listes:{Object.keys(codelists).length}|organisations:{organizations.length}
    </div>
  ),
}));

let loaderData: unknown;

const renderPage = () => renderWithLoaderData(<Component />, loaderData);

describe("Sims help page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    loaderData = { baseUrl: "/operations/msd", disableSectionAnchor: false };
    mockMetadataStructure({ loaded: true });
  });

  it("affiche l'aide une fois la structure de métadonnées chargée", () => {
    renderPage();

    expect(screen.getByText("aide|listes:1|organisations:1")).toBeInTheDocument();
    expect(screen.getByText("base:/operations/msd")).toBeInTheDocument();
  });

  it("mémorise l'état de repli du sommaire, contrairement aux écrans de rapport", () => {
    renderPage();

    expect(screen.getByText("mémoriseRepli:true")).toBeInTheDocument();
  });

  it("affiche le chargement tant que la structure n'est pas là", () => {
    mockMetadataStructure({ loaded: false });
    renderPage();

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it("retombe sur des valeurs par défaut quand le loader ne fournit rien", () => {
    loaderData = undefined;
    renderPage();

    expect(screen.getByText("base:(vide)")).toBeInTheDocument();
    expect(screen.getByText("ancresDésactivées:false")).toBeInTheDocument();
  });
});
