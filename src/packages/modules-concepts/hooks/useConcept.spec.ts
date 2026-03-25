import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createElement, PropsWithChildren } from "react";
import { vi } from "vitest";

import { ConceptsApi } from "../../sdk";
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

const mockUseAppContext = vi.mocked(useAppContext);
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
      properties: { defaultContributor: "DG75-L201" },
    } as ReturnType<typeof useAppContext>);
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
});
