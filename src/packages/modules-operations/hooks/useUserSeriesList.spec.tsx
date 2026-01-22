import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import { OperationsApi } from "@sdk/operations-api";
import { useUserSeriesList } from "./useUserSeriesList";

vi.mock("@sdk/operations-api", () => ({
  OperationsApi: {
    getUserSeriesList: vi.fn(),
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

describe("useUserSeriesList", () => {
  it("should return placeholder data and then load series", async () => {
    const mockSeries = [{ id: "1", label: "Series 1", altLabel: "" }];

    vi.mocked(OperationsApi.getUserSeriesList).mockResolvedValue(mockSeries);

    const { result } = renderHook(() => useUserSeriesList(), {
      wrapper: createWrapper(),
    });

    expect(result.current.series).toEqual([]);

    await waitFor(
      () => {
        expect(result.current.series).toEqual(mockSeries);
      },
      { timeout: 3000 },
    );
  });

  it("should return series data when API call succeeds", async () => {
    const mockSeries = [
      { id: "1", label: "Series 1", altLabel: "" },
      { id: "2", label: "Series 2", altLabel: "Alt Series 2" },
    ];

    vi.mocked(OperationsApi.getUserSeriesList).mockResolvedValue(mockSeries);

    const { result } = renderHook(() => useUserSeriesList(), {
      wrapper: createWrapper(),
    });

    expect(result.current.series).toEqual([]);

    await waitFor(
      () => {
        expect(result.current.series).toEqual(mockSeries);
      },
      { timeout: 3000 },
    );

    expect(OperationsApi.getUserSeriesList).toHaveBeenCalled();
  });

  it("should use placeholder data when loading", () => {
    vi.mocked(OperationsApi.getUserSeriesList).mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => resolve([]), 1000);
        }),
    );

    const { result } = renderHook(() => useUserSeriesList(), {
      wrapper: createWrapper(),
    });

    // placeholderData provides an empty array while loading
    expect(result.current.series).toEqual([]);
  });

  it("should handle API errors gracefully", async () => {
    const error = new Error("API Error");

    vi.mocked(OperationsApi.getUserSeriesList).mockRejectedValue(error);

    const { result } = renderHook(() => useUserSeriesList(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.series).toEqual([]);
  });

  it("should call API without parameters", async () => {
    const mockSeries = [{ id: "1", label: "Series 1", altLabel: "" }];

    vi.mocked(OperationsApi.getUserSeriesList).mockResolvedValue(mockSeries);

    const { result } = renderHook(() => useUserSeriesList(), {
      wrapper: createWrapper(),
    });

    await waitFor(
      () => {
        expect(result.current.series).toEqual(mockSeries);
      },
      { timeout: 3000 },
    );

    expect(OperationsApi.getUserSeriesList).toHaveBeenCalledWith();
  });
});
