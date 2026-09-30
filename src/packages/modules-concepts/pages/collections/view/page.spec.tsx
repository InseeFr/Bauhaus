import { QueryClientProvider } from "@tanstack/react-query";
import { screen, waitFor } from "@testing-library/react";
import { useParams } from "react-router-dom";
import { Mock, vi } from "vitest";

import { ConceptsApi } from "@sdk/index";
import { CollectionApi } from "@sdk/new-collection-api";

import { useSecondLang } from "@utils/hooks/second-lang";

import {
  expectItemLoadFailed,
  expectItemNotFound,
  expectNoLoadFailure,
} from "../../../../tests/loading-error.testing";
import { sdkRejection } from "../../../../tests/sdk-rejection.testing";
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

  it("says the collection could not be found instead of loading forever on a 404", async () => {
    (CollectionApi.getCollectionById as Mock).mockRejectedValue(sdkRejection.emptyBody(404));
    (CollectionApi.getCollectionMembersList as Mock).mockResolvedValue([]);

    renderWithQueryClient(<Component />);

    await expectItemNotFound();
    expect(screen.queryByTestId("collection-loading")).not.toBeInTheDocument();
  });

  it("says the collection could not be loaded when its members cannot be read", async () => {
    (CollectionApi.getCollectionById as Mock).mockResolvedValue(mockCollection);
    (CollectionApi.getCollectionMembersList as Mock).mockRejectedValue(sdkRejection.emptyBody(500));

    renderWithQueryClient(<Component />);

    await expectItemLoadFailed();
  });

  it("keeps the collection displayed when a later reload fails", async () => {
    mockFetchedCollection(mockCollection, mockMembers);
    const { queryClient } = renderWithQueryClient(<Component />);
    await screen.findByTestId("collection-visualization");

    (CollectionApi.getCollectionById as Mock).mockRejectedValue(sdkRejection.emptyBody(500));
    await queryClient.refetchQueries({ queryKey: ["collection", "123"] });
    await waitFor(() =>
      expect(queryClient.getQueryState(["collection", "123"])?.status).toBe("error"),
    );

    expect(screen.getByTestId("collection-visualization")).toBeInTheDocument();
    expectNoLoadFailure();
  });
});
