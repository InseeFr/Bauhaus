import { describe, it, expect } from "vitest";

import { findLocalCategoryOverrides } from "./findLocalCategoryOverrides";
import type { Category } from "../../types/api";
import type { VariableData } from "./viewReducer";

const category = (id: string, label: string): Category => ({
  $type: "Category",
  VersionDate: { DateTime: "2024-01-01T00:00:00Z" },
  URN: `urn:ddi:fr.insee:${id}:1`,
  Agency: "fr.insee",
  ID: id,
  Version: "1",
  Label: [{ "@language": "fr-FR", "@value": label }],
});

const localVariable = (id: string, categories: Category[]): VariableData =>
  ({ id, categories }) as VariableData;

describe("findLocalCategoryOverrides", () => {
  it("substitutes a category edited by another local variable", () => {
    // La variable A a surchargé la catégorie partagée ; la variable B, chargée du back,
    // en porte encore la version périmée.
    const locals = [localVariable("var-a", [category("cat-1", "Europe modifiée")])];

    const result = findLocalCategoryOverrides(locals, [
      category("cat-1", "Europe"),
      category("cat-2", "Asie"),
    ]);

    expect(result?.[0].Label?.[0]?.["@value"]).toBe("Europe modifiée");
    // Les catégories non surchargées sont conservées telles quelles.
    expect(result?.[1].Label?.[0]?.["@value"]).toBe("Asie");
  });

  it("returns the categories unchanged when no local variable touched them", () => {
    const locals = [localVariable("var-a", [category("cat-9", "Autre")])];
    const categories = [category("cat-1", "Europe")];

    expect(findLocalCategoryOverrides(locals, categories)).toEqual(categories);
  });

  it("keeps the most recently validated version when several local variables carry it", () => {
    const locals = [
      localVariable("var-a", [category("cat-1", "Première surcharge")]),
      localVariable("var-b", [category("cat-1", "Surcharge la plus récente")]),
    ];

    const result = findLocalCategoryOverrides(locals, [category("cat-1", "Europe")]);

    expect(result?.[0].Label?.[0]?.["@value"]).toBe("Surcharge la plus récente");
  });

  it("handles missing inputs", () => {
    expect(findLocalCategoryOverrides([], undefined)).toBeUndefined();
    expect(findLocalCategoryOverrides([], [])).toEqual([]);
  });
});
