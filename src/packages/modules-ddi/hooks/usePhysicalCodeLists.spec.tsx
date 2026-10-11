import { describe, it, expect, vi, beforeEach } from "vitest";

import { DDIApi } from "@sdk/index";

import {
  expectIdleQuery,
  renderQueryHook,
  renderQueryHookFromLoadingToSuccess,
  renderQueryHookUntil,
} from "./queryClient.testing";
import { usePhysicalCodeLists } from "./usePhysicalCodeLists";

vi.mock("../../sdk", () => ({
  DDIApi: {
    getPhysicalCodeLists: vi.fn(),
  },
}));

describe("usePhysicalCodeLists", () => {
  const mockCodeLists = [
    { agencyId: "fr.insee", id: "list-1", label: "Liste 1" },
    { agencyId: "fr.insee", id: "list-2", label: "Liste 2" },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch physical codes lists", async () => {
    vi.mocked(DDIApi.getPhysicalCodeLists).mockResolvedValue(mockCodeLists);

    const { result } = await renderQueryHookFromLoadingToSuccess(() =>
      usePhysicalCodeLists("fr.insee", "pi-123"),
    );

    expect(result.current.data).toEqual(mockCodeLists);
    expect(DDIApi.getPhysicalCodeLists).toHaveBeenCalledWith("fr.insee", "pi-123");
  });

  for (const { name, agencyId, physicalInstanceId } of [
    { name: "should not fetch when agencyId is empty", agencyId: "", physicalInstanceId: "pi-123" },
    {
      name: "should not fetch when physicalInstanceId is empty",
      agencyId: "fr.insee",
      physicalInstanceId: "",
    },
  ]) {
    it(name, async () => {
      const { result } = renderQueryHook(() => usePhysicalCodeLists(agencyId, physicalInstanceId));

      expect(result.current.isLoading).toBe(false);
      expectIdleQuery(result.current, DDIApi.getPhysicalCodeLists);
    });
  }

  it("should handle errors", async () => {
    const error = new Error("Network error");
    vi.mocked(DDIApi.getPhysicalCodeLists).mockRejectedValue(error);

    const { result } = await renderQueryHookUntil(
      () => usePhysicalCodeLists("fr.insee", "pi-123"),
      "isError",
    );

    expect(result.current.error).toBe(error);
  });
});
