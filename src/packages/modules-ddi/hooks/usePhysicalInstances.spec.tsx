import { describe, expect, it, vi } from "vitest";

import { DDIApi } from "@sdk/index";

import { renderQueryHook, renderQueryHookUntil } from "./queryClient.testing";
import { usePhysicalInstances } from "./usePhysicalInstances";

vi.mock("../../sdk", () => ({
  DDIApi: {
    getPhysicalInstances: vi.fn(),
  },
}));

describe("usePhysicalInstances", () => {
  it("should return loading state initially", () => {
    vi.mocked(DDIApi.getPhysicalInstances).mockResolvedValue([]);

    const { result } = renderQueryHook(() => usePhysicalInstances());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
  });

  it("should return data when API call succeeds", async () => {
    const mockData = [
      { id: "1", name: "Physical Instance 1" },
      { id: "2", name: "Physical Instance 2" },
    ];
    vi.mocked(DDIApi.getPhysicalInstances).mockResolvedValue(mockData);

    const { result } = await renderQueryHookUntil(() => usePhysicalInstances(), "isSuccess");

    expect(result.current.data).toEqual(mockData);
    expect(result.current.isLoading).toBe(false);
  });

  it("should handle API errors", async () => {
    const error = new Error("API Error");
    vi.mocked(DDIApi.getPhysicalInstances).mockRejectedValue(error);

    const { result } = await renderQueryHookUntil(() => usePhysicalInstances(), "isError");

    expect(result.current.error).toEqual(error);
    expect(result.current.isLoading).toBe(false);
  });
});
