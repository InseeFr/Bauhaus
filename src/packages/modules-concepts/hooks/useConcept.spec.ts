import { renderHook, waitFor } from "@testing-library/react";
import { vi } from "vitest";

import { ConceptsApi } from "@sdk/index";

import { createQueryClientWrapper } from "../testing/query-client.testing";
import {
  itPrefillsTheContributor,
  mockContributorPrefillHooks,
} from "./contributorPrefill.testing";
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

const mockGetConceptGeneral = vi.mocked(ConceptsApi.getConceptGeneral);
const mockGetNoteVersionList = vi.mocked(ConceptsApi.getNoteVersionList);
const mockGetConceptLinkList = vi.mocked(ConceptsApi.getConceptLinkList);

const renderConcept = (id?: string) =>
  renderHook(() => useConcept(id), { wrapper: createQueryClientWrapper() });

describe("useConcept", () => {
  beforeEach(mockContributorPrefillHooks);

  it("does not call the API when id is undefined", () => {
    const { result } = renderConcept();

    expect(mockGetConceptGeneral).not.toHaveBeenCalled();
    expect(result.current.data).toBeDefined();
  });

  it("returns placeholderData when id is undefined", () => {
    const { result } = renderConcept();

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

    const { result } = renderConcept("42");

    await waitFor(() => expect(mockGetConceptLinkList).toHaveBeenCalled());

    expect(mockGetConceptGeneral).toHaveBeenCalledWith("42");
    expect(mockGetNoteVersionList).toHaveBeenCalledWith("42", 1);
    expect(mockGetConceptLinkList).toHaveBeenCalledWith("42");

    await waitFor(() => expect(result.current.data?.links).toEqual(linksData));
    expect(result.current.data?.general).toMatchObject(generalData);
  });

  it("is fetching while request is pending", () => {
    mockGetConceptGeneral.mockReturnValue(new Promise(() => {}));

    const { result } = renderConcept("42");

    expect(result.current.isFetching).toBe(true);
  });

  itPrefillsTheContributor(
    "CONCEPT_CONCEPT",
    () => renderConcept().result.current.data?.general.contributor,
  );
});
