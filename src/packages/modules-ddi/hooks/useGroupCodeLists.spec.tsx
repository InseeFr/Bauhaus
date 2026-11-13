import { describe, it, expect, vi, beforeEach } from "vitest";

import { DDIApi } from "@sdk/index";

import { expectIdleQuery, renderQueryHook, renderQueryHookUntil } from "./queryClient.testing";
import { useGroupCodeLists } from "./useGroupCodeLists";

vi.mock("../../sdk", () => ({
  DDIApi: {
    getGroupCodeLists: vi.fn(),
  },
}));

describe("useGroupCodeLists", () => {
  // L'endpoint group renvoie `agency` (+ versionDate), pas `agencyId`.
  const mockResponse = [
    {
      agency: "fr.insee",
      id: "list-1",
      label: "Liste 1",
      versionDate: "0001-01-01T00:00:00.000Z",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should normalize agency to agencyId", async () => {
    vi.mocked(DDIApi.getGroupCodeLists).mockResolvedValue(mockResponse);

    const { result } = await renderQueryHookUntil(
      () => useGroupCodeLists("fr.insee", "group-1"),
      "isSuccess",
    );

    expect(result.current.data).toEqual([
      {
        agencyId: "fr.insee",
        id: "list-1",
        label: "Liste 1",
        versionDate: "0001-01-01T00:00:00.000Z",
      },
    ]);
    expect(DDIApi.getGroupCodeLists).toHaveBeenCalledWith("fr.insee", "group-1");
  });

  for (const { name, agencyId, groupId } of [
    { name: "should not fetch when agencyId is empty", agencyId: "", groupId: "group-1" },
    { name: "should not fetch when groupId is empty", agencyId: "fr.insee", groupId: "" },
  ]) {
    it(name, () => {
      const { result } = renderQueryHook(() => useGroupCodeLists(agencyId, groupId));

      expectIdleQuery(result.current, DDIApi.getGroupCodeLists);
    });
  }
});
