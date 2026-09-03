import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useGroupCodesLists } from "./useGroupCodesLists";
import { DDIApi } from "../../sdk";

vi.mock("../../sdk", () => ({
  DDIApi: {
    getGroupCodesLists: vi.fn(),
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

describe("useGroupCodesLists", () => {
  // L'endpoint group renvoie `agency` (+ versionDate), pas `agencyId`.
  const mockResponse = [
    {
      agency: "fr.insee",
      id: "list-1",
      label: "Liste 1",
      versionDate: "0001-01-01T00:00:00.000Z",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should normalize agency to agencyId", async () => {
    vi.mocked(DDIApi.getGroupCodesLists).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useGroupCodesLists("fr.insee", "group-1"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual([
      {
        agencyId: "fr.insee",
        id: "list-1",
        label: "Liste 1",
        versionDate: "0001-01-01T00:00:00.000Z",
      },
    ]);
    expect(DDIApi.getGroupCodesLists).toHaveBeenCalledWith("fr.insee", "group-1");
  });

  it("should not fetch when agencyId is empty", () => {
    const { result } = renderHook(() => useGroupCodesLists("", "group-1"), {
      wrapper: createWrapper(),
    });

    expect(result.current.fetchStatus).toBe("idle");
    expect(DDIApi.getGroupCodesLists).not.toHaveBeenCalled();
  });

  it("should not fetch when groupId is empty", () => {
    const { result } = renderHook(() => useGroupCodesLists("fr.insee", ""), {
      wrapper: createWrapper(),
    });

    expect(result.current.fetchStatus).toBe("idle");
    expect(DDIApi.getGroupCodesLists).not.toHaveBeenCalled();
  });
});
