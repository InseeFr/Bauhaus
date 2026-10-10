import { describe, expect, it, vi } from "vitest";

import { DDIApi } from "@sdk/index";

import { renderQueryHook, renderQueryHookUntil } from "./queryClient.testing";
import { usePhysicalInstancesSearch } from "./usePhysicalInstancesSearch";

vi.mock("../../sdk", () => ({
  DDIApi: {
    getPhysicalInstancesForAdvancedSearch: vi.fn(),
  },
}));

describe("usePhysicalInstancesSearch", () => {
  it("should return loading state initially", () => {
    vi.mocked(DDIApi.getPhysicalInstancesForAdvancedSearch).mockResolvedValue([]);

    const { result } = renderQueryHook(() => usePhysicalInstancesSearch());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
  });

  it("should return the joined search rows when the API call succeeds", async () => {
    const mockData = [
      {
        agency: "fr.insee",
        id: "pi-1",
        label: "Recensement",
        versionDate: null,
        studyUnitAgency: "fr.insee",
        studyUnitId: "su-1",
        studyUnitLabel: "Étude A",
        groupAgency: "fr.insee",
        groupId: "g1",
        groupLabel: "Groupe X",
      },
    ];
    vi.mocked(DDIApi.getPhysicalInstancesForAdvancedSearch).mockResolvedValue(mockData);

    const { result } = await renderQueryHookUntil(() => usePhysicalInstancesSearch(), "isSuccess");

    expect(result.current.data).toEqual(mockData);
  });

  it("should surface API errors", async () => {
    const error = new Error("API Error");
    vi.mocked(DDIApi.getPhysicalInstancesForAdvancedSearch).mockRejectedValue(error);

    const { result } = await renderQueryHookUntil(() => usePhysicalInstancesSearch(), "isError");

    expect(result.current.error).toEqual(error);
  });
});
