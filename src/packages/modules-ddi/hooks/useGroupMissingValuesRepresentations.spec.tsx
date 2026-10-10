import { describe, it, expect, vi, beforeEach } from "vitest";

import { DDIApi } from "@sdk/index";

import { expectIdleQuery, renderQueryHook, renderQueryHookUntil } from "./queryClient.testing";
import { useGroupMissingValuesRepresentations } from "./useGroupMissingValuesRepresentations";

vi.mock("../../sdk", () => ({
  DDIApi: {
    getGroupMissingValuesRepresentations: vi.fn(),
  },
}));

describe("useGroupMissingValuesRepresentations", () => {
  const mockResponse = [
    {
      id: "mmvr-1",
      agency: "fr.insee",
      version: "1",
      label: "Valeurs sentinelles NSP/REF",
      codeListId: "cl-sentinelles",
      codeValues: ["NSP", "REF"],
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch the reusable missing values representations of the group", async () => {
    vi.mocked(DDIApi.getGroupMissingValuesRepresentations).mockResolvedValue(mockResponse);

    const { result } = await renderQueryHookUntil(
      () => useGroupMissingValuesRepresentations("fr.insee", "group-1"),
      "isSuccess",
    );

    expect(result.current.data).toEqual(mockResponse);
    expect(DDIApi.getGroupMissingValuesRepresentations).toHaveBeenCalledWith("fr.insee", "group-1");
  });

  it("should not fetch when agencyId is empty", () => {
    const { result } = renderQueryHook(() => useGroupMissingValuesRepresentations("", "group-1"));

    expectIdleQuery(result.current, DDIApi.getGroupMissingValuesRepresentations);
  });

  it("should not fetch when groupId is empty", () => {
    const { result } = renderQueryHook(() => useGroupMissingValuesRepresentations("fr.insee", ""));

    expectIdleQuery(result.current, DDIApi.getGroupMissingValuesRepresentations);
  });
});
