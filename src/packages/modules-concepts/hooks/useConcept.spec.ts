import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { createElement, PropsWithChildren } from "react";
import { vi } from "vitest";

import { ConceptsApi } from "@sdk/index";

import { useOrganizations } from "@utils/hooks/organizations";
import { usePrivileges, useUserStamps } from "@utils/hooks/users";

import { useAppContext } from "../../application/app-context";
import { useConcept } from "./useConcept";

vi.mock("../../sdk", () => ({
  ConceptsApi: {
    getConceptGeneral: vi.fn(),
    getNoteVersionList: vi.fn(),
    getConceptLinkList: vi.fn(),
  },
}));

vi.mock("../../application/app-context", () => ({
  useAppContext: vi.fn(),
}));

vi.mock("@utils/html-utils", () => ({
  rmesHtmlToRawHtml: vi.fn((html) => html),
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

const canCreateConcepts = () =>
  mockUsePrivileges.mockReturnValue({
    privileges: [
      {
        application: "CONCEPT_CONCEPT",
        privileges: [{ privilege: "CREATE", strategy: "ALL" }],
      },
    ],
    isPending: false,
  });
const mockGetConceptGeneral = vi.mocked(ConceptsApi.getConceptGeneral);
const mockGetNoteVersionList = vi.mocked(ConceptsApi.getNoteVersionList);
const mockGetConceptLinkList = vi.mocked(ConceptsApi.getConceptLinkList);

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: PropsWithChildren) =>
    createElement(QueryClientProvider, { client: queryClient }, children);
};

describe("useConcept", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAppContext.mockReturnValue({
      properties: { defaultContributor: DEFAULT_CONTRIBUTOR_IRI },
    } as ReturnType<typeof useAppContext>);
    mockUsePrivileges.mockReturnValue({ privileges: [], isPending: false });
    mockUseUserStamps.mockReturnValue({
      data: [{ stamp: USER_STAMP }],
    } as ReturnType<typeof useUserStamps>);
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
    const { result } = renderHook(() => useConcept(undefined), {
      wrapper: createWrapper(),
    });

    expect(mockGetConceptGeneral).not.toHaveBeenCalled();
    expect(result.current.data).toBeDefined();
  });

  it("returns placeholderData when id is undefined", () => {
    const { result } = renderHook(() => useConcept(undefined), {
      wrapper: createWrapper(),
    });

    expect(result.current.data).toMatchObject({
      general: expect.any(Object),
      links: [],
      notes: expect.any(Object),
    });
  });

  it("fetches concept data when id is provided", async () => {
    const generalData = { conceptVersion: 1, prefLabelLg1: "Test Concept" };
    const notesData = {};
    const linksData = [{ typeOfLink: "closeMatch", idConcept: "2" }];

    mockGetConceptGeneral.mockResolvedValue(generalData);
    mockGetNoteVersionList.mockResolvedValue(notesData);
    mockGetConceptLinkList.mockResolvedValue(linksData);

    const { result } = renderHook(() => useConcept("42"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(mockGetConceptLinkList).toHaveBeenCalled());

    expect(mockGetConceptGeneral).toHaveBeenCalledWith("42");
    expect(mockGetNoteVersionList).toHaveBeenCalledWith("42", 1);
    expect(mockGetConceptLinkList).toHaveBeenCalledWith("42");

    await waitFor(() => expect(result.current.data?.links).toEqual(linksData));
    expect(result.current.data?.general).toMatchObject(generalData);
  });

  it("is fetching while request is pending", () => {
    mockGetConceptGeneral.mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useConcept("42"), {
      wrapper: createWrapper(),
    });

    expect(result.current.isFetching).toBe(true);
  });

  it("pré-remplit le contributeur avec l'organisation de l'utilisateur habilité à créer", () => {
    canCreateConcepts();

    const { result } = renderHook(() => useConcept(undefined), {
      wrapper: createWrapper(),
    });

    expect(result.current.data?.general.contributor).toBe(USER_ORGANISATION_IRI);
  });

  it("retombe sur le contributeur par défaut de l'instance sans droit de création", () => {
    const { result } = renderHook(() => useConcept(undefined), {
      wrapper: createWrapper(),
    });

    expect(result.current.data?.general.contributor).toBe(DEFAULT_CONTRIBUTOR_IRI);
  });
});
