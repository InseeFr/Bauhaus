import { describe, it, expect, vi, beforeEach } from "vitest";

import { DDIApi } from "@sdk/index";

import { expectIdleQuery, renderQueryHook, renderQueryHookUntil } from "./queryClient.testing";
import { useMutualizedCodeList } from "./useMutualizedCodeList";

vi.mock("../../sdk", () => ({
  DDIApi: {
    getMutualizedCodeList: vi.fn(),
  },
}));

describe("useMutualizedCodeList", () => {
  const mockResponse = {
    CodeList: [
      {
        Agency: "fr.insee",
        ID: "cl-1",
        Label: [{ "@language": "fr-FR", "@value": "NAF rév. 2" }],
        Code: [{ ID: "c-1", Value: "01", CategoryReference: { ID: "cat-1" } }],
      },
    ],
    Category: [
      {
        ID: "cat-1",
        Label: [{ "@language": "fr-FR", "@value": "Agriculture" }],
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch one mutualized codes list when agencyId and id are provided", async () => {
    vi.mocked(DDIApi.getMutualizedCodeList).mockResolvedValue(mockResponse);

    const { result } = await renderQueryHookUntil(
      () => useMutualizedCodeList("fr.insee", "cl-1"),
      "isSuccess",
    );

    expect(result.current.data).toEqual(mockResponse);
    expect(DDIApi.getMutualizedCodeList).toHaveBeenCalledWith("fr.insee", "cl-1");
  });

  it("should be disabled when agencyId or id is missing", () => {
    const { result } = renderQueryHook(() => useMutualizedCodeList("", ""));

    expectIdleQuery(result.current, DDIApi.getMutualizedCodeList);
  });
});
