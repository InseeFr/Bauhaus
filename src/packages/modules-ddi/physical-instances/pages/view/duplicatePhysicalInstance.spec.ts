import { describe, it, expect, vi, beforeEach } from "vitest";

import type { PhysicalInstanceResponse } from "../../types/api";
import { itemsOfType } from "../../types/ddi4Items";
import { envelope } from "../../types/ddi4Items.testing";
import {
  buildDuplicatedPhysicalInstance,
  buildDuplicatedLogicalRecord,
  buildDuplicatedDataRelationship,
} from "./duplicatePhysicalInstance";

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

const fr = (value: string) => [{ "@language": "fr-FR", "@value": value }];

/** Référence `BasedOnObject` vers l'objet d'origine. */
const basedOn = ($type: string, agency: string, id: string, version: string) => ({
  $type: "BasedOnObjectType",
  BasedOnReference: [
    {
      $type,
      URN: `urn:ddi:${agency}:${id}:${version}`,
      Agency: agency,
      ID: id,
      Version: version,
    },
  ],
});

const originalLogicalRecord = (overrides: Record<string, unknown> = {}) => ({
  ID: "original-lr-id",
  URN: "urn:ddi:original-agency:original-lr-id:1",
  Agency: "original-agency",
  Version: "1",
  VariablesInRecord: { VariableUsedReference: [] },
  ...overrides,
});

/**
 * Instance physique à dupliquer : une PI, sa DataRelationship et son LogicalRecord, chez
 * `original-agency`. `variables` à `null` retire la clé `Variable` de l'enveloppe.
 */
const physicalInstanceToDuplicate = ({
  title = "Test",
  dataRelationshipName = "DR Name",
  physicalInstance = {},
  dataRelationship = {},
  logicalRecord = {},
  variables = [] as readonly unknown[] | null,
  extraItems = {} as Parameters<typeof envelope>[0],
}: {
  title?: string;
  dataRelationshipName?: string;
  physicalInstance?: Record<string, unknown>;
  dataRelationship?: Record<string, unknown>;
  logicalRecord?: Record<string, unknown>;
  variables?: readonly unknown[] | null;
  extraItems?: Parameters<typeof envelope>[0];
} = {}) =>
  envelope({
    PhysicalInstance: [
      {
        ID: "original-pi-id",
        Agency: "original-agency",
        Version: "1",
        Citation: { Title: fr(title) },
        ...physicalInstance,
      },
    ],
    DataRelationship: [
      {
        ID: "original-dr-id",
        Agency: "original-agency",
        Version: "1",
        Label: fr(dataRelationshipName),
        LogicalRecord: [originalLogicalRecord(logicalRecord)],
        ...dataRelationship,
      },
    ],
    ...(variables ? { Variable: variables } : {}),
    ...extraItems,
  });

const duplicate = (data: PhysicalInstanceResponse, label = "Test") =>
  buildDuplicatedPhysicalInstance({ agencyId: "test-agency", data, label, defaultLocale: "fr-FR" });

describe("buildDuplicatedPhysicalInstance", () => {
  beforeEach(() => {
    uuidIndex = 0;
  });

  it("should generate new IDs for PhysicalInstance, DataRelationship, and LogicalRecord", () => {
    const data = physicalInstanceToDuplicate({
      title: "Original Title",
      dataRelationshipName: "Original DR Name",
      physicalInstance: { PhysicalInstanceLabel: fr("Original Label") },
    });

    const result = duplicate(data, "Original Title");

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
    const data = physicalInstanceToDuplicate({
      title: "Original Title",
      dataRelationshipName: "Original DR Name",
    });

    const result = duplicate(data, "Original Title (copy)");

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
    const data = physicalInstanceToDuplicate({
      title: "Original Title",
      dataRelationshipName: "Original DR Name",
      physicalInstance: { PhysicalInstanceLabel: fr("Original Label") },
    });

    const result = duplicate(data, "Original Title");

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
    const data = physicalInstanceToDuplicate({ dataRelationshipName: "Original DR Name" });

    const result = duplicate(data);

    expect(itemsOfType(result.duplicatedData, "DataRelationship")[0].Label[0]["@value"]).toBe(
      "Structure : Test",
    );
  });

  it("should add BasedOnObject to PhysicalInstance", () => {
    const result = duplicate(physicalInstanceToDuplicate());

    expect(itemsOfType(result.duplicatedData, "PhysicalInstance")[0].BasedOnObject).toEqual(
      basedOn("PhysicalInstance", "original-agency", "original-pi-id", "1"),
    );
  });

  it("should add BasedOnObject to DataRelationship", () => {
    const result = duplicate(physicalInstanceToDuplicate());

    expect(itemsOfType(result.duplicatedData, "DataRelationship")[0].BasedOnObject).toEqual(
      basedOn("DataRelationship", "original-agency", "original-dr-id", "1"),
    );
  });

  it("should generate new IDs for Variables and add BasedOnObject", () => {
    const data = physicalInstanceToDuplicate({
      variables: [
        {
          ID: "original-var-id-1",
          Agency: "original-agency",
          Version: "1",
          VariableName: fr("Var1"),
        },
        {
          ID: "original-var-id-2",
          Agency: "original-agency",
          Version: "2",
          VariableName: fr("Var2"),
        },
      ],
    });

    const result = duplicate(data);

    // Variables should have new IDs
    expect(itemsOfType(result.duplicatedData, "Variable")[0].ID).not.toBe("original-var-id-1");
    expect(itemsOfType(result.duplicatedData, "Variable")[1].ID).not.toBe("original-var-id-2");

    // Variables should have BasedOnObject
    expect(itemsOfType(result.duplicatedData, "Variable")[0].BasedOnObject).toEqual(
      basedOn("Variable", "original-agency", "original-var-id-1", "1"),
    );

    expect(itemsOfType(result.duplicatedData, "Variable")[1].BasedOnObject).toEqual(
      basedOn("Variable", "original-agency", "original-var-id-2", "2"),
    );
  });

  it("should update URN for all objects", () => {
    const data = physicalInstanceToDuplicate({
      physicalInstance: { URN: "urn:ddi:original-agency:original-pi-id:1" },
      dataRelationship: { URN: "urn:ddi:original-agency:original-dr-id:1" },
    });

    const result = duplicate(data);

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
    const result = duplicate(physicalInstanceToDuplicate());

    expect(itemsOfType(result.duplicatedData, "PhysicalInstance")[0].Agency).toBe("test-agency");
    expect(itemsOfType(result.duplicatedData, "DataRelationship")[0].Agency).toBe("test-agency");
    expect(itemsOfType(result.duplicatedData, "DataRelationship")[0].LogicalRecord![0].Agency).toBe(
      "test-agency",
    );
  });

  it("should update DataRelationshipReference in PhysicalInstance", () => {
    const data = physicalInstanceToDuplicate({
      physicalInstance: {
        DataRelationshipReference: {
          Agency: "original-agency",
          ID: "original-dr-id",
          Version: "1",
          TypeOfObject: "DataRelationship",
        },
      },
    });

    const result = duplicate(data);

    expect(
      itemsOfType(result.duplicatedData, "PhysicalInstance")[0].DataRelationshipReference[0].ID,
    ).toBe(NEW_DATA_RELATIONSHIP_ID);
    expect(
      itemsOfType(result.duplicatedData, "PhysicalInstance")[0].DataRelationshipReference[0].Agency,
    ).toBe("test-agency");
  });

  it("should update VariablesInRecord with new variable IDs", () => {
    const data = physicalInstanceToDuplicate({
      logicalRecord: {
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
      variables: [
        {
          ID: "original-var-id-1",
          Agency: "original-agency",
          Version: "1",
          VariableName: fr("Var1"),
        },
      ],
    });

    const result = duplicate(data);

    const variableRefs = itemsOfType(result.duplicatedData, "DataRelationship")[0].LogicalRecord![0]
      .VariablesInRecord.VariableUsedReference;

    expect(variableRefs).toHaveLength(1);
    expect(variableRefs[0].Agency).toBe("test-agency");
    expect(variableRefs[0].ID).not.toBe("original-var-id-1");
  });

  it("should preserve CodeList and Category without regenerating IDs", () => {
    const data = physicalInstanceToDuplicate({
      extraItems: {
        CodeList: [
          {
            ID: "codelist-id",
            Agency: "original-agency",
            CodeListName: fr("My CodeList"),
          },
        ],
        Category: [
          {
            ID: "category-id",
            Agency: "original-agency",
            CategoryName: fr("Category 1"),
          },
        ],
      },
    });

    const result = duplicate(data);

    // CodeList and Category should be preserved as-is
    expect(itemsOfType(result.duplicatedData, "CodeList")).toEqual(itemsOfType(data, "CodeList"));
    expect(itemsOfType(result.duplicatedData, "Category")).toEqual(itemsOfType(data, "Category"));
  });

  it("should set VersionDate.DateTime to current date for all modified objects", () => {
    const versionDate = { VersionDate: { DateTime: "2020-01-01T00:00:00.000Z" } };
    const data = physicalInstanceToDuplicate({
      physicalInstance: versionDate,
      dataRelationship: versionDate,
      logicalRecord: versionDate,
    });

    const beforeTest = new Date().toISOString().substring(0, 10);
    const result = duplicate(data);

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
    const result = duplicate(physicalInstanceToDuplicate());

    expect(itemsOfType(result.duplicatedData, "Variable")).toEqual([]);
  });

  it("should handle undefined Variable", () => {
    const result = duplicate(physicalInstanceToDuplicate({ variables: null }));

    // Sans variable d'origine, l'enveloppe dupliquée n'en porte simplement aucune.
    expect(itemsOfType(result.duplicatedData, "Variable")).toEqual([]);
  });
});

describe("buildDuplicatedLogicalRecord", () => {
  const original = (overrides: Record<string, unknown> = {}) => ({
    $type: "LogicalRecordType" as const,
    ID: "old-id",
    URN: "urn:ddi:old:old-id:1",
    Agency: "old-agency",
    Version: "1",
    VariablesInRecord: { VariableUsedReference: [] },
    ...overrides,
  });

  const duplicateLogicalRecord = (
    overrides: Partial<Parameters<typeof buildDuplicatedLogicalRecord>[0]> = {},
  ) =>
    buildDuplicatedLogicalRecord({
      originalLogicalRecord: original(),
      newLogicalRecordId: "new-id",
      newAgencyId: "new-agency",
      label: "Test",
      variableIdMap: new Map(),
      defaultLocale: "fr-FR",
      ...overrides,
    });

  it("should preserve language tag from original", () => {
    const result = duplicateLogicalRecord({
      originalLogicalRecord: original({
        Label: [{ "@language": "en-US", "@value": "Original Label" }],
      }),
    });

    expect(result.Label?.[0]?.["@language"]).toBe("en-US");
  });

  it("should fallback to defaultLocale when no lang specified", () => {
    const result = duplicateLogicalRecord();

    expect(result.Label?.[0]?.["@language"]).toBe("fr-FR");
  });

  it("should generate correct label using buildLogicalRecordLabel", () => {
    const result = duplicateLogicalRecord({ label: "MyTitle" });

    expect(result.Label?.[0]?.["@value"]).toBe("Enregistrement logique : MyTitle");
  });

  it("should throw error when originalLogicalRecord is missing", () => {
    expect(() => {
      duplicateLogicalRecord({
        originalLogicalRecord: null as any,
        newLogicalRecordId: "id",
        newAgencyId: "agency",
      });
    }).toThrow("originalLogicalRecord is required");
  });

  it("should throw error when newLogicalRecordId is empty", () => {
    expect(() => {
      duplicateLogicalRecord({ newLogicalRecordId: "", newAgencyId: "agency" });
    }).toThrow("newLogicalRecordId and newAgencyId are required");
  });
});

describe("buildDuplicatedDataRelationship", () => {
  const original = (overrides: Record<string, unknown> = {}) => ({
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
    ...overrides,
  });

  const duplicateDataRelationship = (
    overrides: Partial<Parameters<typeof buildDuplicatedDataRelationship>[0]> = {},
  ) =>
    buildDuplicatedDataRelationship({
      originalDataRelationship: original(),
      newDataRelationshipId: "new-dr-id",
      newAgencyId: "new-agency",
      label: "Test",
      newLogicalRecordId: "new-lr-id",
      variableIdMap: new Map(),
      defaultLocale: "fr-FR",
      ...overrides,
    });

  it("should create proper BasedOnObject", () => {
    const result = duplicateDataRelationship({
      originalDataRelationship: original({ Version: "2" }),
    });

    expect(result.BasedOnObject).toEqual(
      basedOn("DataRelationship", "old-agency", "old-dr-id", "2"),
    );
  });

  it("should preserve language tag from original DataRelationship", () => {
    const result = duplicateDataRelationship({
      originalDataRelationship: original({
        Label: [{ "@language": "en-GB", "@value": "Original Label" }],
      }),
    });

    expect(result.Label?.[0]?.["@language"]).toBe("en-GB");
  });

  it("should throw error when originalDataRelationship is missing", () => {
    expect(() => {
      duplicateDataRelationship({ originalDataRelationship: null as any });
    }).toThrow("originalDataRelationship is required");
  });

  it("should throw error when required IDs are empty", () => {
    expect(() => {
      duplicateDataRelationship({ newDataRelationshipId: "" });
    }).toThrow("newDataRelationshipId, newAgencyId, and newLogicalRecordId are required");
  });
});
