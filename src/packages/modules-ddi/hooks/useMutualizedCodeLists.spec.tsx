import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { DDIApi } from "@sdk/index";

import { useMutualizedCodeLists } from "./useMutualizedCodeLists";

vi.mock("../../sdk", () => ({
  DDIApi: {
    getMutualizedCodeLists: vi.fn(),
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

describe("useMutualizedCodeLists", () => {
  const mockCodeLists = [
    { agencyId: "fr.insee", id: "mutualized-1", label: "Liste mutualisée 1" },
    { agencyId: "fr.insee", id: "mutualized-2", label: "Liste mutualisée 2" },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch mutualized codes lists", async () => {
    vi.mocked(DDIApi.getMutualizedCodeLists).mockResolvedValue(mockCodeLists);

    const { result } = renderHook(() => useMutualizedCodeLists(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockCodeLists);
    expect(DDIApi.getMutualizedCodeLists).toHaveBeenCalled();
  });

  it("should handle errors", async () => {
    const error = new Error("Network error");
    vi.mocked(DDIApi.getMutualizedCodeLists).mockRejectedValue(error);

    const { result } = renderHook(() => useMutualizedCodeLists(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBe(error);
  });
});
