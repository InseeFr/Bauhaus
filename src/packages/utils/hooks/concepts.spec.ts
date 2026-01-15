import { renderHook, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";

import { useConcepts, useConceptExporter } from "./concepts";

const mockUseQuery = vi.fn();
const mockUseMutation = vi.fn();

vi.mock("@tanstack/react-query", () => ({
  useQuery: (options: unknown) => mockUseQuery(options),
  useMutation: (options: unknown) => mockUseMutation(options),
}));

vi.mock("@sdk/index", () => ({
  ConceptsApi: {
    getConceptList: vi.fn().mockResolvedValue([{ id: "1", label: "Concept 1" }]),
    getConceptExportZipType: vi.fn().mockResolvedValue(new Response()),
  },
}));

vi.mock("../files", () => ({
  saveFileFromHttpResponse: vi.fn().mockResolvedValue(undefined),
}));

describe("useConcepts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseQuery.mockReturnValue({
      isLoading: false,
      data: [{ id: "1", label: "Concept 1" }],
    });
  });

  it("should call useQuery with correct queryKey", () => {
    renderHook(() => useConcepts());

    expect(mockUseQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ["concepts"],
      }),
    );
  });

  it("should return data from useQuery", () => {
    const { result } = renderHook(() => useConcepts());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toEqual([{ id: "1", label: "Concept 1" }]);
  });

  it("should return loading state", () => {
    mockUseQuery.mockReturnValue({
      isLoading: true,
      data: undefined,
    });

    const { result } = renderHook(() => useConcepts());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
  });
});

describe("useConceptExporter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseMutation.mockReturnValue({
      mutate: vi.fn(),
      mutateAsync: vi.fn(),
      isLoading: false,
      isSuccess: false,
    });
  });

  it("should call useMutation with mutationFn", () => {
    renderHook(() => useConceptExporter());

    expect(mockUseMutation).toHaveBeenCalledWith(
      expect.objectContaining({
        mutationFn: expect.any(Function),
      }),
    );
  });

  it("should return mutation object", () => {
    const { result } = renderHook(() => useConceptExporter());

    expect(result.current).toHaveProperty("mutate");
    expect(result.current).toHaveProperty("isLoading");
  });

  it("should pass correct parameters to mutationFn", async () => {
    const { ConceptsApi } = await import("@sdk/index");
    const { saveFileFromHttpResponse } = await import("../files");

    let capturedMutationFn: Function;
    mockUseMutation.mockImplementation((options: { mutationFn: Function }) => {
      capturedMutationFn = options.mutationFn;
      return {
        mutate: vi.fn(),
        mutateAsync: vi.fn(),
        isLoading: false,
      };
    });

    renderHook(() => useConceptExporter());

    const params = {
      ids: ["id1", "id2"],
      type: "pdf",
      lang: "fr",
      withConcepts: true,
    };

    await capturedMutationFn!(params);

    expect(ConceptsApi.getConceptExportZipType).toHaveBeenCalledWith(
      ["id1", "id2"],
      "pdf",
      "fr",
      true,
    );
    expect(saveFileFromHttpResponse).toHaveBeenCalled();
  });
});
