import { describe, it, expect, vi, beforeEach } from "vitest";

import { DDIApi } from "@sdk/index";

import { renderMutationHook } from "./queryClient.testing";
import { usePublishPhysicalInstance } from "./usePublishPhysicalInstance";

vi.mock("../../sdk", () => ({
  DDIApi: {
    putPhysicalInstance: vi.fn(),
  },
}));

describe("usePublishPhysicalInstance", () => {
  /**
   * Amorce les parents de la PI dans le cache, publie, et renvoie l'espion des invalidations
   * (à lier avec `using` pour le restaurer en fin de test).
   */
  const publishAndSpyInvalidations = async () => {
    const { result, queryClient } = renderMutationHook(() => usePublishPhysicalInstance());
    queryClient.setQueryData(["physicalInstanceParents", "fr.insee", "pi-1"], {
      studyUnit: { agency: "fr.insee", id: "su-1" },
      group: { agency: "fr.insee", id: "group-1", label: "Mon groupe" },
      stamps: [],
    });
    const invalidateQueriesSpy = vi.spyOn(queryClient, "invalidateQueries");

    await result.current.mutateAsync({ id: "pi-1", agencyId: "fr.insee", data: {} });

    return invalidateQueriesSpy;
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (DDIApi.putPhysicalInstance as any) = vi.fn().mockResolvedValue({});
  });

  it("should invalidate the parent group's code lists cache on success", async () => {
    using invalidateQueriesSpy = await publishAndSpyInvalidations();

    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: ["groupCodeLists", "fr.insee", "group-1"],
    });
  });

  it("should not invalidate the mutualized code lists cache on success", async () => {
    using invalidateQueriesSpy = await publishAndSpyInvalidations();

    expect(invalidateQueriesSpy).not.toHaveBeenCalledWith({
      queryKey: ["mutualizedCodeLists"],
    });
  });

  it("should invalidate the code list users cache on success", async () => {
    // L'enregistrement ajoute/retire des variables référençant des listes de codes : sans cette
    // éviction, `useCodeListUsers` (staleTime: Infinity) resterait sur un résultat périmé et la
    // confirmation de surcharge d'une liste partagée n'apparaîtrait qu'après un F5.
    using invalidateQueriesSpy = await publishAndSpyInvalidations();

    expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: ["codeListUsers"] });
  });

  it("should invalidate the physical instances list cache on success", async () => {
    // Le PUT stampe un nouveau versionDate : sans éviction, la liste de la home
    // (staleTime: Infinity) afficherait une date périmée jusqu'au F5.
    using invalidateQueriesSpy = await publishAndSpyInvalidations();

    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: ["physicalInstances"],
    });
  });

  it("should invalidate the advanced search cache on success", async () => {
    using invalidateQueriesSpy = await publishAndSpyInvalidations();

    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: ["physicalInstancesSearch"],
    });
  });

  it("should still invalidate the physical instance's own code lists cache on success", async () => {
    using invalidateQueriesSpy = await publishAndSpyInvalidations();

    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: ["physicalCodeLists", "fr.insee", "pi-1"],
    });
  });

  it("should invalidate the code list contents cache on success", async () => {
    // Le contenu d'une liste attachee a une variable est charge par
    // `loadCodeListForVariable` sous la cle ["codeListById", agency, id]. Sans eviction
    // (staleTime: Infinity), rouvrir la variable apres la sauvegarde reservirait la version
    // d'avant le PUT : la modification semblait perdue jusqu'au F5.
    using invalidateQueriesSpy = await publishAndSpyInvalidations();

    // Prefixe entier : une sauvegarde peut toucher plusieurs listes (edition + variante creee).
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: ["codeListById"],
    });
  });

  it("should invalidate the category users cache on success", async () => {
    // Les usages d'une categorie decident de l'affichage de la popup « categorie partagee ».
    // Apres la creation d'une variante, la categorie d'origine n'est plus referencee par cette
    // variable : sans eviction, la garde continuerait de la croire partagee pendant tout le
    // staleTime, et la popup reapparaitrait a tort.
    using invalidateQueriesSpy = await publishAndSpyInvalidations();

    expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: ["categoryUsers"] });
  });
});
