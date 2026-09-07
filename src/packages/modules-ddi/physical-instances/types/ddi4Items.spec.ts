import { describe, expect, it } from "vitest";
import type { PhysicalInstanceResponse } from "./api";
import { itemsOfType, replaceItemsOfType, singleItemOfType } from "./ddi4Items";

const response = {
  topLevelReferences: [
    {
      $type: "PhysicalInstance",
      URN: "urn:ddi:fr.insee:pi-1:1",
      Agency: "fr.insee",
      ID: "pi-1",
      Version: "1",
    },
  ],
  items: [
    { $type: "PhysicalInstance", ID: "pi-1", Agency: "fr.insee", Version: "1" },
    { $type: "Variable", ID: "var-1", Agency: "fr.insee", Version: "1" },
    { $type: "Variable", ID: "var-2", Agency: "fr.insee", Version: "1" },
    { $type: "CodeList", ID: "cl-1", Agency: "fr.insee", Version: "1" },
    { $type: "Category", ID: "cat-1", Agency: "fr.insee", Version: "1" },
  ],
} as unknown as PhysicalInstanceResponse;

describe("itemsOfType", () => {
  it("ne retient que les items du type demandé", () => {
    expect(itemsOfType(response, "Variable").map((v) => v.ID)).toEqual(["var-1", "var-2"]);
  });

  it("renvoie un tableau vide quand aucun item ne correspond", () => {
    expect(itemsOfType(response, "DataRelationship")).toEqual([]);
  });

  it("tolère une enveloppe sans items", () => {
    expect(itemsOfType(undefined, "Variable")).toEqual([]);
    expect(itemsOfType({} as PhysicalInstanceResponse, "Variable")).toEqual([]);
  });
});

describe("singleItemOfType", () => {
  it("renvoie le premier item du type demandé", () => {
    expect(singleItemOfType(response, "PhysicalInstance")?.ID).toBe("pi-1");
  });

  it("renvoie undefined quand le type est absent", () => {
    expect(singleItemOfType(response, "DataRelationship")).toBeUndefined();
  });
});

describe("replaceItemsOfType", () => {
  it("remplace tous les items d'un type sans toucher aux autres", () => {
    const updated = replaceItemsOfType(response, "Variable", [
      { $type: "Variable", ID: "var-9", Agency: "fr.insee", Version: "1" },
    ] as never);

    expect(itemsOfType(updated, "Variable").map((v) => v.ID)).toEqual(["var-9"]);
    expect(itemsOfType(updated, "CodeList").map((c) => c.ID)).toEqual(["cl-1"]);
    expect(itemsOfType(updated, "Category").map((c) => c.ID)).toEqual(["cat-1"]);
    expect(singleItemOfType(updated, "PhysicalInstance")?.ID).toBe("pi-1");
  });

  it("laisse l'enveloppe d'origine intacte", () => {
    replaceItemsOfType(response, "Variable", []);

    expect(itemsOfType(response, "Variable")).toHaveLength(2);
  });

  it("ajoute le type quand il était absent", () => {
    const updated = replaceItemsOfType(response, "DataRelationship", [
      { $type: "DataRelationship", ID: "dr-1", Agency: "fr.insee", Version: "1" },
    ] as never);

    expect(itemsOfType(updated, "DataRelationship").map((d) => d.ID)).toEqual(["dr-1"]);
  });

  it("préserve topLevelReferences", () => {
    const updated = replaceItemsOfType(response, "Variable", []);

    expect(updated.topLevelReferences).toEqual(response.topLevelReferences);
  });
});
