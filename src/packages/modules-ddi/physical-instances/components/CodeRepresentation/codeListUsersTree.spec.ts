import { describe, it, expect } from "vitest";

import type { CodeListUsage } from "../../types/api";
import { buildCodeListUsersTree } from "./codeListUsersTree";

const labels = { unknownStudyUnit: "Study Unit inconnue" };

const usage = (overrides: Partial<CodeListUsage>): CodeListUsage => ({
  studyUnitAgencyId: "fr.insee",
  studyUnitId: "su-1",
  studyUnitLabel: "Recensement 2024",
  physicalInstanceAgencyId: "fr.insee",
  physicalInstanceId: "pi-1",
  physicalInstanceLabel: "Fichier détail",
  variableAgencyId: "fr.insee",
  variableId: "var-1",
  variableLabel: "Sexe",
  ...overrides,
});

describe("buildCodeListUsersTree", () => {
  it("builds a StudyUnit > PhysicalInstance > Variable tree", () => {
    const tree = buildCodeListUsersTree([usage({})], labels);

    expect(tree).toHaveLength(1);
    expect(tree[0].label).toBe("Recensement 2024");
    expect(tree[0].children).toHaveLength(1);
    expect(tree[0].children![0].label).toBe("Fichier détail");
    expect(tree[0].children![0].children).toHaveLength(1);
    expect(tree[0].children![0].children![0].label).toBe("Sexe");
  });

  it("merges variables sharing the same PhysicalInstance and StudyUnit", () => {
    const tree = buildCodeListUsersTree(
      [usage({}), usage({ variableId: "var-2", variableLabel: "Âge" })],
      labels,
    );

    expect(tree).toHaveLength(1);
    expect(tree[0].children).toHaveLength(1);
    const variables = tree[0].children![0].children!.map((n) => n.label);
    expect(variables).toEqual(["Âge", "Sexe"]);
  });

  it("groups PhysicalInstances under the same StudyUnit", () => {
    const tree = buildCodeListUsersTree(
      [usage({}), usage({ physicalInstanceId: "pi-2", physicalInstanceLabel: "Fichier ménage" })],
      labels,
    );

    expect(tree).toHaveLength(1);
    expect(tree[0].children!.map((n) => n.label)).toEqual(["Fichier détail", "Fichier ménage"]);
  });

  it("separates usages belonging to different StudyUnits", () => {
    const tree = buildCodeListUsersTree(
      [usage({}), usage({ studyUnitId: "su-2", studyUnitLabel: "Enquête emploi" })],
      labels,
    );

    expect(tree.map((n) => n.label)).toEqual(["Enquête emploi", "Recensement 2024"]);
  });

  it("falls back to the unknown StudyUnit label when none is resolved", () => {
    const tree = buildCodeListUsersTree(
      [usage({ studyUnitAgencyId: null, studyUnitId: null, studyUnitLabel: null })],
      labels,
    );

    expect(tree[0].label).toBe("Study Unit inconnue");
  });

  it("falls back to the identifier when an item label is blank", () => {
    const tree = buildCodeListUsersTree(
      [
        usage({
          physicalInstanceLabel: "",
          variableLabel: null,
        }),
      ],
      labels,
    );

    expect(tree[0].children![0].label).toBe("pi-1");
    expect(tree[0].children![0].children![0].label).toBe("var-1");
  });

  it("returns an empty array for no usages", () => {
    expect(buildCodeListUsersTree([], labels)).toEqual([]);
  });

  it("attaches link data to the PhysicalInstance node", () => {
    const tree = buildCodeListUsersTree([usage({})], labels);

    expect(tree[0].children![0].data).toEqual({
      kind: "physicalInstance",
      agencyId: "fr.insee",
      id: "pi-1",
    });
  });

  it("attaches link data (incl. the PhysicalInstance) to the Variable node", () => {
    const tree = buildCodeListUsersTree([usage({})], labels);

    expect(tree[0].children![0].children![0].data).toEqual({
      kind: "variable",
      physicalInstanceAgencyId: "fr.insee",
      physicalInstanceId: "pi-1",
      variableId: "var-1",
    });
  });
});
