import { describe, it, expect, vi, beforeEach } from "vitest";

import { DDIApi } from "@sdk/index";

import { expectIdleQuery, renderQueryHook, renderQueryHookUntil } from "./queryClient.testing";
import { useCodeListUsers, useFetchCodeListUsers } from "./useCodeListUsers";

vi.mock("../../sdk", () => ({
  DDIApi: {
    getCodeListUsers: vi.fn(),
  },
}));

describe("useCodeListUsers", () => {
  const mockResponse = [
    {
      studyUnitAgencyId: "fr.insee",
      studyUnitId: "su-1",
      studyUnitLabel: "Recensement 2024",
      physicalInstanceAgencyId: "fr.insee",
      physicalInstanceId: "pi-1",
      physicalInstanceLabel: "Fichier détail",
      variableAgencyId: "fr.insee",
      variableId: "var-1",
      variableLabel: "Sexe",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch the code list users when agencyId and id are provided", async () => {
    vi.mocked(DDIApi.getCodeListUsers).mockResolvedValue(mockResponse);

    const { result } = await renderQueryHookUntil(
      () => useCodeListUsers("fr.insee", "cl-1"),
      "isSuccess",
    );

    expect(result.current.data).toEqual(mockResponse);
    expect(DDIApi.getCodeListUsers).toHaveBeenCalledWith("fr.insee", "cl-1");
  });

  it("should be disabled when agencyId or id is missing", () => {
    const { result } = renderQueryHook(() => useCodeListUsers("", ""));

    expectIdleQuery(result.current, DDIApi.getCodeListUsers);
  });

  it("should be disabled when enabled is false even with agencyId and id", () => {
    const { result } = renderQueryHook(() => useCodeListUsers("fr.insee", "cl-1", false));

    expectIdleQuery(result.current, DDIApi.getCodeListUsers);
  });

  describe("useFetchCodeListUsers", () => {
    it("serves subsequent calls for the same code list from the query cache", async () => {
      // La garde d'édition appelle ce fetcher à chaque modification : sans staleTime, chaque
      // édition paierait la marche relationnelle Colectica alors que la réponse vient d'arriver.
      vi.mocked(DDIApi.getCodeListUsers).mockResolvedValue(mockResponse);

      const { result } = renderQueryHook(() => useFetchCodeListUsers());

      await result.current("fr.insee", "cl-1");
      const second = await result.current("fr.insee", "cl-1");

      expect(second).toEqual(mockResponse);
      expect(DDIApi.getCodeListUsers).toHaveBeenCalledTimes(1);
    });
  });
});
