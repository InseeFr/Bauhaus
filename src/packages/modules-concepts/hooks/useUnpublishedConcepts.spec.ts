import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { createElement, PropsWithChildren } from "react";
import { vi } from "vitest";

import { ConceptApi } from "@sdk/new-concept-api";

import { useUnpublishedConcepts } from "./useUnpublishedConcepts";

vi.mock("@sdk/new-concept-api", () => ({
  ConceptApi: {
    getConceptValidateList: vi.fn(),
  },
}));

const mockGetConceptValidateList = vi.mocked(ConceptApi.getConceptValidateList);

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: PropsWithChildren) =>
    createElement(QueryClientProvider, { client: queryClient }, children);
};

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
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockGetConceptValidateList).toHaveBeenCalledOnce();
    expect(result.current.data).toEqual(unpublished);
  });
});
