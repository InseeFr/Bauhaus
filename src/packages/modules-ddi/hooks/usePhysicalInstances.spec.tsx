import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import { DDIApi } from "../../sdk";
import { usePhysicalInstances } from "./usePhysicalInstances";

vi.mock("../../sdk", () => ({
  DDIApi: {
    getPhysicalInstances: vi.fn(),
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
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("usePhysicalInstances", () => {
  it("should return loading state initially", () => {
    vi.mocked(DDIApi.getPhysicalInstances).mockResolvedValue([]);

    const { result } = renderHook(() => usePhysicalInstances(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
  });

  it("should return data when API call succeeds", async () => {
    const mockData = [
      { id: "1", name: "Physical Instance 1" },
      { id: "2", name: "Physical Instance 2" },
    ];
    vi.mocked(DDIApi.getPhysicalInstances).mockResolvedValue(mockData);

    const { result } = renderHook(() => usePhysicalInstances(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockData);
    expect(result.current.isLoading).toBe(false);
  });

  it("should handle API errors", async () => {
    const error = new Error("API Error");
    vi.mocked(DDIApi.getPhysicalInstances).mockRejectedValue(error);

    const { result } = renderHook(() => usePhysicalInstances(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(error);
    expect(result.current.isLoading).toBe(false);
  });
});
