import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { DDIApi } from "@sdk/index";

import { useMutualizedCodeList } from "./useMutualizedCodeList";

vi.mock("../../sdk", () => ({
  DDIApi: {
    getMutualizedCodeList: vi.fn(),
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

describe("useMutualizedCodeList", () => {
  const mockResponse = {
    CodeList: [
      {
        Agency: "fr.insee",
        ID: "cl-1",
        Label: [{ "@language": "fr-FR", "@value": "NAF rév. 2" }],
        Code: [{ ID: "c-1", Value: "01", CategoryReference: { ID: "cat-1" } }],
      },
    ],
    Category: [
      {
        ID: "cat-1",
        Label: [{ "@language": "fr-FR", "@value": "Agriculture" }],
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch one mutualized codes list when agencyId and id are provided", async () => {
    vi.mocked(DDIApi.getMutualizedCodeList).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useMutualizedCodeList("fr.insee", "cl-1"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockResponse);
    expect(DDIApi.getMutualizedCodeList).toHaveBeenCalledWith("fr.insee", "cl-1");
  });

  it("should be disabled when agencyId or id is missing", () => {
    const { result } = renderHook(() => useMutualizedCodeList("", ""), {
      wrapper: createWrapper(),
    });

    expect(result.current.fetchStatus).toBe("idle");
    expect(DDIApi.getMutualizedCodeList).not.toHaveBeenCalled();
  });
});
