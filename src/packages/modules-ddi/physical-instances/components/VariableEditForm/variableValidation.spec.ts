import { describe, expect, it } from "vitest";

import type { ManagedMissingValuesRepresentation } from "../../types/api";
import { getVariableValidationErrors } from "./variableValidation";

const sentinelMmvr = (label: string) =>
  ({
    $type: "ManagedMissingValuesRepresentation",
    ID: "mmvr-1",
    Agency: "fr.insee",
    Version: "1",
    Label: [{ "@language": "fr-FR", "@value": label }],
  }) as ManagedMissingValuesRepresentation;

describe("getVariableValidationErrors", () => {
  it("should accept a variable with a name and a label", () => {
    expect(getVariableValidationErrors({ name: "AGE", label: "Âge" })).toEqual([]);
  });

  it("should require a name and a label, blank values included", () => {
    expect(getVariableValidationErrors({ name: " ", label: "" })).toEqual([
      "nameRequired",
      "labelRequired",
    ]);
  });

  it("should require a label on the sentinel values being edited (#1566)", () => {
    expect(
      getVariableValidationErrors({ name: "AGE", label: "Âge", sentinelMmvr: sentinelMmvr(" ") }),
    ).toEqual(["sentinelLabelRequired"]);
  });

  it("should accept labelled sentinel values", () => {
    expect(
      getVariableValidationErrors({
        name: "AGE",
        label: "Âge",
        sentinelMmvr: sentinelMmvr("Sentinelles"),
      }),
    ).toEqual([]);
  });
});
