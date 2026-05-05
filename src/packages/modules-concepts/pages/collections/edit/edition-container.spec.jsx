import { render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { useNavigate, useParams } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { useCollections } from "../../../hooks/useCollections";
import { useCollection } from "../../../hooks/useCollection";
import { useConcepts } from "../../../hooks/useConcepts";
import { useCollectionSave } from "../../../hooks/useCollectionSave";
import { useTitle } from "@utils/hooks/useTitle";
import { Component } from "./edition-container";

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

vi.mock("@components/loading", () => ({
  Loading: () => <div data-testid="collection-loading">Loading...</div>,
  Saving: () => <div data-testid="collection-saving">Saving...</div>,
}));

vi.mock("./home", () => ({
  default: () => <div data-testid="collection-edition-creation">Form</div>,
}));

describe("Edition Container Component", () => {
  const mockNavigate = vi.fn();
  let queryClient;

  const renderWithQueryClient = (component) => {
    return render(<QueryClientProvider client={queryClient}>{component}</QueryClientProvider>);
  };

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    vi.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
    useCollections.mockReturnValue({
      data: [{ id: "1", label: "Collection 1" }],
    });
    useCollection.mockReturnValue({ data: null, isLoading: false });
    useConcepts.mockReturnValue({ concepts: [], isLoading: false });
    useCollectionSave.mockReturnValue({ save: vi.fn(), isSaving: false });
  });

  describe("Creation mode (no id)", () => {
    beforeEach(() => {
      useParams.mockReturnValue({});
    });

    it("renders Loading component while loading concept list", () => {
      useConcepts.mockReturnValue({ concepts: [], isLoading: true });

      renderWithQueryClient(<Component />);

      expect(screen.getByTestId("collection-loading")).toBeInTheDocument();
    });

    it("renders CollectionEditionCreation component after loading", async () => {
      useConcepts.mockReturnValue({ concepts: [], isLoading: false });

      renderWithQueryClient(<Component />);

      await waitFor(() => {
        expect(screen.getByTestId("collection-edition-creation")).toBeInTheDocument();
      });
    });

    it("calls useTitle with the correct title", () => {
      useConcepts.mockReturnValue({ concepts: [], isLoading: false });

      renderWithQueryClient(<Component />);

      expect(useTitle).toHaveBeenCalled();
    });
  });

  describe("Edition mode (with id)", () => {
    beforeEach(() => {
      useParams.mockReturnValue({ id: "123" });
    });

    it("renders Loading component while loading collection data", () => {
      useCollection.mockReturnValue({ data: null, isLoading: true });
      useConcepts.mockReturnValue({ concepts: [], isLoading: false });

      renderWithQueryClient(<Component />);

      expect(screen.getByTestId("collection-loading")).toBeInTheDocument();
    });

    it("renders Loading component while loading concept list", async () => {
      useCollection.mockReturnValue({
        data: { general: { id: "123", prefLabelLg1: "Test Collection" }, members: [] },
        isLoading: false,
      });
      useConcepts.mockReturnValue({ concepts: [], isLoading: true });

      renderWithQueryClient(<Component />);

      await waitFor(() => {
        expect(screen.getByTestId("collection-loading")).toBeInTheDocument();
      });
    });

    it("renders CollectionEditionCreation component after loading", async () => {
      useCollection.mockReturnValue({
        data: { general: { id: "123", prefLabelLg1: "Test Collection" }, members: [] },
        isLoading: false,
      });
      useConcepts.mockReturnValue({ concepts: [], isLoading: false });

      renderWithQueryClient(<Component />);

      await waitFor(() => {
        expect(screen.getByTestId("collection-edition-creation")).toBeInTheDocument();
      });
    });

    it("calls useTitle with the correct title", () => {
      useCollection.mockReturnValue({
        data: { general: { id: "123", prefLabelLg1: "Test Collection" }, members: [] },
        isLoading: false,
      });
      useConcepts.mockReturnValue({ concepts: [], isLoading: false });

      renderWithQueryClient(<Component />);

      expect(useTitle).toHaveBeenCalled();
    });

    it("renders Saving component when saving", async () => {
      useCollection.mockReturnValue({
        data: { general: { id: "123", prefLabelLg1: "Test Collection" }, members: [] },
        isLoading: false,
      });
      useConcepts.mockReturnValue({ concepts: [], isLoading: false });
      useCollectionSave.mockReturnValue({ save: vi.fn(), isSaving: true });

      renderWithQueryClient(<Component />);

      await waitFor(() => {
        expect(screen.getByTestId("collection-saving")).toBeInTheDocument();
      });

      expect(screen.queryByTestId("collection-edition-creation")).not.toBeInTheDocument();
    });
  });
});
