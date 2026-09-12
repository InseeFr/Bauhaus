import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { Component } from "./page";

const loaderData = vi.fn();
vi.mock("react-router-dom", async () => ({
  ...(await vi.importActual<typeof import("react-router-dom")>("react-router-dom")),
  useLoaderData: () => loaderData(),
}));

const useMetadataStructure = vi.fn();
vi.mock("../../../hooks/useMetadataStructure", () => ({
  useMetadataStructure: () => useMetadataStructure(),
}));
vi.mock("../../../hooks/useCodelists", () => ({
  useCodelists: () => ({ codelists: { CL_1: [] } }),
}));
vi.mock("@utils/hooks/organizations", () => ({
  useOrganizations: () => ({ data: [{ id: "org-1" }] }),
}));

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

describe("Sims help page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    loaderData.mockReturnValue({ baseUrl: "/operations/msd", disableSectionAnchor: false });
    useMetadataStructure.mockReturnValue({ isLoading: false, metadataStructure: {} });
  });

  it("affiche l'aide une fois la structure de métadonnées chargée", () => {
    render(<Component />);

    expect(screen.getByText("aide|listes:1|organisations:1")).toBeInTheDocument();
    expect(screen.getByText("base:/operations/msd")).toBeInTheDocument();
  });

  it("mémorise l'état de repli du sommaire, contrairement aux écrans de rapport", () => {
    render(<Component />);

    expect(screen.getByText("mémoriseRepli:true")).toBeInTheDocument();
  });

  it("affiche le chargement tant que la structure n'est pas là", () => {
    useMetadataStructure.mockReturnValue({ isLoading: true, metadataStructure: undefined });
    render(<Component />);

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it("retombe sur des valeurs par défaut quand le loader ne fournit rien", () => {
    loaderData.mockReturnValue(undefined);
    render(<Component />);

    expect(screen.getByText("base:(vide)")).toBeInTheDocument();
    expect(screen.getByText("ancresDésactivées:false")).toBeInTheDocument();
  });
});
