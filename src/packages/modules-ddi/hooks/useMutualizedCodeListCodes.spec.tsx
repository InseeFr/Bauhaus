import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { DDIApi } from "@sdk/index";

import { useMutualizedCodeListCodes } from "./useMutualizedCodeListCodes";

vi.mock("../../sdk", () => ({
  DDIApi: {
    getMutualizedCodeListCodes: vi.fn(),
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useMutualizedCodeListCodes", () => {
  const mockResponse = {
    agencyId: "fr.insee",
    id: "cl-1",
    version: "3",
    label: "NAF rév. 2",
    codes: [{ id: "c-1", value: "01", label: "Agriculture" }],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches the light view of a mutualized codes list", async () => {
    vi.mocked(DDIApi.getMutualizedCodeListCodes).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useMutualizedCodeListCodes("fr.insee", "cl-1"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockResponse);
    expect(DDIApi.getMutualizedCodeListCodes).toHaveBeenCalledWith("fr.insee", "cl-1");
  });

  it("stays idle when agencyId or id is missing", () => {
    const { result } = renderHook(() => useMutualizedCodeListCodes("", ""), {
      wrapper: createWrapper(),
    });

    expect(result.current.fetchStatus).toBe("idle");
    expect(DDIApi.getMutualizedCodeListCodes).not.toHaveBeenCalled();
  });
});
