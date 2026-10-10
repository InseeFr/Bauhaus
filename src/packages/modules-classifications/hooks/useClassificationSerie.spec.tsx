import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, Mock } from "vitest";

import type { PartialClassificationSerie } from "@model/Classification";

import { ClassificationsApi } from "@sdk/classification";

import { useClassificationSeries } from "./useClassificationSeries";

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

const renderUseClassificationSeries = () =>
  renderHook(() => useClassificationSeries(), {
    wrapper: createWrapper(),
  });

const renderUseClassificationSeriesUntilLoaded = async () => {
  const rendered = renderUseClassificationSeries();

  await waitFor(() => {
    expect(rendered.result.current.isLoading).toBe(false);
  });

  return rendered;
};

describe("useClassificationSeries", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns loading initially", async () => {
    (ClassificationsApi.getSeriesList as Mock).mockResolvedValue([]);

    const { result } = renderUseClassificationSeries();

    expect(result.current.isLoading).toBe(true);
    expect(result.current.series).toBeUndefined();
  });

  it("returns data after success", async () => {
    const fakeData: PartialClassificationSerie[] = [
      { id: "A", label: "Serie A" } as any,
      { id: "B", label: "Serie B" } as any,
    ];
    (ClassificationsApi.getSeriesList as Mock).mockResolvedValue(fakeData);

    const { result } = await renderUseClassificationSeriesUntilLoaded();

    expect(result.current.series).toEqual(fakeData);
    expect(ClassificationsApi.getSeriesList).toHaveBeenCalledTimes(1);
  });

  it("returns undefined on error", async () => {
    (ClassificationsApi.getSeriesList as Mock).mockRejectedValue(new Error("boom"));

    const { result } = await renderUseClassificationSeriesUntilLoaded();

    expect(result.current.series).toBeUndefined();
  });
});
