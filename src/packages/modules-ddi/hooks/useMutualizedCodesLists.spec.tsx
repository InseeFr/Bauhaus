import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useMutualizedCodesLists } from "./useMutualizedCodesLists";
import { DDIApi } from "../../sdk";

vi.mock("../../sdk", () => ({
  DDIApi: {
    getMutualizedCodesLists: vi.fn(),
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useMutualizedCodesLists", () => {
  const mockCodesLists = [
    { agencyId: "fr.insee", id: "mutualized-1", label: "Liste mutualisée 1" },
    { agencyId: "fr.insee", id: "mutualized-2", label: "Liste mutualisée 2" },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch mutualized codes lists", async () => {
    vi.mocked(DDIApi.getMutualizedCodesLists).mockResolvedValue(mockCodesLists);

    const { result } = renderHook(() => useMutualizedCodesLists(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockCodesLists);
    expect(DDIApi.getMutualizedCodesLists).toHaveBeenCalled();
  });

  it("should handle errors", async () => {
    const error = new Error("Network error");
    vi.mocked(DDIApi.getMutualizedCodesLists).mockRejectedValue(error);

    const { result } = renderHook(() => useMutualizedCodesLists(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBe(error);
  });
});
