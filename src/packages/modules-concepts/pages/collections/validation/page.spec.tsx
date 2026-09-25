import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";

import { createTestQueryClient } from "../../../testing/query-client.testing";
import { Component } from "./page";

const translations: Record<string, string> = {
  "collection.title": "Collections",
  "common.btnValid": "Publier",
};

vi.mock("react-i18next", async () =>
  (await import("../../../testing/i18n.testing")).translatingWith(() => translations),
);

vi.mock("@utils/hooks/useTitle", () => ({
  useTitle: vi.fn(),
}));

vi.mock("./components/CollectionsToValidate", () => ({
  CollectionsToValidate: ({
    collections,
    handleValidateCollectionList,
    serverSideError,
  }: {
    collections: { id: string; label: string }[];
    handleValidateCollectionList: (ids: string[]) => void;
    serverSideError?: string;
  }) => (
    <div data-testid="collections-to-validate">
      <span data-testid="collections-count">{collections.length}</span>
      <span data-testid="server-side-error">{serverSideError}</span>
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

const VALIDATION_ROUTE = "/concepts/collections/validation";

const LocationProbe = () => <span data-testid="location">{useLocation().pathname}</span>;

type Wrapper = ({ children }: { children: React.ReactNode }) => React.JSX.Element;

const createWrapper = (): Wrapper => {
  const queryClient = createTestQueryClient();
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[VALIDATION_ROUTE]}>
        {children}
        <LocationProbe />
      </MemoryRouter>
    </QueryClientProvider>
  );
};

const renderPage = (wrapper: Wrapper = createWrapper()) => render(<Component />, { wrapper });

const waitForTestId = (testId: string) =>
  waitFor(() => {
    expect(screen.getByTestId(testId)).toBeInTheDocument();
  });

const waitForCount = (count: string) =>
  waitFor(() => {
    expect(screen.getByTestId("collections-count")).toHaveTextContent(count);
  });

const clickValidate = () =>
  act(async () => {
    screen.getByTestId("validate-button").click();
  });

/** Rend la page, attend que la liste soit prête puis déclenche la publication. */
const renderAndPublish = async ({
  wrapper,
  readyTestId = "validate-button",
}: { wrapper?: Wrapper; readyTestId?: string } = {}) => {
  renderPage(wrapper);
  await waitForTestId(readyTestId);
  await clickValidate();
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

      renderPage();

      expect(screen.getByText("Loading in progress...")).toBeInTheDocument();

      resolveFetch!(mockCollections);

      await waitFor(() => {
        expect(screen.queryByText("Loading in progress...")).not.toBeInTheDocument();
      });
    });

    it("should hide loading indicator after collections are fetched", async () => {
      mockGetCollectionValidateList.mockResolvedValue(mockCollections);

      renderPage();

      await waitFor(() => {
        expect(screen.queryByText("Loading in progress...")).not.toBeInTheDocument();
      });
    });
  });

  describe("Collections Display", () => {
    it("should display collections after successful fetch", async () => {
      mockGetCollectionValidateList.mockResolvedValue(mockCollections);

      renderPage();

      await waitForTestId("collections-to-validate");

      expect(screen.getByTestId("collections-count")).toHaveTextContent("3");
    });

    it("should display empty list when no collections to validate", async () => {
      mockGetCollectionValidateList.mockResolvedValue([]);

      renderPage();

      await waitForTestId("collections-to-validate");

      expect(screen.getByTestId("collections-count")).toHaveTextContent("0");
    });
  });

  describe("Validation Flow", () => {
    it("should show publishing state when validating collections", async () => {
      mockGetCollectionValidateList.mockResolvedValue(mockCollections);
      mockPutCollectionValidList.mockResolvedValue({});

      await renderAndPublish();

      await waitFor(() => {
        expect(mockPutCollectionValidList).toHaveBeenCalledWith(["1", "2"]);
      });
    });

    it("should call API with correct collection ids", async () => {
      mockGetCollectionValidateList.mockResolvedValue(mockCollections);
      mockPutCollectionValidList.mockResolvedValue({});

      await renderAndPublish();

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

      renderPage();

      await waitForTestId("collections-to-validate");

      expect(useTitle).toHaveBeenCalledWith(
        translations["collection.title"],
        translations["common.btnValid"],
      );
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty collection list from API", async () => {
      mockGetCollectionValidateList.mockResolvedValue([]);

      renderPage();

      await waitForCount("0");
    });

    it("should handle single collection validation", async () => {
      mockGetCollectionValidateList.mockResolvedValue([
        { id: "1", label: "Single Collection", creator: "DG75-L201" },
      ]);

      renderPage();

      await waitForCount("1");
    });

    it("should handle large number of collections", async () => {
      const largeCollections = Array.from({ length: 100 }, (_, i) => ({
        id: `${i}`,
        label: `Collection ${i}`,
        creator: "DG75-L201",
      }));

      mockGetCollectionValidateList.mockResolvedValue(largeCollections);

      renderPage();

      await waitForCount("100");
    });
  });

  describe("Integration", () => {
    it("should complete full validation workflow", async () => {
      mockGetCollectionValidateList.mockResolvedValue(mockCollections);
      mockPutCollectionValidList.mockResolvedValue({});

      await renderAndPublish({ readyTestId: "collections-to-validate" });

      await waitFor(() => {
        expect(mockPutCollectionValidList).toHaveBeenCalledWith(["1", "2"]);
      });

      // 1 initial fetch + 1 refetch triggered by ['unpublished-collections'] invalidation after publish
      expect(mockGetCollectionValidateList).toHaveBeenCalledTimes(2);
      expect(mockPutCollectionValidList).toHaveBeenCalledTimes(1);
    });
  });

  describe("After publish", () => {
    it("should stay on the validation page", async () => {
      mockGetCollectionValidateList.mockResolvedValue(mockCollections);
      mockPutCollectionValidList.mockResolvedValue({});

      await renderAndPublish();

      await waitFor(() => {
        expect(mockPutCollectionValidList).toHaveBeenCalled();
      });
      expect(screen.getByTestId("location")).toHaveTextContent(VALIDATION_ROUTE);
    });

    it("should show the refreshed list of collections still to publish", async () => {
      mockGetCollectionValidateList
        .mockResolvedValueOnce(mockCollections)
        .mockResolvedValue([mockCollections[2]]);
      mockPutCollectionValidList.mockResolvedValue({});

      renderPage();

      await waitForCount("3");

      await clickValidate();

      await waitForCount("1");
    });

    it("should report the message returned by the back-office when the publication fails", async () => {
      mockGetCollectionValidateList.mockResolvedValue(mockCollections);
      mockPutCollectionValidList.mockRejectedValue({
        detail: "Collections already published: c1000",
        status: 400,
      });

      await renderAndPublish();

      await waitFor(() => {
        expect(screen.getByTestId("server-side-error")).toHaveTextContent(
          "Collections already published: c1000",
        );
      });
    });

    it("should clear a previous failure when the publication succeeds", async () => {
      mockGetCollectionValidateList.mockResolvedValue(mockCollections);
      mockPutCollectionValidList
        .mockRejectedValueOnce({ detail: "Collections already published: c1000", status: 400 })
        .mockResolvedValue({});

      await renderAndPublish();
      await waitFor(() => {
        expect(screen.getByTestId("server-side-error")).not.toBeEmptyDOMElement();
      });

      await clickValidate();

      await waitFor(() => {
        expect(screen.getByTestId("server-side-error")).toBeEmptyDOMElement();
      });
    });

    it("should leave the publishing state even when the API call fails", async () => {
      mockGetCollectionValidateList.mockResolvedValue(mockCollections);
      mockPutCollectionValidList.mockRejectedValue(new Error("400"));

      await renderAndPublish();

      await waitForTestId("collections-to-validate");
      expect(screen.queryByText("Publishing in progress...")).not.toBeInTheDocument();
    });
  });

  describe("Cache invalidation after publish", () => {
    it("should invalidate ['collections'] and ['unpublished-collections'] so the dashboard shows fresh state without F5", async () => {
      mockGetCollectionValidateList.mockResolvedValue(mockCollections);
      mockPutCollectionValidList.mockResolvedValue({});

      const queryClient: QueryClient = createTestQueryClient();
      using invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>{children}</MemoryRouter>
        </QueryClientProvider>
      );

      await renderAndPublish({ wrapper });

      await waitFor(() => {
        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["collections"] });
        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["unpublished-collections"] });
      });
    });
  });
});
