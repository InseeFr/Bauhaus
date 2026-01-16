import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useClassificationSeries } from "./useClassificationSeries";
import { ClassificationsApi } from "@sdk/classification";
import type { PartialClassificationSerie } from "@model/Classification";

vi.mock("@sdk/classification", () => ({
  ClassificationsApi: {
    getSeriesList: vi.fn(),
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

describe("useClassificationSeries", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns loading initially", async () => {
    (ClassificationsApi.getSeriesList as Mock).mockResolvedValue([]);

    const { result } = renderHook(() => useClassificationSeries(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.series).toBeUndefined();
  });

  it("returns data after success", async () => {
    const fakeData: PartialClassificationSerie[] = [
      { id: "A", label: "Serie A" } as any,
      { id: "B", label: "Serie B" } as any,
    ];
    (ClassificationsApi.getSeriesList as Mock).mockResolvedValue(fakeData);

    const { result } = renderHook(() => useClassificationSeries(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.series).toEqual(fakeData);
    expect(ClassificationsApi.getSeriesList).toHaveBeenCalledTimes(1);
  });

  it("returns undefined on error", async () => {
    (ClassificationsApi.getSeriesList as Mock).mockRejectedValue(new Error("boom"));

    const { result } = renderHook(() => useClassificationSeries(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.series).toBeUndefined();
  });
});
