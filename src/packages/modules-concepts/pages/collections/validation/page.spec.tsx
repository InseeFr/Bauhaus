import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import { Component } from "./page";

const translations: Record<string, string> = {
  "collection.title": "Collections",
  "common.btnValid": "Publier",
};

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => translations[key] ?? key,
  }),
}));

vi.mock("@utils/hooks/useTitle", () => ({
  useTitle: vi.fn(),
}));

vi.mock("./components/CollectionsToValidate", () => ({
  default: ({
    collections,
    handleValidateCollectionList,
  }: {
    collections: { id: string; label: string }[];
    handleValidateCollectionList: (ids: string[]) => void;
  }) => (
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

vi.mock("@sdk/new-collection-api", () => ({
  CollectionApi: {
    getCollectionValidateList: () => mockGetCollectionValidateList(),
  },
}));

vi.mock("@sdk/index", () => ({
  ConceptsApi: {
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
      let resolveFetch: (value: typeof mockCollections) => void;
      mockGetCollectionValidateList.mockReturnValue(
        new Promise<typeof mockCollections>((resolve) => {
          resolveFetch = resolve;
        }),
      );

      render(<Component />, { wrapper: createWrapper() });

      expect(screen.getByText("Loading in progress...")).toBeInTheDocument();

      resolveFetch!(mockCollections);

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

      expect(useTitle).toHaveBeenCalledWith(
        translations["collection.title"],
        translations["common.btnValid"],
      );
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

      // 1 initial fetch + 1 refetch triggered by ['unpublished-collections'] invalidation after publish
      expect(mockGetCollectionValidateList).toHaveBeenCalledTimes(2);
      expect(mockPutCollectionValidList).toHaveBeenCalledTimes(1);
    });
  });

  describe("Cache invalidation after publish", () => {
    it("should invalidate ['collections'] and ['unpublished-collections'] so the dashboard shows fresh state without F5", async () => {
      mockGetCollectionValidateList.mockResolvedValue(mockCollections);
      mockPutCollectionValidList.mockResolvedValue({});

      const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
      });
      using invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>{children}</MemoryRouter>
        </QueryClientProvider>
      );

      render(<Component />, { wrapper });

      await waitFor(() => {
        expect(screen.getByTestId("validate-button")).toBeInTheDocument();
      });

      await act(async () => {
        screen.getByTestId("validate-button").click();
      });

      await waitFor(() => {
        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["collections"] });
        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["unpublished-collections"] });
      });
    });
  });
});
