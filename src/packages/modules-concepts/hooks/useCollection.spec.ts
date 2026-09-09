import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import { createElement, PropsWithChildren } from "react";
import { vi } from "vitest";

import { CollectionApi } from "@sdk/new-collection-api";

import { useOrganizations } from "@utils/hooks/organizations";
import { usePrivileges, useUserStamps } from "@utils/hooks/users";

import { useAppContext } from "../../application/app-context";
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

const USER_STAMP = "DG75-L201";
const USER_ORGANISATION_IRI = "http://bauhaus/organisations/insee/HIE2001201";
const DEFAULT_CONTRIBUTOR_IRI = "http://bauhaus/organisations/insee/HIE3014990";

const mockUseAppContext = vi.mocked(useAppContext);
const mockUseOrganizations = vi.mocked(useOrganizations);
const mockUsePrivileges = vi.mocked(usePrivileges);
const mockUseUserStamps = vi.mocked(useUserStamps);
const mockGetCollectionById = vi.mocked(CollectionApi.getCollectionById);

const canCreateCollections = () =>
  mockUsePrivileges.mockReturnValue({
    privileges: [
      { application: "CONCEPT_COLLECTION", privileges: [{ privilege: "CREATE", strategy: "ALL" }] },
    ],
    isPending: false,
  });

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: PropsWithChildren) =>
    createElement(QueryClientProvider, { client: queryClient }, children);
};

describe("useCollection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAppContext.mockReturnValue({
      properties: { defaultContributor: DEFAULT_CONTRIBUTOR_IRI },
    } as ReturnType<typeof useAppContext>);
    mockUsePrivileges.mockReturnValue({ privileges: [], isPending: false });
    mockUseUserStamps.mockReturnValue({ data: [{ stamp: USER_STAMP }] } as ReturnType<
      typeof useUserStamps
    >);
    mockUseOrganizations.mockReturnValue({
      data: [
        {
          iri: USER_ORGANISATION_IRI,
          id: "HIE2001201",
          stamp: USER_STAMP,
          label: "Organisation de l'utilisateur",
          labelLg2: "User organisation",
        },
      ],
    } as ReturnType<typeof useOrganizations>);
  });

  it("does not call the API when id is undefined", () => {
    renderHook(() => useCollection(undefined), { wrapper: createWrapper() });

    expect(mockGetCollectionById).not.toHaveBeenCalled();
  });

  it("pré-remplit le contributeur avec l'organisation de l'utilisateur habilité à créer", () => {
    canCreateCollections();

    const { result } = renderHook(() => useCollection(undefined), {
      wrapper: createWrapper(),
    });

    expect(result.current.data?.general.contributor).toBe(USER_ORGANISATION_IRI);
  });

  it("retombe sur le contributeur par défaut de l'instance sans droit de création", () => {
    const { result } = renderHook(() => useCollection(undefined), {
      wrapper: createWrapper(),
    });

    expect(result.current.data?.general.contributor).toBe(DEFAULT_CONTRIBUTOR_IRI);
  });
});
