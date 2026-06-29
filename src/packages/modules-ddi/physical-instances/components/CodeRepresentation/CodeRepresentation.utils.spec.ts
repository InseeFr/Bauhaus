import { describe, it, expect } from "vitest";

import { isCodeListSharedWithOthers, countOtherUsers } from "./CodeRepresentation.utils";
import type { CodeListUsage } from "../../types/api";

const usage = (variableId: string): CodeListUsage => ({
  studyUnitAgencyId: "fr.insee",
  studyUnitId: "su-1",
  studyUnitLabel: "Recensement 2024",
  physicalInstanceAgencyId: "fr.insee",
  physicalInstanceId: "pi-1",
  physicalInstanceLabel: "Fichier détail",
  variableAgencyId: "fr.insee",
  variableId,
  variableLabel: "Sexe",
});

describe("isCodeListSharedWithOthers", () => {
  it("returns false when no usage exists", () => {
    expect(isCodeListSharedWithOthers([], "var-1")).toBe(false);
  });

  it("returns false when the only usage is the current variable", () => {
    expect(isCodeListSharedWithOthers([usage("var-1")], "var-1")).toBe(false);
  });

  it("returns true when another variable uses the code list", () => {
    expect(isCodeListSharedWithOthers([usage("var-1"), usage("var-2")], "var-1")).toBe(true);
  });

  it("returns true when current variable id is undefined and there are usages", () => {
    expect(isCodeListSharedWithOthers([usage("var-2")], undefined)).toBe(true);
  });
});

describe("countOtherUsers", () => {
  it("counts only usages from variables other than the current one", () => {
    const usages = [usage("var-1"), usage("var-2"), usage("var-3")];
    expect(countOtherUsers(usages, "var-1")).toBe(2);
  });

  it("returns 0 when there is no other user", () => {
    expect(countOtherUsers([usage("var-1")], "var-1")).toBe(0);
  });
});
