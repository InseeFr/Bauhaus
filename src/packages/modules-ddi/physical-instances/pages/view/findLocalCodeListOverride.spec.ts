import { describe, it, expect } from "vitest";

import type { CodeList } from "../../types/api";
import { findLocalCodeListOverride } from "./findLocalCodeListOverride";
import type { VariableData } from "./viewReducer";

const codeList = (id: string, label: string): CodeList => ({
  $type: "CodeList",
  VersionDate: { DateTime: "2024-01-01T00:00:00Z" },
  URN: `urn:ddi:fr.insee:${id}:1`,
  Agency: "fr.insee",
  ID: id,
  Version: "1",
  Label: [{ "@language": "fr-FR", "@value": label }],
  Code: [],
});

const variable = (id: string, cl?: CodeList): VariableData => ({
  id,
  label: id,
  name: id,
  type: "code",
  codeList: cl,
  categories: cl ? [] : undefined,
});

describe("findLocalCodeListOverride", () => {
  it("returns undefined when no code list id is provided", () => {
    expect(
      findLocalCodeListOverride([variable("v1", codeList("cl-1", "X"))], undefined),
    ).toBeUndefined();
  });

  it("returns undefined when no local variable carries that code list", () => {
    expect(
      findLocalCodeListOverride([variable("v1", codeList("cl-1", "X"))], "cl-2"),
    ).toBeUndefined();
  });

  it("returns the locally edited code list and its categories when a local variable carries it", () => {
    const edited = codeList("cl-1", "Libellé surchargé");
    const result = findLocalCodeListOverride([variable("v1", edited)], "cl-1");
    expect(result?.codeList).toBe(edited);
    expect(result?.categories).toEqual([]);
  });

  it("ignores local variables that have no code list (other representation types)", () => {
    const numeric: VariableData = { id: "v2", label: "v2", name: "v2", type: "numeric" };
    const edited = codeList("cl-1", "Libellé surchargé");
    const result = findLocalCodeListOverride([numeric, variable("v1", edited)], "cl-1");
    expect(result?.codeList).toBe(edited);
  });
});
