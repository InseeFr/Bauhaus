import { renderHook, waitFor } from "@testing-library/react";
import { vi } from "vitest";

import { ConceptsApi } from "@sdk/concepts-api";

import { useConcepts } from "./useConcepts";

vi.mock("@sdk/concepts-api", () => ({
  ConceptsApi: {
    getConceptList: vi.fn(),
  },
}));

vi.mock("@utils/array-utils", () => ({
  sortArrayByLabel: vi.fn((list) => [...list].sort((a, b) => a.label.localeCompare(b.label))),
}));

const mockGetConceptList = vi.mocked(ConceptsApi.getConceptList);

describe("useConcepts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns loading true initially", () => {
    mockGetConceptList.mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useConcepts());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.concepts).toEqual([]);
  });

  it("returns sorted concepts after loading", async () => {
    const rawConcepts = [
      { id: "2", label: "Zebra", altLabel: null, _links: { self: { href: "/2" } } },
      { id: "1", label: "Apple", altLabel: null, _links: { self: { href: "/1" } } },
    ];
    mockGetConceptList.mockResolvedValue(rawConcepts);

    const { result } = renderHook(() => useConcepts());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.concepts[0].label).toBe("Apple");
    expect(result.current.concepts[1].label).toBe("Zebra");
  });

  it("returns loading false after API call resolves", async () => {
    mockGetConceptList.mockResolvedValue([]);

    const { result } = renderHook(() => useConcepts());

    await waitFor(() => expect(result.current.isLoading).toBe(false));
  });
});
