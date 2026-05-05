import { screen } from "@testing-library/react";
import { vi } from "vitest";

import { renderWithRouter } from "../../../../tests/render";
import { useConcepts } from "../../../hooks/useConcepts";
import { Component } from "./page";

vi.mock("../../../hooks/useConcepts");
vi.mock("./menu", () => ({
  Menu: () => <div data-testid="mock-menu">Mock Menu</div>,
}));

const mockUseConcepts = vi.mocked(useConcepts);

describe("Component (page.tsx)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the loading state initially", () => {
    mockUseConcepts.mockReturnValue({ concepts: [], isLoading: true });

    renderWithRouter(<Component />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("renders the list of concepts after data is loaded", () => {
    const mockConcepts = [
      { id: "1", label: "Concept 1", altLabel: null, _links: { self: { href: "/1" } } },
      { id: "2", label: "Concept 2", altLabel: null, _links: { self: { href: "/2" } } },
    ];
    mockUseConcepts.mockReturnValue({ concepts: mockConcepts, isLoading: false });

    renderWithRouter(<Component />);

    expect(screen.queryByText(/loading/i)).toBeNull();
    expect(screen.getByTestId("mock-menu")).toBeInTheDocument();
    mockConcepts.forEach((concept) => {
      expect(screen.getByText(concept.label)).toBeInTheDocument();
    });
  });

  it("renders the menu component", () => {
    mockUseConcepts.mockReturnValue({ concepts: [], isLoading: false });

    renderWithRouter(<Component />);

    expect(screen.getByTestId("mock-menu")).toBeInTheDocument();
  });
});
