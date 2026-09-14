import { describe, it, expect } from "vitest";

import type { CategoryUsage } from "../../types/api";
import { buildCategoryUsersTree } from "./categoryUsersTree";

const labels = { unknownGroup: "Groupe inconnu", unknownStudyUnit: "Unité d'enquête inconnue" };

const usage = (overrides: Partial<CategoryUsage> = {}): CategoryUsage => ({
  group: { agencyId: "fr.insee", id: "grp-1", label: "Groupe démographie" },
  studyUnit: { agencyId: "fr.insee", id: "su-1", label: "Recensement 2024" },
  physicalInstance: { agencyId: "fr.insee", id: "pi-1", label: "Fichier détail" },
  variable: { agencyId: "fr.insee", id: "var-1", label: "Sexe" },
  codeList: { agencyId: "fr.insee", id: "cl-1", label: "Pays" },
  ...overrides,
});

describe("buildCategoryUsersTree", () => {
  it("groups rows into a Group > StudyUnit > PhysicalInstance > Variable > CodeList tree", () => {
    const tree = buildCategoryUsersTree([usage()], labels);

    expect(tree).toHaveLength(1);
    const group = tree[0];
    expect(group.label).toBe("Groupe démographie");
    const su = group.children![0];
    expect(su.label).toBe("Recensement 2024");
    const pi = su.children![0];
    expect(pi.label).toBe("Fichier détail");
    expect(pi.data).toMatchObject({
      kind: "physicalInstance",
      agencyId: "fr.insee",
      id: "pi-1",
    });
    const variable = pi.children![0];
    expect(variable.label).toBe("Sexe");
    expect(variable.data).toMatchObject({
      kind: "variable",
      physicalInstanceAgencyId: "fr.insee",
      physicalInstanceId: "pi-1",
      variableId: "var-1",
    });
    const codeList = variable.children![0];
    expect(codeList.label).toBe("Pays");
    expect(codeList.data).toMatchObject({ kind: "codeList" });
  });

  it("merges rows sharing the same group, study unit and variable", () => {
    const tree = buildCategoryUsersTree(
      [
        usage(),
        usage({ codeList: { agencyId: "fr.insee", id: "cl-2", label: "Pays de naissance" } }),
        usage({ variable: { agencyId: "fr.insee", id: "var-2", label: "Âge" } }),
      ],
      labels,
    );

    expect(tree).toHaveLength(1);
    const pi = tree[0].children![0].children![0];
    expect(pi.label).toBe("Fichier détail");
    // Deux variables sous la même PI, triées par libellé.
    expect(pi.children!.map((v) => v.label)).toEqual(["Âge", "Sexe"]);
    // La variable Sexe porte ses deux listes, triées par libellé.
    const sexe = pi.children![1];
    expect(sexe.children!.map((cl) => cl.label)).toEqual(["Pays", "Pays de naissance"]);
  });

  it("attaches a code list without using variable directly under fallback nodes", () => {
    const tree = buildCategoryUsersTree(
      [
        usage({
          group: null,
          studyUnit: null,
          physicalInstance: null,
          variable: null,
          codeList: { agencyId: "fr.insee", id: "cl-orpheline", label: "Liste orpheline" },
        }),
      ],
      labels,
    );

    expect(tree).toHaveLength(1);
    const group = tree[0];
    expect(group.label).toBe("Groupe inconnu");
    const su = group.children![0];
    expect(su.label).toBe("Unité d'enquête inconnue");
    // Pas de variable : la liste est directement sous l'unité d'enquête.
    const codeList = su.children![0];
    expect(codeList.label).toBe("Liste orpheline");
    expect(codeList.data).toMatchObject({ kind: "codeList" });
  });

  it("falls back to identifiers when labels are missing", () => {
    const tree = buildCategoryUsersTree(
      [
        usage({
          group: { agencyId: "fr.insee", id: "grp-1", label: null },
          studyUnit: { agencyId: "fr.insee", id: "su-1", label: "" },
          physicalInstance: { agencyId: "fr.insee", id: "pi-1", label: null },
          variable: { agencyId: "fr.insee", id: "var-1", label: null },
          codeList: { agencyId: "fr.insee", id: "cl-1", label: null },
        }),
      ],
      labels,
    );

    expect(tree[0].label).toBe("grp-1");
    expect(tree[0].children![0].label).toBe("su-1");
    expect(tree[0].children![0].children![0].label).toBe("pi-1");
    expect(tree[0].children![0].children![0].children![0].label).toBe("var-1");
    expect(tree[0].children![0].children![0].children![0].children![0].label).toBe("cl-1");
  });
});
