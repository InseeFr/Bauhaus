import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { DDIApi } from "@sdk/index";

import { usePhysicalCodeLists } from "./usePhysicalCodeLists";

vi.mock("../../sdk", () => ({
  DDIApi: {
    getPhysicalCodeLists: vi.fn(),
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

describe("usePhysicalCodeLists", () => {
  const mockCodeLists = [
    { agencyId: "fr.insee", id: "list-1", label: "Liste 1" },
    { agencyId: "fr.insee", id: "list-2", label: "Liste 2" },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch physical codes lists", async () => {
    vi.mocked(DDIApi.getPhysicalCodeLists).mockResolvedValue(mockCodeLists);

    const { result } = renderHook(() => usePhysicalCodeLists("fr.insee", "pi-123"), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockCodeLists);
    expect(DDIApi.getPhysicalCodeLists).toHaveBeenCalledWith("fr.insee", "pi-123");
  });

  it("should not fetch when agencyId is empty", async () => {
    const { result } = renderHook(() => usePhysicalCodeLists("", "pi-123"), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.fetchStatus).toBe("idle");
    expect(DDIApi.getPhysicalCodeLists).not.toHaveBeenCalled();
  });

  it("should not fetch when physicalInstanceId is empty", async () => {
    const { result } = renderHook(() => usePhysicalCodeLists("fr.insee", ""), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.fetchStatus).toBe("idle");
    expect(DDIApi.getPhysicalCodeLists).not.toHaveBeenCalled();
  });

  it("should handle errors", async () => {
    const error = new Error("Network error");
    vi.mocked(DDIApi.getPhysicalCodeLists).mockRejectedValue(error);

    const { result } = renderHook(() => usePhysicalCodeLists("fr.insee", "pi-123"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBe(error);
  });
});
