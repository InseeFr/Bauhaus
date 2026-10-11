import { renderHook } from "@testing-library/react";
import { vi } from "vitest";

import { CollectionApi } from "@sdk/new-collection-api";

import { createQueryClientWrapper } from "../testing/query-client.testing";
import {
  itPrefillsTheContributor,
  mockContributorPrefillHooks,
} from "./contributorPrefill.testing";
import { useCollection } from "./useCollection";

vi.mock("@sdk/new-collection-api", () => ({
  CollectionApi: {
    getCollectionById: vi.fn(),
    getCollectionMembersList: vi.fn(),
  },
}));

vi.mock("../../application/app-context", () => ({
  useAppContext: vi.fn(),
}));

vi.mock("@utils/hooks/organizations", () => ({
  useOrganizations: vi.fn(),
}));

vi.mock("@utils/hooks/users", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@utils/hooks/users")>();
  return { ...actual, usePrivileges: vi.fn(), useUserStamps: vi.fn() };
});

const mockGetCollectionById = vi.mocked(CollectionApi.getCollectionById);

const renderCollection = () =>
  renderHook(() => useCollection(undefined), { wrapper: createQueryClientWrapper() });

describe("useCollection", () => {
  beforeEach(mockContributorPrefillHooks);

  it("does not call the API when id is undefined", () => {
    renderCollection();

    expect(mockGetCollectionById).not.toHaveBeenCalled();
  });

  itPrefillsTheContributor(
    "CONCEPT_COLLECTION",
    () => renderCollection().result.current.data?.general.contributor,
  );
});
