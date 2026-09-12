import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { useOrganizations } from "@utils/hooks/organizations";

import { SimsBlockOrganization } from "./SimsBlockOrganization";

vi.mock("@utils/hooks/organizations", () => ({ useOrganizations: vi.fn() }));

const organizations = [
  { id: "DG75-A040", iri: "http://bauhaus/organizations/DG75-A040", label: "Insee A040" },
  { id: "DG75-L001", iri: "http://bauhaus/organizations/DG75-L001", label: "Insee L001" },
];

describe("SimsBlockOrganization", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useOrganizations).mockReturnValue({ data: organizations } as any);
  });

  it("résout l'organisation par son IRI", () => {
    render(
      <SimsBlockOrganization
        currentSection={{ value: "http://bauhaus/organizations/DG75-A040" } as any}
      />,
    );

    expect(screen.getByText("Insee A040")).toBeInTheDocument();
  });

  it("résout aussi l'organisation par son timbre", () => {
    render(<SimsBlockOrganization currentSection={{ value: "DG75-L001" } as any} />);

    expect(screen.getByText("Insee L001")).toBeInTheDocument();
  });

  it("n'affiche rien quand la rubrique est vide", () => {
    const { container } = render(<SimsBlockOrganization currentSection={{} as any} />);

    expect(container).toBeEmptyDOMElement();
  });

  it("n'affiche rien sans rubrique du tout", () => {
    const { container } = render(<SimsBlockOrganization currentSection={undefined as any} />);

    expect(container).toBeEmptyDOMElement();
  });

  it("rend un libellé vide plutôt qu'une erreur pour une organisation inconnue", () => {
    const { container } = render(
      <SimsBlockOrganization currentSection={{ value: "inconnue" } as any} />,
    );

    expect(container.querySelector("span")).toBeEmptyDOMElement();
  });

  it("tolère un référentiel d'organisations non chargé", () => {
    vi.mocked(useOrganizations).mockReturnValue({ data: undefined } as any);

    const { container } = render(
      <SimsBlockOrganization currentSection={{ value: "DG75-L001" } as any} />,
    );

    expect(container.querySelector("span")).toBeEmptyDOMElement();
  });
});
