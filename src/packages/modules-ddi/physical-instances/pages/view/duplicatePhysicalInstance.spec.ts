import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  buildDuplicatedPhysicalInstance,
  buildDuplicatedLogicalRecord,
  buildDuplicatedDataRelationship,
} from "./duplicatePhysicalInstance";
import { itemsOfType } from "../../types/ddi4Items";
import { envelope } from "../../types/ddi4Items.testing";

// Mock crypto.randomUUID
const mockUUIDs: `${string}-${string}-${string}-${string}-${string}`[] = [
  "00000000-0000-0000-0000-000000000001",
  "00000000-0000-0000-0000-000000000002",
  "00000000-0000-0000-0000-000000000003",
  "00000000-0000-0000-0000-000000000004",
  "00000000-0000-0000-0000-000000000005",
];
let uuidIndex = 0;

vi.stubGlobal("crypto", {
  randomUUID: (): `${string}-${string}-${string}-${string}-${string}` =>
    mockUUIDs[uuidIndex++] ||
    (`00000000-0000-0000-0000-${String(uuidIndex).padStart(12, "0")}` as `${string}-${string}-${string}-${string}-${string}`),
});

const NEW_PHYSICAL_INSTANCE_ID = mockUUIDs[0];
const NEW_DATA_RELATIONSHIP_ID = mockUUIDs[1];
const NEW_LOGICAL_RECORD_ID = mockUUIDs[2];

describe("buildDuplicatedPhysicalInstance", () => {
  beforeEach(() => {
    uuidIndex = 0;
  });

  it("should generate new IDs for PhysicalInstance, DataRelationship, and LogicalRecord", () => {
    const data = envelope({
      PhysicalInstance: [
        {
          ID: "original-pi-id",
          Agency: "original-agency",
          Version: "1",
          Citation: {
            Title: [{ "@language": "fr-FR", "@value": "Original Title" }],
          },
          PhysicalInstanceLabel: [{ "@language": "fr-FR", "@value": "Original Label" }],
        },
      ],
      DataRelationship: [
        {
          ID: "original-dr-id",
          Agency: "original-agency",
          Version: "1",
          Label: [{ "@language": "fr-FR", "@value": "Original DR Name" }],
          LogicalRecord: [
            {
              ID: "original-lr-id",
              URN: "urn:ddi:original-agency:original-lr-id:1",
              Agency: "original-agency",
              Version: "1",
              VariablesInRecord: { VariableUsedReference: [] },
            },
          ],
        },
      ],
      Variable: [],
    });

    const result = buildDuplicatedPhysicalInstance({
      agencyId: "test-agency",
      data,
      label: "Original Title",
      defaultLocale: "fr-FR",
    });

    expect(result.newPhysicalInstanceId).toBe(NEW_PHYSICAL_INSTANCE_ID);
    expect(result.newAgencyId).toBe("test-agency");
    expect(itemsOfType(result.duplicatedData, "PhysicalInstance")[0].ID).toBe(
      NEW_PHYSICAL_INSTANCE_ID,
    );
    expect(itemsOfType(result.duplicatedData, "DataRelationship")[0].ID).toBe(
      NEW_DATA_RELATIONSHIP_ID,
    );
    expect(itemsOfType(result.duplicatedData, "DataRelationship")[0].LogicalRecord![0].ID).toBe(
      NEW_LOGICAL_RECORD_ID,
    );
  });

  it("should use the provided label as-is without adding a (copy) suffix (caller owns the suffix)", () => {
    const data = envelope({
      PhysicalInstance: [
        {
          ID: "original-pi-id",
          Agency: "original-agency",
          Version: "1",
          Citation: {
            Title: [{ "@language": "fr-FR", "@value": "Original Title" }],
          },
        },
      ],
      DataRelationship: [
        {
          ID: "original-dr-id",
          Agency: "original-agency",
          Version: "1",
          Label: [{ "@language": "fr-FR", "@value": "Original DR Name" }],
          LogicalRecord: [
            {
              ID: "original-lr-id",
              URN: "urn:ddi:original-agency:original-lr-id:1",
              Agency: "original-agency",
              Version: "1",
              VariablesInRecord: { VariableUsedReference: [] },
            },
          ],
        },
      ],
      Variable: [],
    });

    const result = buildDuplicatedPhysicalInstance({
      agencyId: "test-agency",
      data,
      label: "Original Title (copy)",
      defaultLocale: "fr-FR",
    });

    // Pas de double suffixe : le libellé fourni est utilisé tel quel.
    expect(
      itemsOfType(result.duplicatedData, "PhysicalInstance")[0].Citation.Title[0]["@value"],
    ).toBe("Original Title (copy)");
    expect(itemsOfType(result.duplicatedData, "DataRelationship")[0].Label[0]["@value"]).toBe(
      "Structure : Original Title (copy)",
    );
    expect(
      itemsOfType(result.duplicatedData, "DataRelationship")[0].LogicalRecord![0].Label[0][
        "@value"
      ],
    ).toBe("Enregistrement logique : Original Title (copy)");
  });

  it("should set Citation Title to the provided label and preserve PhysicalInstanceLabel", () => {
    const data = envelope({
      PhysicalInstance: [
        {
          ID: "original-pi-id",
          Agency: "original-agency",
          Version: "1",
          Citation: {
            Title: [{ "@language": "fr-FR", "@value": "Original Title" }],
          },
          PhysicalInstanceLabel: [{ "@language": "fr-FR", "@value": "Original Label" }],
        },
      ],
      DataRelationship: [
        {
          ID: "original-dr-id",
          Agency: "original-agency",
          Version: "1",
          Label: [{ "@language": "fr-FR", "@value": "Original DR Name" }],
          LogicalRecord: [
            {
              ID: "original-lr-id",
              URN: "urn:ddi:original-agency:original-lr-id:1",
              Agency: "original-agency",
              Version: "1",
              VariablesInRecord: { VariableUsedReference: [] },
            },
          ],
        },
      ],
      Variable: [],
    });

    const result = buildDuplicatedPhysicalInstance({
      agencyId: "test-agency",
      data,
      label: "Original Title",
      defaultLocale: "fr-FR",
    });

    expect(
      itemsOfType(result.duplicatedData, "PhysicalInstance")[0].Citation.Title[0]["@value"],
    ).toBe("Original Title");
    // PhysicalInstanceLabel is preserved as-is (not modified by the duplication)
    expect(
      (itemsOfType(result.duplicatedData, "PhysicalInstance")[0] as Record<string, any>)
        .PhysicalInstanceLabel[0]["@value"],
    ).toBe("Original Label");
  });

  it("should derive DataRelationship Label from the provided label", () => {
    const data = envelope({
      PhysicalInstance: [
        {
          ID: "original-pi-id",
          Agency: "original-agency",
          Version: "1",
          Citation: {
            Title: [{ "@language": "fr-FR", "@value": "Test" }],
          },
        },
      ],
      DataRelationship: [
        {
          ID: "original-dr-id",
          Agency: "original-agency",
          Version: "1",
          Label: [{ "@language": "fr-FR", "@value": "Original DR Name" }],
          LogicalRecord: [
            {
              ID: "original-lr-id",
              URN: "urn:ddi:original-agency:original-lr-id:1",
              Agency: "original-agency",
              Version: "1",
              VariablesInRecord: { VariableUsedReference: [] },
            },
          ],
        },
      ],
      Variable: [],
    });

    const result = buildDuplicatedPhysicalInstance({
      agencyId: "test-agency",
      data,
      label: "Test",
      defaultLocale: "fr-FR",
    });

    expect(itemsOfType(result.duplicatedData, "DataRelationship")[0].Label[0]["@value"]).toBe(
      "Structure : Test",
    );
  });

  it("should add BasedOnObject to PhysicalInstance", () => {
    const data = envelope({
      PhysicalInstance: [
        {
          ID: "original-pi-id",
          Agency: "original-agency",
          Version: "1",
          Citation: {
            Title: [{ "@language": "fr-FR", "@value": "Test" }],
          },
        },
      ],
      DataRelationship: [
        {
          ID: "original-dr-id",
          Agency: "original-agency",
          Version: "1",
          Label: [{ "@language": "fr-FR", "@value": "DR Name" }],
          LogicalRecord: [
            {
              ID: "original-lr-id",
              URN: "urn:ddi:original-agency:original-lr-id:1",
              Agency: "original-agency",
              Version: "1",
              VariablesInRecord: { VariableUsedReference: [] },
            },
          ],
        },
      ],
      Variable: [],
    });

    const result = buildDuplicatedPhysicalInstance({
      agencyId: "test-agency",
      data,
      label: "Test",
      defaultLocale: "fr-FR",
    });

    expect(itemsOfType(result.duplicatedData, "PhysicalInstance")[0].BasedOnObject).toEqual({
      $type: "BasedOnObjectType",
      BasedOnReference: [
        {
          $type: "PhysicalInstance",
          URN: "urn:ddi:original-agency:original-pi-id:1",
          Agency: "original-agency",
          ID: "original-pi-id",
          Version: "1",
        },
      ],
    });
  });

  it("should add BasedOnObject to DataRelationship", () => {
    const data = envelope({
      PhysicalInstance: [
        {
          ID: "original-pi-id",
          Agency: "original-agency",
          Version: "1",
          Citation: {
            Title: [{ "@language": "fr-FR", "@value": "Test" }],
          },
        },
      ],
      DataRelationship: [
        {
          ID: "original-dr-id",
          Agency: "original-agency",
          Version: "1",
          Label: [{ "@language": "fr-FR", "@value": "DR Name" }],
          LogicalRecord: [
            {
              ID: "original-lr-id",
              URN: "urn:ddi:original-agency:original-lr-id:1",
              Agency: "original-agency",
              Version: "1",
              VariablesInRecord: { VariableUsedReference: [] },
            },
          ],
        },
      ],
      Variable: [],
    });

    const result = buildDuplicatedPhysicalInstance({
      agencyId: "test-agency",
      data,
      label: "Test",
      defaultLocale: "fr-FR",
    });

    expect(itemsOfType(result.duplicatedData, "DataRelationship")[0].BasedOnObject).toEqual({
      $type: "BasedOnObjectType",
      BasedOnReference: [
        {
          $type: "DataRelationship",
          URN: "urn:ddi:original-agency:original-dr-id:1",
          Agency: "original-agency",
          ID: "original-dr-id",
          Version: "1",
        },
      ],
    });
  });

  it("should generate new IDs for Variables and add BasedOnObject", () => {
    uuidIndex = 0;
    const data = envelope({
      PhysicalInstance: [
        {
          ID: "original-pi-id",
          Agency: "original-agency",
          Version: "1",
          Citation: {
            Title: [{ "@language": "fr-FR", "@value": "Test" }],
          },
        },
      ],
      DataRelationship: [
        {
          ID: "original-dr-id",
          Agency: "original-agency",
          Version: "1",
          Label: [{ "@language": "fr-FR", "@value": "DR Name" }],
          LogicalRecord: [
            {
              ID: "original-lr-id",
              URN: "urn:ddi:original-agency:original-lr-id:1",
              Agency: "original-agency",
              Version: "1",
              VariablesInRecord: { VariableUsedReference: [] },
            },
          ],
        },
      ],
      Variable: [
        {
          ID: "original-var-id-1",
          Agency: "original-agency",
          Version: "1",
          VariableName: [{ "@language": "fr-FR", "@value": "Var1" }],
        },
        {
          ID: "original-var-id-2",
          Agency: "original-agency",
          Version: "2",
          VariableName: [{ "@language": "fr-FR", "@value": "Var2" }],
        },
      ],
    });

    const result = buildDuplicatedPhysicalInstance({
      agencyId: "test-agency",
      data,
      label: "Test",
      defaultLocale: "fr-FR",
    });

    // Variables should have new IDs
    expect(itemsOfType(result.duplicatedData, "Variable")[0].ID).not.toBe("original-var-id-1");
    expect(itemsOfType(result.duplicatedData, "Variable")[1].ID).not.toBe("original-var-id-2");

    // Variables should have BasedOnObject
    expect(itemsOfType(result.duplicatedData, "Variable")[0].BasedOnObject).toEqual({
      $type: "BasedOnObjectType",
      BasedOnReference: [
        {
          $type: "Variable",
          URN: "urn:ddi:original-agency:original-var-id-1:1",
          Agency: "original-agency",
          ID: "original-var-id-1",
          Version: "1",
        },
      ],
    });

    expect(itemsOfType(result.duplicatedData, "Variable")[1].BasedOnObject).toEqual({
      $type: "BasedOnObjectType",
      BasedOnReference: [
        {
          $type: "Variable",
          URN: "urn:ddi:original-agency:original-var-id-2:2",
          Agency: "original-agency",
          ID: "original-var-id-2",
          Version: "2",
        },
      ],
    });
  });

  it("should update URN for all objects", () => {
    const data = envelope({
      PhysicalInstance: [
        {
          ID: "original-pi-id",
          Agency: "original-agency",
          Version: "1",
          URN: "urn:ddi:original-agency:original-pi-id:1",
          Citation: {
            Title: [{ "@language": "fr-FR", "@value": "Test" }],
          },
        },
      ],
      DataRelationship: [
        {
          ID: "original-dr-id",
          Agency: "original-agency",
          Version: "1",
          URN: "urn:ddi:original-agency:original-dr-id:1",
          Label: [{ "@language": "fr-FR", "@value": "DR Name" }],
          LogicalRecord: [
            {
              ID: "original-lr-id",
              URN: "urn:ddi:original-agency:original-lr-id:1",
              Agency: "original-agency",
              Version: "1",
              VariablesInRecord: { VariableUsedReference: [] },
            },
          ],
        },
      ],
      Variable: [],
    });

    const result = buildDuplicatedPhysicalInstance({
      agencyId: "test-agency",
      data,
      label: "Test",
      defaultLocale: "fr-FR",
    });

    expect(itemsOfType(result.duplicatedData, "PhysicalInstance")[0].URN).toBe(
      `urn:ddi:test-agency:${result.newPhysicalInstanceId}:1`,
    );
    expect(itemsOfType(result.duplicatedData, "DataRelationship")[0].URN).toContain(
      "urn:ddi:test-agency:",
    );
    expect(
      itemsOfType(result.duplicatedData, "DataRelationship")[0].LogicalRecord![0].URN,
    ).toContain("urn:ddi:test-agency:");
  });

  it("should update Agency for all objects", () => {
    const data = envelope({
      PhysicalInstance: [
        {
          ID: "original-pi-id",
          Agency: "original-agency",
          Version: "1",
          Citation: {
            Title: [{ "@language": "fr-FR", "@value": "Test" }],
          },
        },
      ],
      DataRelationship: [
        {
          ID: "original-dr-id",
          Agency: "original-agency",
          Version: "1",
          Label: [{ "@language": "fr-FR", "@value": "DR Name" }],
          LogicalRecord: [
            {
              ID: "original-lr-id",
              URN: "urn:ddi:original-agency:original-lr-id:1",
              Agency: "original-agency",
              Version: "1",
              VariablesInRecord: { VariableUsedReference: [] },
            },
          ],
        },
      ],
      Variable: [],
    });

    const result = buildDuplicatedPhysicalInstance({
      agencyId: "test-agency",
      data,
      label: "Test",
      defaultLocale: "fr-FR",
    });

    expect(itemsOfType(result.duplicatedData, "PhysicalInstance")[0].Agency).toBe("test-agency");
    expect(itemsOfType(result.duplicatedData, "DataRelationship")[0].Agency).toBe("test-agency");
    expect(itemsOfType(result.duplicatedData, "DataRelationship")[0].LogicalRecord![0].Agency).toBe(
      "test-agency",
    );
  });

  it("should update DataRelationshipReference in PhysicalInstance", () => {
    const data = envelope({
      PhysicalInstance: [
        {
          ID: "original-pi-id",
          Agency: "original-agency",
          Version: "1",
          Citation: {
            Title: [{ "@language": "fr-FR", "@value": "Test" }],
          },
          DataRelationshipReference: {
            Agency: "original-agency",
            ID: "original-dr-id",
            Version: "1",
            TypeOfObject: "DataRelationship",
          },
        },
      ],
      DataRelationship: [
        {
          ID: "original-dr-id",
          Agency: "original-agency",
          Version: "1",
          Label: [{ "@language": "fr-FR", "@value": "DR Name" }],
          LogicalRecord: [
            {
              ID: "original-lr-id",
              URN: "urn:ddi:original-agency:original-lr-id:1",
              Agency: "original-agency",
              Version: "1",
              VariablesInRecord: { VariableUsedReference: [] },
            },
          ],
        },
      ],
      Variable: [],
    });

    const result = buildDuplicatedPhysicalInstance({
      agencyId: "test-agency",
      data,
      label: "Test",
      defaultLocale: "fr-FR",
    });

    expect(
      itemsOfType(result.duplicatedData, "PhysicalInstance")[0].DataRelationshipReference[0].ID,
    ).toBe(NEW_DATA_RELATIONSHIP_ID);
    expect(
      itemsOfType(result.duplicatedData, "PhysicalInstance")[0].DataRelationshipReference[0].Agency,
    ).toBe("test-agency");
  });

  it("should update VariablesInRecord with new variable IDs", () => {
    uuidIndex = 0;
    const data = envelope({
      PhysicalInstance: [
        {
          ID: "original-pi-id",
          Agency: "original-agency",
          Version: "1",
          Citation: {
            Title: [{ "@language": "fr-FR", "@value": "Test" }],
          },
        },
      ],
      DataRelationship: [
        {
          ID: "original-dr-id",
          Agency: "original-agency",
          Version: "1",
          Label: [{ "@language": "fr-FR", "@value": "DR Name" }],
          LogicalRecord: [
            {
              ID: "original-lr-id",
              URN: "urn:ddi:original-agency:original-lr-id:1",
              Agency: "original-agency",
              Version: "1",
              VariablesInRecord: {
                VariableUsedReference: [
                  {
                    Agency: "original-agency",
                    ID: "original-var-id-1",
                    Version: "1",
                  },
                ],
              },
            },
          ],
        },
      ],
      Variable: [
        {
          ID: "original-var-id-1",
          Agency: "original-agency",
          Version: "1",
          VariableName: [{ "@language": "fr-FR", "@value": "Var1" }],
        },
      ],
    });

    const result = buildDuplicatedPhysicalInstance({
      agencyId: "test-agency",
      data,
      label: "Test",
      defaultLocale: "fr-FR",
    });

    const variableRefs = itemsOfType(result.duplicatedData, "DataRelationship")[0].LogicalRecord![0]
      .VariablesInRecord.VariableUsedReference;

    expect(variableRefs).toHaveLength(1);
    expect(variableRefs[0].Agency).toBe("test-agency");
    expect(variableRefs[0].ID).not.toBe("original-var-id-1");
  });

  it("should preserve CodeList and Category without regenerating IDs", () => {
    const data = envelope({
      PhysicalInstance: [
        {
          ID: "original-pi-id",
          Agency: "original-agency",
          Version: "1",
          Citation: {
            Title: [{ "@language": "fr-FR", "@value": "Test" }],
          },
        },
      ],
      DataRelationship: [
        {
          ID: "original-dr-id",
          Agency: "original-agency",
          Version: "1",
          Label: [{ "@language": "fr-FR", "@value": "DR Name" }],
          LogicalRecord: [
            {
              ID: "original-lr-id",
              URN: "urn:ddi:original-agency:original-lr-id:1",
              Agency: "original-agency",
              Version: "1",
              VariablesInRecord: { VariableUsedReference: [] },
            },
          ],
        },
      ],
      Variable: [],
      CodeList: [
        {
          ID: "codelist-id",
          Agency: "original-agency",
          CodeListName: [{ "@language": "fr-FR", "@value": "My CodeList" }],
        },
      ],
      Category: [
        {
          ID: "category-id",
          Agency: "original-agency",
          CategoryName: [{ "@language": "fr-FR", "@value": "Category 1" }],
        },
      ],
    });

    const result = buildDuplicatedPhysicalInstance({
      agencyId: "test-agency",
      data,
      label: "Test",
      defaultLocale: "fr-FR",
    });

    // CodeList and Category should be preserved as-is
    expect(itemsOfType(result.duplicatedData, "CodeList")).toEqual(itemsOfType(data, "CodeList"));
    expect(itemsOfType(result.duplicatedData, "Category")).toEqual(itemsOfType(data, "Category"));
  });

  it("should set VersionDate.DateTime to current date for all modified objects", () => {
    const data = envelope({
      PhysicalInstance: [
        {
          ID: "original-pi-id",
          Agency: "original-agency",
          Version: "1",
          VersionDate: { DateTime: "2020-01-01T00:00:00.000Z" },
          Citation: {
            Title: [{ "@language": "fr-FR", "@value": "Test" }],
          },
        },
      ],
      DataRelationship: [
        {
          ID: "original-dr-id",
          Agency: "original-agency",
          Version: "1",
          VersionDate: { DateTime: "2020-01-01T00:00:00.000Z" },
          Label: [{ "@language": "fr-FR", "@value": "DR Name" }],
          LogicalRecord: [
            {
              ID: "original-lr-id",
              URN: "urn:ddi:original-agency:original-lr-id:1",
              Agency: "original-agency",
              Version: "1",
              VersionDate: { DateTime: "2020-01-01T00:00:00.000Z" },
              VariablesInRecord: { VariableUsedReference: [] },
            },
          ],
        },
      ],
      Variable: [],
    });

    const beforeTest = new Date().toISOString().substring(0, 10);
    const result = buildDuplicatedPhysicalInstance({
      agencyId: "test-agency",
      data,
      label: "Test",
      defaultLocale: "fr-FR",
    });

    // Check that VersionDate.DateTime is updated to today
    expect(
      itemsOfType(result.duplicatedData, "PhysicalInstance")[0].VersionDate?.DateTime.substring(
        0,
        10,
      ),
    ).toBe(beforeTest);
    expect(
      itemsOfType(result.duplicatedData, "DataRelationship")[0].VersionDate?.DateTime.substring(
        0,
        10,
      ),
    ).toBe(beforeTest);
  });

  it("should handle empty Variable array", () => {
    const data = envelope({
      PhysicalInstance: [
        {
          ID: "original-pi-id",
          Agency: "original-agency",
          Version: "1",
          Citation: {
            Title: [{ "@language": "fr-FR", "@value": "Test" }],
          },
        },
      ],
      DataRelationship: [
        {
          ID: "original-dr-id",
          Agency: "original-agency",
          Version: "1",
          Label: [{ "@language": "fr-FR", "@value": "DR Name" }],
          LogicalRecord: [
            {
              ID: "original-lr-id",
              URN: "urn:ddi:original-agency:original-lr-id:1",
              Agency: "original-agency",
              Version: "1",
              VariablesInRecord: { VariableUsedReference: [] },
            },
          ],
        },
      ],
      Variable: [],
    });

    const result = buildDuplicatedPhysicalInstance({
      agencyId: "test-agency",
      data,
      label: "Test",
      defaultLocale: "fr-FR",
    });

    expect(itemsOfType(result.duplicatedData, "Variable")).toEqual([]);
  });

  it("should handle undefined Variable", () => {
    const data = envelope({
      PhysicalInstance: [
        {
          ID: "original-pi-id",
          Agency: "original-agency",
          Version: "1",
          Citation: {
            Title: [{ "@language": "fr-FR", "@value": "Test" }],
          },
        },
      ],
      DataRelationship: [
        {
          ID: "original-dr-id",
          Agency: "original-agency",
          Version: "1",
          Label: [{ "@language": "fr-FR", "@value": "DR Name" }],
          LogicalRecord: [
            {
              ID: "original-lr-id",
              URN: "urn:ddi:original-agency:original-lr-id:1",
              Agency: "original-agency",
              Version: "1",
              VariablesInRecord: { VariableUsedReference: [] },
            },
          ],
        },
      ],
    });

    const result = buildDuplicatedPhysicalInstance({
      agencyId: "test-agency",
      data,
      label: "Test",
      defaultLocale: "fr-FR",
    });

    // Sans variable d'origine, l'enveloppe dupliquée n'en porte simplement aucune.
    expect(itemsOfType(result.duplicatedData, "Variable")).toEqual([]);
  });
});

describe("buildDuplicatedLogicalRecord", () => {
  it("should preserve language tag from original", () => {
    const original = {
      $type: "LogicalRecordType" as const,
      ID: "old-id",
      URN: "urn:ddi:old:old-id:1",
      Agency: "old-agency",
      Version: "1",
      Label: [{ "@language": "en-US", "@value": "Original Label" }],
      VariablesInRecord: { VariableUsedReference: [] },
    };

    const result = buildDuplicatedLogicalRecord({
      originalLogicalRecord: original,
      newLogicalRecordId: "new-id",
      newAgencyId: "new-agency",
      label: "Test",
      variableIdMap: new Map(),
      defaultLocale: "fr-FR",
    });

    expect(result.Label?.[0]?.["@language"]).toBe("en-US");
  });

  it("should fallback to defaultLocale when no lang specified", () => {
    const original = {
      $type: "LogicalRecordType" as const,
      ID: "old-id",
      URN: "urn:ddi:old:old-id:1",
      Agency: "old-agency",
      Version: "1",
      VariablesInRecord: { VariableUsedReference: [] },
    };

    const result = buildDuplicatedLogicalRecord({
      originalLogicalRecord: original,
      newLogicalRecordId: "new-id",
      newAgencyId: "new-agency",
      label: "Test",
      variableIdMap: new Map(),
      defaultLocale: "fr-FR",
    });

    expect(result.Label?.[0]?.["@language"]).toBe("fr-FR");
  });

  it("should generate correct label using buildLogicalRecordLabel", () => {
    const original = {
      $type: "LogicalRecordType" as const,
      ID: "old-id",
      URN: "urn:ddi:old:old-id:1",
      Agency: "old-agency",
      Version: "1",
      VariablesInRecord: { VariableUsedReference: [] },
    };

    const result = buildDuplicatedLogicalRecord({
      originalLogicalRecord: original,
      newLogicalRecordId: "new-id",
      newAgencyId: "new-agency",
      label: "MyTitle",
      variableIdMap: new Map(),
      defaultLocale: "fr-FR",
    });

    expect(result.Label?.[0]?.["@value"]).toBe("Enregistrement logique : MyTitle");
  });

  it("should throw error when originalLogicalRecord is missing", () => {
    expect(() => {
      buildDuplicatedLogicalRecord({
        originalLogicalRecord: null as any,
        newLogicalRecordId: "id",
        newAgencyId: "agency",
        label: "Test",
        variableIdMap: new Map(),
        defaultLocale: "fr-FR",
      });
    }).toThrow("originalLogicalRecord is required");
  });

  it("should throw error when newLogicalRecordId is empty", () => {
    const original = {
      $type: "LogicalRecordType" as const,
      ID: "old-id",
      URN: "urn:ddi:old:old-id:1",
      Agency: "old-agency",
      Version: "1",
      VariablesInRecord: { VariableUsedReference: [] },
    };

    expect(() => {
      buildDuplicatedLogicalRecord({
        originalLogicalRecord: original,
        newLogicalRecordId: "",
        newAgencyId: "agency",
        label: "Test",
        variableIdMap: new Map(),
        defaultLocale: "fr-FR",
      });
    }).toThrow("newLogicalRecordId and newAgencyId are required");
  });
});

describe("buildDuplicatedDataRelationship", () => {
  it("should create proper BasedOnObject", () => {
    const original = {
      $type: "DataRelationship" as const,
      ID: "old-dr-id",
      URN: "urn:ddi:old:old-dr-id:1",
      Agency: "old-agency",
      Version: "2",
      LogicalRecord: [
        {
          $type: "LogicalRecordType" as const,
          ID: "old-lr-id",
          URN: "urn:ddi:old:old-lr-id:1",
          Agency: "old-agency",
          Version: "1",
          VariablesInRecord: { VariableUsedReference: [] },
        },
      ],
    };

    const result = buildDuplicatedDataRelationship({
      originalDataRelationship: original,
      newDataRelationshipId: "new-dr-id",
      newAgencyId: "new-agency",
      label: "Test",
      newLogicalRecordId: "new-lr-id",
      variableIdMap: new Map(),
      defaultLocale: "fr-FR",
    });

    expect(result.BasedOnObject).toEqual({
      $type: "BasedOnObjectType",
      BasedOnReference: [
        {
          $type: "DataRelationship",
          URN: "urn:ddi:old-agency:old-dr-id:2",
          Agency: "old-agency",
          ID: "old-dr-id",
          Version: "2",
        },
      ],
    });
  });

  it("should preserve language tag from original DataRelationship", () => {
    const original = {
      $type: "DataRelationship" as const,
      ID: "old-dr-id",
      URN: "urn:ddi:old:old-dr-id:1",
      Agency: "old-agency",
      Version: "1",
      Label: [{ "@language": "en-GB", "@value": "Original Label" }],
      LogicalRecord: [
        {
          $type: "LogicalRecordType" as const,
          ID: "old-lr-id",
          URN: "urn:ddi:old:old-lr-id:1",
          Agency: "old-agency",
          Version: "1",
          VariablesInRecord: { VariableUsedReference: [] },
        },
      ],
    };

    const result = buildDuplicatedDataRelationship({
      originalDataRelationship: original,
      newDataRelationshipId: "new-dr-id",
      newAgencyId: "new-agency",
      label: "Test",
      newLogicalRecordId: "new-lr-id",
      variableIdMap: new Map(),
      defaultLocale: "fr-FR",
    });

    expect(result.Label?.[0]?.["@language"]).toBe("en-GB");
  });

  it("should throw error when originalDataRelationship is missing", () => {
    expect(() => {
      buildDuplicatedDataRelationship({
        originalDataRelationship: null as any,
        newDataRelationshipId: "new-dr-id",
        newAgencyId: "new-agency",
        label: "Test",
        newLogicalRecordId: "new-lr-id",
        variableIdMap: new Map(),
        defaultLocale: "fr-FR",
      });
    }).toThrow("originalDataRelationship is required");
  });

  it("should throw error when required IDs are empty", () => {
    const original = {
      $type: "DataRelationship" as const,
      ID: "old-dr-id",
      URN: "urn:ddi:old:old-dr-id:1",
      Agency: "old-agency",
      Version: "1",
      LogicalRecord: [
        {
          $type: "LogicalRecordType" as const,
          ID: "old-lr-id",
          URN: "urn:ddi:old:old-lr-id:1",
          Agency: "old-agency",
          Version: "1",
          VariablesInRecord: { VariableUsedReference: [] },
        },
      ],
    };

    expect(() => {
      buildDuplicatedDataRelationship({
        originalDataRelationship: original,
        newDataRelationshipId: "",
        newAgencyId: "new-agency",
        label: "Test",
        newLogicalRecordId: "new-lr-id",
        variableIdMap: new Map(),
        defaultLocale: "fr-FR",
      });
    }).toThrow("newDataRelationshipId, newAgencyId, and newLogicalRecordId are required");
  });
});
