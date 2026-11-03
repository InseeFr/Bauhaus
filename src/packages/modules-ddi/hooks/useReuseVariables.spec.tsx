import { describe, it, expect, vi, beforeEach } from "vitest";

import { DDIApi } from "@sdk/ddi-api";

import { renderMutationHook } from "./queryClient.testing";
import { useReuseVariables } from "./useReuseVariables";

vi.mock("@sdk/ddi-api", () => ({
  DDIApi: {
    reuseVariables: vi.fn(),
  },
}));

const request = {
  physicalInstanceLabel: "Nouveau fichier",
  dataRelationshipLabel: "Structure : Nouveau fichier",
  logicalRecordLabel: "Enregistrement logique : Nouveau fichier",
  groupId: "group-1",
  groupAgency: "fr.insee",
  variableIds: ["VAR_1", "VAR_2"],
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

describe("useReuseVariables", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("crée le fichier par l'endpoint dédié et résout son identifiant", async () => {
    vi.mocked(DDIApi.reuseVariables).mockResolvedValue(createdResponse);
    const { result } = renderMutationHook(() => useReuseVariables());

    const created = await result.current.mutateAsync({
      agencyId: "fr.insee",
      id: "pi-src",
      data: request,
    });

    expect(DDIApi.reuseVariables).toHaveBeenCalledWith("fr.insee", "pi-src", request);
    expect(created).toEqual({ id: "pi-new", agency: "fr.insee" });
  });

  it("rafraîchit les listes de fichiers et les usages de variables de l'étude", async () => {
    vi.mocked(DDIApi.reuseVariables).mockResolvedValue(createdResponse);
    const { result, queryClient } = renderMutationHook(() => useReuseVariables());
    const invalidate = vi.spyOn(queryClient, "invalidateQueries");

    await result.current.mutateAsync({ agencyId: "fr.insee", id: "pi-src", data: request });

    expect(invalidate).toHaveBeenCalledWith({ queryKey: ["physicalInstances"] });
    expect(invalidate).toHaveBeenCalledWith({ queryKey: ["physicalInstancesSearch"] });
    expect(invalidate).toHaveBeenCalledWith({ queryKey: ["studyUnitVariableUsages"] });
  });

  it("échoue quand la réponse ne référence aucun fichier", async () => {
    vi.mocked(DDIApi.reuseVariables).mockResolvedValue({ topLevelReferences: [], items: [] });
    const { result } = renderMutationHook(() => useReuseVariables());

    await expect(
      result.current.mutateAsync({ agencyId: "fr.insee", id: "pi-src", data: request }),
    ).rejects.toThrow("Physical Instance reference not found in response");
  });
});
