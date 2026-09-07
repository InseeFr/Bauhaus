import { describe, expect, it } from "vitest";

import { BROADER, NARROWER, NONE } from "@sdk/constants";
import { mergeWithAllConcepts } from "./mergeWithAllConcepts";

const concepts = [
  { id: "c1", label: "Chômage" },
  { id: "c2", label: "Emploi" },
];

describe("mergeWithAllConcepts", () => {
  it("marque comme non liés les concepts sans lien", () => {
    expect(mergeWithAllConcepts(concepts, [])).toEqual([
      {
        id: "c1",
        label: "Chômage",
        typeOfLink: NONE,
        prefLabelLg1: undefined,
        prefLabelLg2: undefined,
      },
      {
        id: "c2",
        label: "Emploi",
        typeOfLink: NONE,
        prefLabelLg1: undefined,
        prefLabelLg2: undefined,
      },
    ]);
  });

  it("reporte le type de lien et les libellés du concept lié", () => {
    const links = [
      { id: "c2", typeOfLink: NARROWER, prefLabelLg1: "Emploi", prefLabelLg2: "Employment" },
    ] as any;

    expect(mergeWithAllConcepts(concepts, links)).toEqual([
      {
        id: "c1",
        label: "Chômage",
        typeOfLink: NONE,
        prefLabelLg1: undefined,
        prefLabelLg2: undefined,
      },
      {
        id: "c2",
        label: "Emploi",
        typeOfLink: NARROWER,
        prefLabelLg1: "Emploi",
        prefLabelLg2: "Employment",
      },
    ]);
  });

  it("conserve l'ordre et le libellé de la liste de référence, pas ceux des liens", () => {
    const links = [{ id: "c1", typeOfLink: BROADER, prefLabelLg1: "Autre libellé" }] as any;

    const merged = mergeWithAllConcepts(concepts, links);

    expect(merged.map((concept) => concept.id)).toEqual(["c1", "c2"]);
    expect(merged[0].label).toBe("Chômage");
  });

  it("refuse un type de lien inconnu plutôt que de le laisser passer", () => {
    const links = [{ id: "c1", typeOfLink: "inventé" }] as any;

    expect(() => mergeWithAllConcepts(concepts, links)).toThrow(TypeError);
    expect(() => mergeWithAllConcepts(concepts, links)).toThrow(/inventé/);
  });

  it("rend une liste vide quand il n'y a aucun concept", () => {
    expect(mergeWithAllConcepts([], [{ id: "c1", typeOfLink: BROADER }] as any)).toEqual([]);
  });
});
