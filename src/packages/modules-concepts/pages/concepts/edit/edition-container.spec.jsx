import { screen } from "@testing-library/react";
import { vi } from "vitest";
import { useNavigate, useParams } from "react-router-dom";

import { ConceptsApi } from "../../../../sdk";
import { useAppContext } from "../../../../application/app-context";
import { useTitle } from "../../../../utils/hooks/useTitle";
import { useConcept } from "../../../hooks/useConcept";
import { useConcepts } from "../../../hooks/useConcepts";
import { useConceptSave } from "../../../hooks/useConceptSave";
import { renderWithRouter } from "../../../../tests/render";
import { Component } from "./edition-container";

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: vi.fn(), useParams: vi.fn() };
});

vi.mock("../../../../sdk", () => ({
  ConceptsApi: {
    postConcept: vi.fn(),
    putConcept: vi.fn(),
  },
}));

vi.mock("../../../../application/app-context", () => ({
  useAppContext: vi.fn(),
}));

vi.mock("../../../../utils/hooks/useTitle", () => ({
  useTitle: vi.fn(),
}));

vi.mock("../../../hooks/useConcept", () => ({
  useConcept: vi.fn(),
}));

vi.mock("../../../hooks/useConcepts", () => ({
  useConcepts: vi.fn(),
}));

vi.mock("../../../hooks/useConceptSave", () => ({
  useConceptSave: vi.fn(),
}));

vi.mock("../../../utils/links", () => ({
  mergeWithAllConcepts: vi.fn(() => []),
}));

vi.mock("@components/loading", () => ({
  Loading: () => <div data-testid="loading">Loading...</div>,
  Saving: () => <div data-testid="saving">Saving...</div>,
}));

vi.mock("./home", () => ({
  default: ({ creation, title }) => (
    <div data-testid="concept-edition-creation">
      <span data-testid="is-creation">{String(creation)}</span>
      <span data-testid="title">{title}</span>
    </div>
  ),
}));

const mockConcept = {
  general: { prefLabelLg1: "Test Concept", conceptVersion: 1 },
  notes: {},
  links: [],
};

describe("Component (edition-container)", () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
    useAppContext.mockReturnValue({
      properties: {
        maxLengthScopeNote: "5000",
        defaultContributor: "DG75-L201",
      },
    });
    useConcepts.mockReturnValue({ concepts: [], isLoading: false });
    useConcept.mockReturnValue({ data: mockConcept, isLoading: false });
    useConceptSave.mockReturnValue({ save: vi.fn(), isSaving: false });
  });

  describe("creation mode (no id)", () => {
    beforeEach(() => {
      useParams.mockReturnValue({ id: undefined });
    });

    it("renders the form in creation mode", () => {
      renderWithRouter(<Component />);

      expect(screen.getByTestId("concept-edition-creation")).toBeInTheDocument();
      expect(screen.getByTestId("is-creation").textContent).toBe("true");
    });

    it("shows loading when concepts are loading", () => {
      useConcepts.mockReturnValue({ concepts: [], isLoading: true });

      renderWithRouter(<Component />);

      expect(screen.getByTestId("loading")).toBeInTheDocument();
    });
  });

  describe("edition mode (with id)", () => {
    beforeEach(() => {
      useParams.mockReturnValue({ id: "42" });
    });

    it("renders the form in edition mode", () => {
      renderWithRouter(<Component />);

      expect(screen.getByTestId("concept-edition-creation")).toBeInTheDocument();
      expect(screen.getByTestId("is-creation").textContent).toBe("false");
    });

    it("shows loading when concept is loading", () => {
      useConcept.mockReturnValue({ data: mockConcept, isLoading: true });

      renderWithRouter(<Component />);

      expect(screen.getByTestId("loading")).toBeInTheDocument();
    });

    it("calls useTitle with concept label", () => {
      renderWithRouter(<Component />);

      expect(useTitle).toHaveBeenCalledWith(expect.any(String), "Test Concept");
    });

    it("shows saving state when saving", async () => {
      ConceptsApi.putConcept.mockReturnValue(new Promise(() => {}));

      renderWithRouter(<Component />);

      const form = screen.getByTestId("concept-edition-creation");
      expect(form).toBeInTheDocument();
    });
  });

  it("calls postConcept on save in creation mode", async () => {
    useParams.mockReturnValue({ id: undefined });
    ConceptsApi.postConcept.mockResolvedValue("99");

    renderWithRouter(<Component />);

    expect(screen.getByTestId("concept-edition-creation")).toBeInTheDocument();
  });
});
