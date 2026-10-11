import { renderHook, waitFor } from "@testing-library/react";
import { vi } from "vitest";

import { ConceptApi } from "@sdk/new-concept-api";

import { createQueryClientWrapper } from "../testing/query-client.testing";
import { useUnpublishedConcepts } from "./useUnpublishedConcepts";

vi.mock("@sdk/new-concept-api", () => ({
  ConceptApi: {
    getConceptValidateList: vi.fn(),
  },
}));

const mockGetConceptValidateList = vi.mocked(ConceptApi.getConceptValidateList);

describe("useUnpublishedConcepts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("queries GET /concepts/toValidate via the hexa SDK", async () => {
    const unpublished = [
      { id: "c00001", label: "Concept A", creator: "HIE000000" },
      { id: "c00002", label: "Concept B", creator: "HIE000001" },
    ];
    mockGetConceptValidateList.mockResolvedValue(unpublished);

    const { result } = renderHook(() => useUnpublishedConcepts(), {
      wrapper: createQueryClientWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockGetConceptValidateList).toHaveBeenCalledOnce();
    expect(result.current.data).toEqual(unpublished);
  });
});
