import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { useOrganizations } from "@utils/hooks/organizations";

import { SimsBlockOrganisation } from "./SimsBlockOrganisation";

vi.mock("@utils/hooks/organizations", () => ({ useOrganizations: vi.fn() }));

const organisations = [
  { id: "DG75-A040", iri: "http://bauhaus/organisations/DG75-A040", label: "Insee A040" },
  { id: "DG75-L001", iri: "http://bauhaus/organisations/DG75-L001", label: "Insee L001" },
];

describe("SimsBlockOrganisation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useOrganizations).mockReturnValue({ data: organisations });
  });

  it("résout l'organisation par son IRI", () => {
    render(
      <SimsBlockOrganisation
        currentSection={{ value: "http://bauhaus/organisations/DG75-A040" }}
      />,
    );

    expect(screen.getByText("Insee A040")).toBeInTheDocument();
  });

  it("résout aussi l'organisation par son timbre", () => {
    render(<SimsBlockOrganisation currentSection={{ value: "DG75-L001" }} />);

    expect(screen.getByText("Insee L001")).toBeInTheDocument();
  });

  it("n'affiche rien quand la rubrique est vide", () => {
    const { container } = render(<SimsBlockOrganisation currentSection={{}} />);

    expect(container).toBeEmptyDOMElement();
  });

  it("n'affiche rien sans rubrique du tout", () => {
    const { container } = render(<SimsBlockOrganisation />);

    expect(container).toBeEmptyDOMElement();
  });

  it("rend un libellé vide plutôt qu'une erreur pour une organisation inconnue", () => {
    const { container } = render(<SimsBlockOrganisation currentSection={{ value: "inconnue" }} />);

    expect(container.querySelector("span")).toBeEmptyDOMElement();
  });

  it("tolère un référentiel d'organisations non chargé", () => {
    vi.mocked(useOrganizations).mockReturnValue({ data: undefined });

    const { container } = render(<SimsBlockOrganisation currentSection={{ value: "DG75-L001" }} />);

    expect(container.querySelector("span")).toBeEmptyDOMElement();
  });
});
