import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { Organization } from "@model/organization";
import { ContributorsVisualisation } from ".";

// Mock du module i18n
vi.mock("../../i18n", () => ({
  default: {
    contributorTitle: "Contributeurs",
  },
}));

// Mock du composant Organisations
vi.mock("../organisations/organisations", () => ({
  Organisations: ({
    creators,
    organizations,
  }: {
    creators: string[];
    organizations: Organization[];
  }) => (
    <span data-testid="organisations-mock">
      {creators.join(", ")} - {organizations.length} organisations
    </span>
  ),
}));

describe("ContributorsVisualisation", () => {
  const mockOrganizations: Organization[] = [
    { id: "1", label: "Org 1", labelLg2: "Org 1", iri: "iri" },
    { id: "2", label: "Org 2", labelLg2: "Org 2", iri: "iri" },
  ] as Organization[];

  const mockCreators = ["John Doe", "Jane Doe"];

  it("should render the contributor title", () => {
    render(<ContributorsVisualisation creators={mockCreators} organizations={mockOrganizations} />);

    expect(screen.getByText(/Contributeurs/)).toBeInTheDocument();
  });

  it("should render the Organisations component", () => {
    render(<ContributorsVisualisation creators={mockCreators} organizations={mockOrganizations} />);

    expect(screen.getByTestId("organisations-mock")).toBeInTheDocument();
  });

  it("should pass creators prop to Organisations component", () => {
    render(<ContributorsVisualisation creators={mockCreators} organizations={mockOrganizations} />);

    expect(screen.getByTestId("organisations-mock")).toHaveTextContent("John Doe, Jane Doe");
  });

  it("should pass organizations prop to Organisations component", () => {
    render(<ContributorsVisualisation creators={mockCreators} organizations={mockOrganizations} />);

    expect(screen.getByTestId("organisations-mock")).toHaveTextContent("2 organisations");
  });

  it("should handle empty creators array", () => {
    render(<ContributorsVisualisation creators={[]} organizations={mockOrganizations} />);

    expect(screen.getByTestId("organisations-mock")).toBeInTheDocument();
  });

  it("should handle empty organizations array", () => {
    render(<ContributorsVisualisation creators={mockCreators} organizations={[]} />);

    expect(screen.getByTestId("organisations-mock")).toHaveTextContent("0 organisations");
  });

  it("should handle single creator", () => {
    render(
      <ContributorsVisualisation creators={["Solo Creator"]} organizations={mockOrganizations} />,
    );

    expect(screen.getByTestId("organisations-mock")).toHaveTextContent("Solo Creator");
  });
});
