import { screen, waitFor } from "@testing-library/react";
import { useNavigate, useParams } from "react-router-dom";
import { Mock, vi } from "vitest";

import { useIsDefaultContributorPending } from "@utils/creation/use-default-contributor";
import { useTitle } from "@utils/hooks/useTitle";

import { useCollection } from "../../../hooks/useCollection";
import { useCollections } from "../../../hooks/useCollections";
import { useCollectionSave } from "../../../hooks/useCollectionSave";
import { useConcepts } from "../../../hooks/useConcepts";
import { renderWithQueryClient } from "../../../testing/query-client.testing";
import { Component } from "./page";

vi.mock("react-router-dom", () => ({
  useNavigate: vi.fn(),
  useParams: vi.fn(),
}));

vi.mock("../../../hooks/useCollections", () => ({
  useCollections: vi.fn(),
}));

vi.mock("../../../hooks/useCollection", () => ({
  useCollection: vi.fn(),
}));

vi.mock("../../../hooks/useConcepts", () => ({
  useConcepts: vi.fn(),
}));

vi.mock("../../../hooks/useCollectionSave", () => ({
  useCollectionSave: vi.fn(),
}));

vi.mock("@utils/hooks/useTitle", () => ({
  useTitle: vi.fn(),
}));

vi.mock("@utils/creation/use-default-contributor", () => ({
  useIsDefaultContributorPending: vi.fn(),
}));

vi.mock("@components/loading", () => ({
  Loading: () => <div data-testid="collection-loading">Loading...</div>,
  Saving: () => <div data-testid="collection-saving">Saving...</div>,
}));

vi.mock("./components/CollectionEditionCreation", () => ({
  CollectionEditionCreation: () => <div data-testid="collection-edition-creation">Form</div>,
}));

const mockConceptsLoading = (isLoading: boolean) =>
  (useConcepts as Mock).mockReturnValue({ concepts: [], isLoading });

const mockCollectionLoaded = (general: { id: string; prefLabelLg1: string }) =>
  (useCollection as Mock).mockReturnValue({
    data: { general, members: [] },
    isLoading: false,
  });

const expectTestIdEventually = (testId: string) =>
  waitFor(() => {
    expect(screen.getByTestId(testId)).toBeInTheDocument();
  });

describe("Edition Container Component", () => {
  const mockNavigate = vi.fn();
  const newCollection = { id: "", prefLabelLg1: "" };
  const existingCollection = { id: "123", prefLabelLg1: "Test Collection" };

  beforeEach(() => {
    vi.clearAllMocks();
    (useNavigate as Mock).mockReturnValue(mockNavigate);
    (useCollections as Mock).mockReturnValue({
      data: [{ id: "1", label: { value: "Collection 1", lang: "fr" } }],
    });
    (useCollection as Mock).mockReturnValue({ data: null, isLoading: false });
    mockConceptsLoading(false);
    (useCollectionSave as Mock).mockReturnValue({
      save: vi.fn(),
      isSaving: false,
    });
    (useIsDefaultContributorPending as Mock).mockReturnValue(false);
  });

  describe("Creation mode (no id)", () => {
    beforeEach(() => {
      (useParams as Mock).mockReturnValue({});
    });

    it("renders Loading component while loading concept list", () => {
      mockConceptsLoading(true);

      renderWithQueryClient(<Component />);

      expect(screen.getByTestId("collection-loading")).toBeInTheDocument();
    });

    it("attend la résolution du contributeur par défaut avant d'afficher le formulaire", () => {
      (useIsDefaultContributorPending as Mock).mockReturnValue(true);
      mockCollectionLoaded(newCollection);

      renderWithQueryClient(<Component />);

      expect(screen.getByTestId("collection-loading")).toBeInTheDocument();
    });

    it("renders CollectionEditionCreation component after loading", async () => {
      mockConceptsLoading(false);
      mockCollectionLoaded(newCollection);

      renderWithQueryClient(<Component />);

      await expectTestIdEventually("collection-edition-creation");
    });

    it("calls useTitle with the correct title", () => {
      mockConceptsLoading(false);
      mockCollectionLoaded(newCollection);

      renderWithQueryClient(<Component />);

      expect(useTitle).toHaveBeenCalled();
    });
  });

  describe("Edition mode (with id)", () => {
    beforeEach(() => {
      (useParams as Mock).mockReturnValue({ id: "123" });
    });

    it("n'attend pas la résolution du contributeur par défaut en modification", async () => {
      (useIsDefaultContributorPending as Mock).mockReturnValue(true);
      mockCollectionLoaded(existingCollection);

      renderWithQueryClient(<Component />);

      await expectTestIdEventually("collection-edition-creation");
    });

    it("renders Loading component while loading collection data", () => {
      (useCollection as Mock).mockReturnValue({ data: null, isLoading: true });
      mockConceptsLoading(false);

      renderWithQueryClient(<Component />);

      expect(screen.getByTestId("collection-loading")).toBeInTheDocument();
    });

    it("renders Loading component while loading concept list", async () => {
      mockCollectionLoaded(existingCollection);
      mockConceptsLoading(true);

      renderWithQueryClient(<Component />);

      await expectTestIdEventually("collection-loading");
    });

    it("renders CollectionEditionCreation component after loading", async () => {
      mockCollectionLoaded(existingCollection);
      mockConceptsLoading(false);

      renderWithQueryClient(<Component />);

      await expectTestIdEventually("collection-edition-creation");
    });

    it("calls useTitle with the correct title", () => {
      mockCollectionLoaded(existingCollection);
      mockConceptsLoading(false);

      renderWithQueryClient(<Component />);

      expect(useTitle).toHaveBeenCalled();
    });

    it("renders Saving component when saving", async () => {
      mockCollectionLoaded(existingCollection);
      mockConceptsLoading(false);
      (useCollectionSave as Mock).mockReturnValue({
        save: vi.fn(),
        isSaving: true,
      });

      renderWithQueryClient(<Component />);

      await expectTestIdEventually("collection-saving");

      expect(screen.queryByTestId("collection-edition-creation")).not.toBeInTheDocument();
    });
  });
});
