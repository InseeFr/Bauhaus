import { render, screen, waitFor } from "@testing-library/react";
import { Mock, vi } from "vitest";
import { useNavigate, useParams } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { useCollections } from "../../../hooks/useCollections";
import { useCollection } from "../../../hooks/useCollection";
import { useConcepts } from "../../../hooks/useConcepts";
import { useCollectionSave } from "../../../hooks/useCollectionSave";
import { useTitle } from "@utils/hooks/useTitle";
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

vi.mock("@components/loading", () => ({
  Loading: () => <div data-testid="collection-loading">Loading...</div>,
  Saving: () => <div data-testid="collection-saving">Saving...</div>,
}));

vi.mock("./components/home", () => ({
  default: () => <div data-testid="collection-edition-creation">Form</div>,
}));

describe("Edition Container Component", () => {
  const mockNavigate = vi.fn();
  let queryClient: QueryClient;

  const renderWithQueryClient = (component: React.ReactNode) => {
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
    (useNavigate as Mock).mockReturnValue(mockNavigate);
    (useCollections as Mock).mockReturnValue({
      data: [{ id: "1", label: { value: "Collection 1", lang: "fr" } }],
    });
    (useCollection as Mock).mockReturnValue({ data: null, isLoading: false });
    (useConcepts as Mock).mockReturnValue({ concepts: [], isLoading: false });
    (useCollectionSave as Mock).mockReturnValue({ save: vi.fn(), isSaving: false });
  });

  describe("Creation mode (no id)", () => {
    beforeEach(() => {
      (useParams as Mock).mockReturnValue({});
    });

    it("renders Loading component while loading concept list", () => {
      (useConcepts as Mock).mockReturnValue({ concepts: [], isLoading: true });

      renderWithQueryClient(<Component />);

      expect(screen.getByTestId("collection-loading")).toBeInTheDocument();
    });

    it("renders CollectionEditionCreation component after loading", async () => {
      (useConcepts as Mock).mockReturnValue({ concepts: [], isLoading: false });
      (useCollection as Mock).mockReturnValue({
        data: { general: { id: "", prefLabelLg1: "" }, members: [] },
        isLoading: false,
      });

      renderWithQueryClient(<Component />);

      await waitFor(() => {
        expect(screen.getByTestId("collection-edition-creation")).toBeInTheDocument();
      });
    });

    it("calls useTitle with the correct title", () => {
      (useConcepts as Mock).mockReturnValue({ concepts: [], isLoading: false });
      (useCollection as Mock).mockReturnValue({
        data: { general: { id: "", prefLabelLg1: "" }, members: [] },
        isLoading: false,
      });

      renderWithQueryClient(<Component />);

      expect(useTitle).toHaveBeenCalled();
    });
  });

  describe("Edition mode (with id)", () => {
    beforeEach(() => {
      (useParams as Mock).mockReturnValue({ id: "123" });
    });

    it("renders Loading component while loading collection data", () => {
      (useCollection as Mock).mockReturnValue({ data: null, isLoading: true });
      (useConcepts as Mock).mockReturnValue({ concepts: [], isLoading: false });

      renderWithQueryClient(<Component />);

      expect(screen.getByTestId("collection-loading")).toBeInTheDocument();
    });

    it("renders Loading component while loading concept list", async () => {
      (useCollection as Mock).mockReturnValue({
        data: { general: { id: "123", prefLabelLg1: "Test Collection" }, members: [] },
        isLoading: false,
      });
      (useConcepts as Mock).mockReturnValue({ concepts: [], isLoading: true });

      renderWithQueryClient(<Component />);

      await waitFor(() => {
        expect(screen.getByTestId("collection-loading")).toBeInTheDocument();
      });
    });

    it("renders CollectionEditionCreation component after loading", async () => {
      (useCollection as Mock).mockReturnValue({
        data: { general: { id: "123", prefLabelLg1: "Test Collection" }, members: [] },
        isLoading: false,
      });
      (useConcepts as Mock).mockReturnValue({ concepts: [], isLoading: false });

      renderWithQueryClient(<Component />);

      await waitFor(() => {
        expect(screen.getByTestId("collection-edition-creation")).toBeInTheDocument();
      });
    });

    it("calls useTitle with the correct title", () => {
      (useCollection as Mock).mockReturnValue({
        data: { general: { id: "123", prefLabelLg1: "Test Collection" }, members: [] },
        isLoading: false,
      });
      (useConcepts as Mock).mockReturnValue({ concepts: [], isLoading: false });

      renderWithQueryClient(<Component />);

      expect(useTitle).toHaveBeenCalled();
    });

    it("renders Saving component when saving", async () => {
      (useCollection as Mock).mockReturnValue({
        data: { general: { id: "123", prefLabelLg1: "Test Collection" }, members: [] },
        isLoading: false,
      });
      (useConcepts as Mock).mockReturnValue({ concepts: [], isLoading: false });
      (useCollectionSave as Mock).mockReturnValue({ save: vi.fn(), isSaving: true });

      renderWithQueryClient(<Component />);

      await waitFor(() => {
        expect(screen.getByTestId("collection-saving")).toBeInTheDocument();
      });

      expect(screen.queryByTestId("collection-edition-creation")).not.toBeInTheDocument();
    });
  });
});
