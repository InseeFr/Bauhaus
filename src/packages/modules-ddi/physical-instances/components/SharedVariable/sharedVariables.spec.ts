import { describe, expect, it } from "vitest";

import type { CodeListUsage } from "../../types/api";
import { otherPhysicalInstancesByVariable } from "./sharedVariables";

const usage = (physicalInstanceId: string, variableId: string): CodeListUsage => ({
  studyUnitAgencyId: "fr.insee",
  studyUnitId: "su-1",
  studyUnitLabel: null,
  physicalInstanceAgencyId: "fr.insee",
  physicalInstanceId,
  physicalInstanceLabel: `Fichier ${physicalInstanceId}`,
  variableAgencyId: "fr.insee",
  variableId,
  variableLabel: `Variable ${variableId}`,
});

const current = { agency: "fr.insee", id: "pi-current" };

describe("otherPhysicalInstancesByVariable", () => {
  it("should list, for each variable, the other physical instances that use it", () => {
    const result = otherPhysicalInstancesByVariable(
      [usage("pi-current", "var-1"), usage("pi-2", "var-1"), usage("pi-3", "var-1")],
      current,
    );

    expect(result.get("var-1")).toEqual([
      { agency: "fr.insee", id: "pi-2", label: "Fichier pi-2" },
      { agency: "fr.insee", id: "pi-3", label: "Fichier pi-3" },
    ]);
  });

  it("should not list a variable used by the current physical instance only", () => {
    const result = otherPhysicalInstancesByVariable([usage("pi-current", "var-1")], current);

    expect(result.has("var-1")).toBe(false);
  });

  it("should list a physical instance once even when it uses the variable through several records", () => {
    const result = otherPhysicalInstancesByVariable(
      [usage("pi-2", "var-1"), usage("pi-2", "var-1")],
      current,
    );

    expect(result.get("var-1")).toHaveLength(1);
  });
});
