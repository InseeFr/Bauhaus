import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { MSDHelp } from "./MSDHelp";

const params = vi.fn();
vi.mock("react-router-dom", async () => ({
  ...(await vi.importActual("react-router-dom")),
  useParams: () => params(),
}));

vi.mock("./HelpInformation", () => ({
  HelpInformation: ({ msd }) => <p>aide:{msd.idMas}</p>,
}));

// Deux racines, la première avec un enfant lui-même parent : l'aide se rend en profondeur.
const metadataStructure = {
  S1: {
    idMas: "S1",
    masLabelLg1: "Contact",
    children: {
      "S1.1": { idMas: "S1.1", masLabelLg1: "Organisation", children: {} },
    },
  },
  S2: { idMas: "S2", masLabelLg1: "Qualité", children: {} },
};

const renderHelp = () =>
  render(<MSDHelp metadataStructure={metadataStructure} codesLists={{}} organisations={[]} />);

describe("MSDHelp", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    params.mockReturnValue({});
  });

  it("rend l'aide de toutes les rubriques, enfants compris", () => {
    renderHelp();

    expect(screen.getByText("aide:S1")).toBeInTheDocument();
    expect(screen.getByText("aide:S1.1")).toBeInTheDocument();
    expect(screen.getByText("aide:S2")).toBeInTheDocument();
  });

  it("titre chaque rubrique de son identifiant et de son libellé", () => {
    renderHelp();

    expect(screen.getByText("S1 - Contact")).toBeInTheDocument();
  });

  it("ne rend qu'une section quand l'URL en cible une, ses enfants compris", () => {
    params.mockReturnValue({ idSection: "S1" });
    renderHelp();

    expect(screen.getByText("aide:S1")).toBeInTheDocument();
    expect(screen.getByText("aide:S1.1")).toBeInTheDocument();
    expect(screen.queryByText("aide:S2")).not.toBeInTheDocument();
  });

  it("ne rend rien quand la section ciblée n'existe pas", () => {
    params.mockReturnValue({ idSection: "inconnue" });
    renderHelp();

    expect(screen.queryByText(/^aide:/)).not.toBeInTheDocument();
  });
});
