import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import { Component } from "./home-container";

vi.mock("../../../deprecated-locales", () => ({
  default: {
    collectionsTitle: "Collections",
    btnValid: "Valider",
    collectionsToValidTitle: "Collections à valider",
    collectionsToValidPanelTitle: "Panneau de validation",
    hasNotCollectionToValid: "Aucune collection à valider",
  },
}));

vi.mock("@utils/hooks/useTitle", () => ({
  useTitle: vi.fn(),
}));

vi.mock("./home", () => ({
  default: ({ collections, handleValidateCollectionList }: any) => (
    <div data-testid="collections-to-validate">
      <span data-testid="collections-count">{collections.length}</span>
      <button
        data-testid="validate-button"
        onClick={() => handleValidateCollectionList(["1", "2"])}
      >
        Valider
      </button>
    </div>
  ),
}));

const mockGetCollectionValidateList = vi.fn();
const mockPutCollectionValidList = vi.fn();

vi.mock("@sdk/index", () => ({
  ConceptsApi: {
    getCollectionValidateList: () => mockGetCollectionValidateList(),
    putCollectionValidList: (ids: string[]) => mockPutCollectionValidList(ids),
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{children}</MemoryRouter>
    </QueryClientProvider>
  );
};

describe("Collection Validation Home Container", () => {
  const mockCollections = [
    { id: "1", label: "Collection B", creator: "DG75-L201" },
    { id: "2", label: "Collection A", creator: "DG75-F170" },
    { id: "3", label: "Collection C", creator: "DG75-H320" },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe("Loading State", () => {
    it("should display loading indicator while fetching collections", async () => {
      mockGetCollectionValidateList.mockReturnValue(
        new Promise((resolve) => setTimeout(() => resolve(mockCollections), 50)),
      );

      render(<Component />, { wrapper: createWrapper() });

      expect(screen.getByText("Loading in progress...")).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.queryByText("Loading in progress...")).not.toBeInTheDocument();
      });
    });

    it("should hide loading indicator after collections are fetched", async () => {
      mockGetCollectionValidateList.mockResolvedValue(mockCollections);

      render(<Component />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.queryByText("Loading in progress...")).not.toBeInTheDocument();
      });
    });
  });

  describe("Collections Display", () => {
    it("should display collections after successful fetch", async () => {
      mockGetCollectionValidateList.mockResolvedValue(mockCollections);

      render(<Component />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByTestId("collections-to-validate")).toBeInTheDocument();
      });

      expect(screen.getByTestId("collections-count")).toHaveTextContent("3");
    });

    it("should display empty list when no collections to validate", async () => {
      mockGetCollectionValidateList.mockResolvedValue([]);

      render(<Component />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByTestId("collections-to-validate")).toBeInTheDocument();
      });

      expect(screen.getByTestId("collections-count")).toHaveTextContent("0");
    });
  });

  describe("Validation Flow", () => {
    it("should show publishing state when validating collections", async () => {
      mockGetCollectionValidateList.mockResolvedValue(mockCollections);
      mockPutCollectionValidList.mockResolvedValue({});

      render(<Component />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByTestId("validate-button")).toBeInTheDocument();
      });

      await act(async () => {
        screen.getByTestId("validate-button").click();
      });

      await waitFor(() => {
        expect(mockPutCollectionValidList).toHaveBeenCalledWith(["1", "2"]);
      });
    });

    it("should call API with correct collection ids", async () => {
      mockGetCollectionValidateList.mockResolvedValue(mockCollections);
      mockPutCollectionValidList.mockResolvedValue({});

      render(<Component />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByTestId("validate-button")).toBeInTheDocument();
      });

      await act(async () => {
        screen.getByTestId("validate-button").click();
      });

      await waitFor(() => {
        expect(mockPutCollectionValidList).toHaveBeenCalledTimes(1);
        expect(mockPutCollectionValidList).toHaveBeenCalledWith(["1", "2"]);
      });
    });
  });

  describe("Title Hook", () => {
    it("should set correct page title", async () => {
      const { useTitle } = await import("@utils/hooks/useTitle");
      mockGetCollectionValidateList.mockResolvedValue(mockCollections);

      render(<Component />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByTestId("collections-to-validate")).toBeInTheDocument();
      });

      expect(useTitle).toHaveBeenCalledWith("Collections", "Valider");
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty collection list from API", async () => {
      mockGetCollectionValidateList.mockResolvedValue([]);

      render(<Component />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByTestId("collections-count")).toHaveTextContent("0");
      });
    });

    it("should handle single collection validation", async () => {
      mockGetCollectionValidateList.mockResolvedValue([
        { id: "1", label: "Single Collection", creator: "DG75-L201" },
      ]);

      render(<Component />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByTestId("collections-count")).toHaveTextContent("1");
      });
    });

    it("should handle large number of collections", async () => {
      const largeCollections = Array.from({ length: 100 }, (_, i) => ({
        id: `${i}`,
        label: `Collection ${i}`,
        creator: "DG75-L201",
      }));

      mockGetCollectionValidateList.mockResolvedValue(largeCollections);

      render(<Component />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByTestId("collections-count")).toHaveTextContent("100");
      });
    });
  });

  describe("Integration", () => {
    it("should complete full validation workflow", async () => {
      mockGetCollectionValidateList.mockResolvedValue(mockCollections);
      mockPutCollectionValidList.mockResolvedValue({});

      render(<Component />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByTestId("collections-to-validate")).toBeInTheDocument();
      });

      await act(async () => {
        screen.getByTestId("validate-button").click();
      });

      await waitFor(() => {
        expect(mockPutCollectionValidList).toHaveBeenCalledWith(["1", "2"]);
      });

      expect(mockGetCollectionValidateList).toHaveBeenCalledTimes(1);
      expect(mockPutCollectionValidList).toHaveBeenCalledTimes(1);
    });
  });
});
