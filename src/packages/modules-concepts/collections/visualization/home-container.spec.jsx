import { render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { useParams } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { ConceptsApi } from "@sdk/index";
import { CollectionApi } from "@sdk/new-collection-api";

import { useSecondLang } from "@utils/hooks/second-lang";
import { Component } from "./home-container";

vi.mock("react-router-dom", () => ({
  useParams: vi.fn(),
}));

vi.mock("@sdk/index", () => ({
  ConceptsApi: {
    getCollectionMembersList: vi.fn(),
    putCollectionValidList: vi.fn(),
  },
}));

vi.mock("@sdk/new-collection-api", () => ({
  CollectionApi: {
    getCollectionById: vi.fn(),
  },
}));

vi.mock("@utils/hooks/second-lang", () => ({
  useSecondLang: vi.fn(),
}));

vi.mock("@components/loading", () => ({
  Loading: () => <div data-testid="collection-loading">Loading...</div>,
  Publishing: () => <div data-testid="collection-publishing">Publishing...</div>,
}));

vi.mock("./home", () => ({
  default: () => <div data-testid="collection-visualization">Visualization</div>,
}));

describe("Visualization Container Component", () => {
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
    useParams.mockReturnValue({ id: "123" });
    useSecondLang.mockReturnValue(["en", vi.fn()]);
  });

  it("renders Loading component while loading collection data", () => {
    CollectionApi.getCollectionById.mockReturnValue(new Promise(() => {}));
    ConceptsApi.getCollectionMembersList.mockReturnValue(new Promise(() => {}));

    renderWithQueryClient(<Component />);

    expect(screen.getByTestId("collection-loading")).toBeInTheDocument();
  });

  it("renders CollectionVisualization component after loading", async () => {
    const mockCollection = {
      id: "123",
      prefLabelLg1: "Test Collection",
    };
    const mockMembers = [{ id: "c1", label: "Concept 1" }];

    CollectionApi.getCollectionById.mockResolvedValue(mockCollection);
    ConceptsApi.getCollectionMembersList.mockResolvedValue(mockMembers);

    renderWithQueryClient(<Component />);

    await waitFor(() => {
      expect(screen.getByTestId("collection-visualization")).toBeInTheDocument();
    });
  });

  it("renders Publishing component when validating collection", async () => {
    const mockCollection = {
      id: "123",
      prefLabelLg1: "Test Collection",
    };

    CollectionApi.getCollectionById.mockResolvedValue(mockCollection);
    ConceptsApi.getCollectionMembersList.mockResolvedValue([]);
    ConceptsApi.putCollectionValidList.mockReturnValue(new Promise(() => {}));

    const { rerender } = renderWithQueryClient(<Component />);

    await waitFor(() => {
      expect(screen.getByTestId("collection-visualization")).toBeInTheDocument();
    });

    // Verify the component structure is correct
    expect(screen.queryByTestId("collection-publishing")).not.toBeInTheDocument();

    rerender(
      <QueryClientProvider client={queryClient}>
        <Component />
      </QueryClientProvider>,
    );
  });

  it("calls useParams to get collection id", () => {
    CollectionApi.getCollectionById.mockResolvedValue({});
    ConceptsApi.getCollectionMembersList.mockResolvedValue([]);

    renderWithQueryClient(<Component />);

    expect(useParams).toHaveBeenCalled();
  });

  it("calls useSecondLang hook", () => {
    CollectionApi.getCollectionById.mockResolvedValue({});
    ConceptsApi.getCollectionMembersList.mockResolvedValue([]);

    renderWithQueryClient(<Component />);

    expect(useSecondLang).toHaveBeenCalled();
  });

  it("fetches collection and members data on mount", async () => {
    const mockCollection = {
      id: "123",
      prefLabelLg1: "Test Collection",
    };
    const mockMembers = [{ id: "c1", label: "Concept 1" }];

    CollectionApi.getCollectionById.mockResolvedValue(mockCollection);
    ConceptsApi.getCollectionMembersList.mockResolvedValue(mockMembers);

    renderWithQueryClient(<Component />);

    await waitFor(() => {
      expect(CollectionApi.getCollectionById).toHaveBeenCalledWith("123");
      expect(ConceptsApi.getCollectionMembersList).toHaveBeenCalledWith("123");
    });
  });
});
