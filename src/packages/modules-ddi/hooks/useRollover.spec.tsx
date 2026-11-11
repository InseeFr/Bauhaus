import { describe, it, expect, vi, beforeEach } from "vitest";

import { DDIApi } from "@sdk/ddi-api";

import { renderMutationHook } from "./queryClient.testing";
import { useRollover } from "./useRollover";

vi.mock("@sdk/ddi-api", () => ({
  DDIApi: {
    rollover: vi.fn(),
  },
}));

const request = {
  physicalInstanceLabel: "Recensement 2026",
  dataRelationshipLabel: "Structure : Recensement 2026",
  logicalRecordLabel: "Enregistrement logique : Recensement 2026",
  studyUnitId: "su-2026",
  studyUnitAgency: "fr.insee",
  groupId: "group-1",
  groupAgency: "fr.insee",
  variables: [
    { sourceId: "VAR_1" },
    { sourceId: "VAR_2", reusedAgency: "fr.insee", reusedId: "VAR_2_2026" },
  ],
};

const createdResponse = {
  topLevelReferences: [
    {
      $type: "PhysicalInstance",
      URN: "urn:ddi:fr.insee:pi-new:1",
      Agency: "fr.insee",
      ID: "pi-new",
      Version: "1",
    },
  ],
  items: [{ $type: "PhysicalInstance", Agency: "fr.insee", ID: "pi-new" }],
};

describe("useRollover", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("crée le fichier de la nouvelle période par l'endpoint dédié et résout son identifiant", async () => {
    vi.mocked(DDIApi.rollover).mockResolvedValue(createdResponse);
    const { result } = renderMutationHook(() => useRollover());

    const created = await result.current.mutateAsync({
      agencyId: "fr.insee",
      id: "pi-src",
      data: request,
    });

    expect(DDIApi.rollover).toHaveBeenCalledWith("fr.insee", "pi-src", request);
    expect(created).toEqual({ id: "pi-new", agency: "fr.insee" });
  });

  it("rafraîchit les listes de fichiers et les variables de l'étude cible", async () => {
    vi.mocked(DDIApi.rollover).mockResolvedValue(createdResponse);
    const { result, queryClient } = renderMutationHook(() => useRollover());
    using invalidate = vi.spyOn(queryClient, "invalidateQueries");

    await result.current.mutateAsync({ agencyId: "fr.insee", id: "pi-src", data: request });

    expect(invalidate).toHaveBeenCalledWith({ queryKey: ["physicalInstances"] });
    expect(invalidate).toHaveBeenCalledWith({ queryKey: ["physicalInstancesSearch"] });
    expect(invalidate).toHaveBeenCalledWith({
      queryKey: ["studyUnitVariables", "fr.insee", "su-2026"],
    });
    expect(invalidate).toHaveBeenCalledWith({
      queryKey: ["studyUnitVariableUsages", "fr.insee", "su-2026"],
    });
  });

  it("échoue quand la réponse ne référence aucun fichier", async () => {
    vi.mocked(DDIApi.rollover).mockResolvedValue({ topLevelReferences: [], items: [] });
    const { result } = renderMutationHook(() => useRollover());

    await expect(
      result.current.mutateAsync({ agencyId: "fr.insee", id: "pi-src", data: request }),
    ).rejects.toThrow("Physical Instance reference not found in response");
  });
});
