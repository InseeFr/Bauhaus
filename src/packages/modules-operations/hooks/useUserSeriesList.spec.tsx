import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { OperationsApi } from "@sdk/operations-api";

import { createQueryWrapper } from "./queryClientWrapper.testing";
import { useUserSeriesList } from "./useUserSeriesList";

vi.mock("@sdk/operations-api", () => ({
  OperationsApi: {
    getUserSeriesList: vi.fn(),
  },
}));

const renderUseUserSeriesList = () =>
  renderHook(() => useUserSeriesList(), { wrapper: createQueryWrapper().wrapper });

const waitForSeries = (result: { current: { series: unknown } }, expected: unknown) =>
  waitFor(
    () => {
      expect(result.current.series).toEqual(expected);
    },
    { timeout: 3000 },
  );

describe("useUserSeriesList", () => {
  it("should return placeholder data and then load series", async () => {
    const mockSeries = [{ id: "1", label: "Series 1", altLabel: "" }];

    vi.mocked(OperationsApi.getUserSeriesList).mockResolvedValue(mockSeries);

    const { result } = renderUseUserSeriesList();

    expect(result.current.series).toEqual([]);

    await waitForSeries(result, mockSeries);
  });

  it("should return series data when API call succeeds", async () => {
    const mockSeries = [
      { id: "1", label: "Series 1", altLabel: "" },
      { id: "2", label: "Series 2", altLabel: "Alt Series 2" },
    ];

    vi.mocked(OperationsApi.getUserSeriesList).mockResolvedValue(mockSeries);

    const { result } = renderUseUserSeriesList();

    expect(result.current.series).toEqual([]);

    await waitForSeries(result, mockSeries);

    expect(OperationsApi.getUserSeriesList).toHaveBeenCalled();
  });

  it("should use placeholder data when loading", () => {
    vi.mocked(OperationsApi.getUserSeriesList).mockImplementation(() => new Promise(() => {}));

    const { result } = renderUseUserSeriesList();

    // placeholderData provides an empty array while loading
    expect(result.current.series).toEqual([]);
  });

  it("should handle API errors gracefully", async () => {
    const error = new Error("API Error");

    vi.mocked(OperationsApi.getUserSeriesList).mockRejectedValue(error);

    const { result } = renderUseUserSeriesList();

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.series).toEqual([]);
  });

  it("should call API without parameters", async () => {
    const mockSeries = [{ id: "1", label: "Series 1", altLabel: "" }];

    vi.mocked(OperationsApi.getUserSeriesList).mockResolvedValue(mockSeries);

    const { result } = renderUseUserSeriesList();

    await waitForSeries(result, mockSeries);

    expect(OperationsApi.getUserSeriesList).toHaveBeenCalledWith();
  });
});
