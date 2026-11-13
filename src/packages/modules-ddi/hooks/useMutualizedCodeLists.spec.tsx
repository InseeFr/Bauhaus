import { describe, it, expect, vi, beforeEach } from "vitest";

import { DDIApi } from "@sdk/index";

import { renderQueryHookFromLoadingToSuccess, renderQueryHookUntil } from "./queryClient.testing";
import { useMutualizedCodeLists } from "./useMutualizedCodeLists";

vi.mock("../../sdk", () => ({
  DDIApi: {
    getMutualizedCodeLists: vi.fn(),
  },
}));

describe("useMutualizedCodeLists", () => {
  const mockCodeLists = [
    { agencyId: "fr.insee", id: "mutualized-1", label: "Liste mutualisée 1" },
    { agencyId: "fr.insee", id: "mutualized-2", label: "Liste mutualisée 2" },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch mutualized codes lists", async () => {
    vi.mocked(DDIApi.getMutualizedCodeLists).mockResolvedValue(mockCodeLists);

    const { result } = await renderQueryHookFromLoadingToSuccess(() => useMutualizedCodeLists());

    expect(result.current.data).toEqual(mockCodeLists);
    expect(DDIApi.getMutualizedCodeLists).toHaveBeenCalled();
  });

  it("should handle errors", async () => {
    const error = new Error("Network error");
    vi.mocked(DDIApi.getMutualizedCodeLists).mockRejectedValue(error);

    const { result } = await renderQueryHookUntil(() => useMutualizedCodeLists(), "isError");

    expect(result.current.error).toBe(error);
  });
});
