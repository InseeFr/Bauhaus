import { QueryClientProvider } from "@tanstack/react-query";
import { screen, waitFor } from "@testing-library/react";
import { useParams } from "react-router-dom";
import { Mock, vi } from "vitest";

import { ConceptsApi } from "@sdk/index";
import { CollectionApi } from "@sdk/new-collection-api";

import { useSecondLang } from "@utils/hooks/second-lang";

import { renderWithQueryClient } from "../../../testing/query-client.testing";
import { Component } from "./page";

vi.mock("react-router-dom", () => ({
  useParams: vi.fn(),
}));

vi.mock("@sdk/index", () => ({
  ConceptsApi: {
    putCollectionValidList: vi.fn(),
  },
}));

vi.mock("@sdk/new-collection-api", () => ({
  CollectionApi: {
    getCollectionById: vi.fn(),
    getCollectionMembersList: vi.fn(),
  },
}));

vi.mock("@utils/hooks/second-lang", () => ({
  useSecondLang: vi.fn(),
}));

vi.mock("../../../../application/app-context", () => ({
  useAppContext: vi.fn(() => ({
    properties: { defaultContributor: "defaultContributor" },
  })),
}));

vi.mock("@components/loading", () => ({
  Loading: () => <div data-testid="collection-loading">Loading...</div>,
  Publishing: () => <div data-testid="collection-publishing">Publishing...</div>,
}));

vi.mock("./components/CollectionVisualization", () => ({
  CollectionVisualization: () => <div data-testid="collection-visualization">Visualization</div>,
}));

const mockCollection = {
  id: "123",
  prefLabelLg1: "Test Collection",
};
const mockMembers = [{ id: "c1", label: "Concept 1" }];

const mockFetchedCollection = (collection: object, members: object[]) => {
  (CollectionApi.getCollectionById as Mock).mockResolvedValue(collection);
  (CollectionApi.getCollectionMembersList as Mock).mockResolvedValue(members);
};

describe("Visualization Container Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useParams as Mock).mockReturnValue({ id: "123" });
    (useSecondLang as Mock).mockReturnValue(["en", vi.fn()]);
  });

  it("renders Loading component while loading collection data", () => {
    (CollectionApi.getCollectionById as Mock).mockReturnValue(new Promise(() => {}));
    (CollectionApi.getCollectionMembersList as Mock).mockReturnValue(new Promise(() => {}));

    renderWithQueryClient(<Component />);

    expect(screen.getByTestId("collection-loading")).toBeInTheDocument();
  });

  it("renders CollectionVisualization component after loading", async () => {
    mockFetchedCollection(mockCollection, mockMembers);

    renderWithQueryClient(<Component />);

    await waitFor(() => {
      expect(screen.getByTestId("collection-visualization")).toBeInTheDocument();
    });
  });

  it("renders Publishing component when validating collection", async () => {
    mockFetchedCollection(mockCollection, []);
    (ConceptsApi.putCollectionValidList as Mock).mockReturnValue(new Promise(() => {}));

    const { rerender, queryClient } = renderWithQueryClient(<Component />);

    await waitFor(() => {
      expect(screen.getByTestId("collection-visualization")).toBeInTheDocument();
    });

    expect(screen.queryByTestId("collection-publishing")).not.toBeInTheDocument();

    rerender(
      <QueryClientProvider client={queryClient}>
        <Component />
      </QueryClientProvider>,
    );
  });

  it("calls useParams to get collection id", () => {
    mockFetchedCollection({}, []);

    renderWithQueryClient(<Component />);

    expect(useParams).toHaveBeenCalled();
  });

  it("calls useSecondLang hook", () => {
    mockFetchedCollection({}, []);

    renderWithQueryClient(<Component />);

    expect(useSecondLang).toHaveBeenCalled();
  });

  it("fetches collection and members data on mount", async () => {
    mockFetchedCollection(mockCollection, mockMembers);

    renderWithQueryClient(<Component />);

    await waitFor(() => {
      expect(CollectionApi.getCollectionById).toHaveBeenCalledWith("123");
      expect(CollectionApi.getCollectionMembersList).toHaveBeenCalledWith("123");
    });
  });
});
