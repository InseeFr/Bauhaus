import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { Organization } from "@model/organization";
import { CreatorsVisualisation } from ".";

// Mock du module i18n
vi.mock("../../i18n", () => ({
  default: {
    creatorTitle: "Créateur",
  },
}));

// Mock du composant Organisation
vi.mock("../organisations/organisations", () => ({
  Organisation: ({
    creator,
    organizations,
  }: {
    creator: string;
    organizations: Organization[];
  }) => (
    <span data-testid="organisation-mock">
      {creator} - {organizations.length} organisations
    </span>
  ),
}));

describe("CreatorsVisualisation", () => {
  const mockOrganizations: Organization[] = [
    { id: "1", label: "Org 1", labelLg2: "Org 1", iri: "iri" },
    { id: "2", label: "Org 2", labelLg2: "Org 2", iri: "iri" },
  ] as Organization[];

  it("should render the creator title", () => {
    render(<CreatorsVisualisation creator="John Doe" organizations={mockOrganizations} />);

    expect(screen.getByText(/Créateur/)).toBeInTheDocument();
  });

  it("should render the Organisation component", () => {
    render(<CreatorsVisualisation creator="John Doe" organizations={mockOrganizations} />);

    expect(screen.getByTestId("organisation-mock")).toBeInTheDocument();
  });

  it("should pass creator prop to Organisation component", () => {
    render(<CreatorsVisualisation creator="Jane Doe" organizations={mockOrganizations} />);

    expect(screen.getByTestId("organisation-mock")).toHaveTextContent("Jane Doe");
  });

  it("should pass organizations prop to Organisation component", () => {
    render(<CreatorsVisualisation creator="John Doe" organizations={mockOrganizations} />);

    expect(screen.getByTestId("organisation-mock")).toHaveTextContent("2 organisations");
  });

  it("should handle empty organizations array", () => {
    render(<CreatorsVisualisation creator="John Doe" organizations={[]} />);

    expect(screen.getByTestId("organisation-mock")).toHaveTextContent("0 organisations");
  });
});
