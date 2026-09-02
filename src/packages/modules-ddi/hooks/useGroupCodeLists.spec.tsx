import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { DDIApi } from "@sdk/index";

import { useGroupCodeLists } from "./useGroupCodeLists";

vi.mock("../../sdk", () => ({
  DDIApi: {
    getGroupCodeLists: vi.fn(),
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

describe("useGroupCodeLists", () => {
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
    vi.mocked(DDIApi.getGroupCodeLists).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useGroupCodeLists("fr.insee", "group-1"), {
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
    expect(DDIApi.getGroupCodeLists).toHaveBeenCalledWith("fr.insee", "group-1");
  });

  it("should not fetch when agencyId is empty", () => {
    const { result } = renderHook(() => useGroupCodeLists("", "group-1"), {
      wrapper: createWrapper(),
    });

    expect(result.current.fetchStatus).toBe("idle");
    expect(DDIApi.getGroupCodeLists).not.toHaveBeenCalled();
  });

  it("should not fetch when groupId is empty", () => {
    const { result } = renderHook(() => useGroupCodeLists("fr.insee", ""), {
      wrapper: createWrapper(),
    });

    expect(result.current.fetchStatus).toBe("idle");
    expect(DDIApi.getGroupCodeLists).not.toHaveBeenCalled();
  });
});
