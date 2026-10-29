import { screen } from "@testing-library/react";
import { useNavigate, useParams } from "react-router";
import { Mock, vi } from "vitest";

import { ConceptsApi } from "@sdk/index";

import { useIsDefaultContributorPending } from "@utils/creation/use-default-contributor";
import { useTitle } from "@utils/hooks/useTitle";

import { useAppContext } from "../../../../application/app-context";
import { expectItemNotFound } from "../../../../tests/loading-error.testing";
import { renderWithRouter } from "../../../../tests/render";
import { sdkRejection } from "../../../../tests/sdk-rejection.testing";
import { useConcept } from "../../../hooks/useConcept";
import { useConcepts } from "../../../hooks/useConcepts";
import { useConceptSave } from "../../../hooks/useConceptSave";
import { Component } from "./page";

vi.mock("react-router", async () => {
  const actual = await vi.importActual<typeof import("react-router")>("react-router");
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

vi.mock("../../../../utils/creation/use-default-contributor", () => ({
  useIsDefaultContributorPending: vi.fn(),
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

vi.mock("../../../utils/mergeWithAllConcepts", () => ({
  mergeWithAllConcepts: vi.fn(() => []),
}));

vi.mock("@components/loading", () => ({
  Loading: () => <div data-testid="loading">Loading...</div>,
  Saving: () => <div data-testid="saving">Saving...</div>,
}));

vi.mock("./components/ConceptEditionCreation", () => ({
  ConceptEditionCreation: ({ creation, title }: { creation: boolean; title: string }) => (
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
    (useNavigate as Mock).mockReturnValue(mockNavigate);
    (useAppContext as Mock).mockReturnValue({
      properties: {
        maxLengthScopeNote: "5000",
        defaultContributor: "DG75-L201",
      },
    });
    (useConcepts as Mock).mockReturnValue({ concepts: [], isLoading: false });
    (useConcept as Mock).mockReturnValue({
      data: mockConcept,
      isLoading: false,
    });
    (useConceptSave as Mock).mockReturnValue({
      save: vi.fn(),
      isSaving: false,
    });
    (useIsDefaultContributorPending as Mock).mockReturnValue(false);
  });

  describe("creation mode (no id)", () => {
    beforeEach(() => {
      (useParams as Mock).mockReturnValue({ id: undefined });
    });

    it("renders the form in creation mode", () => {
      renderWithRouter(<Component />);

      expect(screen.getByTestId("concept-edition-creation")).toBeInTheDocument();
      expect(screen.getByTestId("is-creation").textContent).toBe("true");
    });

    it("attend la résolution du contributeur par défaut avant d'afficher le formulaire", () => {
      (useIsDefaultContributorPending as Mock).mockReturnValue(true);

      renderWithRouter(<Component />);

      expect(screen.getByTestId("loading")).toBeInTheDocument();
    });

    it("shows loading when concepts are loading", () => {
      (useConcepts as Mock).mockReturnValue({ concepts: [], isLoading: true });

      renderWithRouter(<Component />);

      expect(screen.getByTestId("loading")).toBeInTheDocument();
    });
  });

  describe("edition mode (with id)", () => {
    beforeEach(() => {
      (useParams as Mock).mockReturnValue({ id: "42" });
    });

    it("renders the form in edition mode", () => {
      renderWithRouter(<Component />);

      expect(screen.getByTestId("concept-edition-creation")).toBeInTheDocument();
      expect(screen.getByTestId("is-creation").textContent).toBe("false");
    });

    it("n'attend pas la résolution du contributeur par défaut en modification", () => {
      (useIsDefaultContributorPending as Mock).mockReturnValue(true);

      renderWithRouter(<Component />);

      expect(screen.getByTestId("concept-edition-creation")).toBeInTheDocument();
    });

    it("shows loading when concept is loading", () => {
      (useConcept as Mock).mockReturnValue({
        data: mockConcept,
        isLoading: true,
      });

      renderWithRouter(<Component />);

      expect(screen.getByTestId("loading")).toBeInTheDocument();
    });

    it("says the concept could not be found instead of loading forever on a 404", async () => {
      (useConcept as Mock).mockReturnValue({
        data: undefined,
        isLoading: false,
        error: sdkRejection.emptyBody(404),
      });

      renderWithRouter(<Component />);

      await expectItemNotFound();
      expect(screen.queryByTestId("loading")).not.toBeInTheDocument();
      expect(screen.queryByTestId("concept-edition-creation")).not.toBeInTheDocument();
    });

    it("calls useTitle with concept label", () => {
      renderWithRouter(<Component />);

      expect(useTitle).toHaveBeenCalledWith(expect.any(String), "Test Concept");
    });

    it("shows saving state when saving", async () => {
      (ConceptsApi.putConcept as Mock).mockReturnValue(new Promise(() => {}));

      renderWithRouter(<Component />);

      const form = screen.getByTestId("concept-edition-creation");
      expect(form).toBeInTheDocument();
    });
  });

  it("calls postConcept on save in creation mode", async () => {
    (useParams as Mock).mockReturnValue({ id: undefined });
    (ConceptsApi.postConcept as Mock).mockResolvedValue("99");

    renderWithRouter(<Component />);

    expect(screen.getByTestId("concept-edition-creation")).toBeInTheDocument();
  });
});
