import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  buildDuplicatedPhysicalInstance,
  buildDuplicatedLogicalRecord,
  buildDuplicatedDataRelationship,
} from "./duplicatePhysicalInstance";

// Mock crypto.randomUUID
const mockUUIDs = [
  "new-physical-instance-id",
  "new-data-relationship-id",
  "new-logical-record-id",
  "new-variable-id-1",
  "new-variable-id-2",
];
let uuidIndex = 0;

vi.stubGlobal("crypto", {
  randomUUID: () => mockUUIDs[uuidIndex++] || `uuid-${uuidIndex}`,
});

describe("buildDuplicatedPhysicalInstance", () => {
  beforeEach(() => {
    uuidIndex = 0;
  });

  it("should generate new IDs for PhysicalInstance, DataRelationship, and LogicalRecord", () => {
    const data = {
      PhysicalInstance: [
        {
          ID: "original-pi-id",
          Agency: "original-agency",
          Version: "1",
          Citation: { Title: { String: { "#text": "Original Title" } } },
          PhysicalInstanceLabel: { Content: { "#text": "Original Label" } },
        },
      ],
      DataRelationship: [
        {
          ID: "original-dr-id",
          Agency: "original-agency",
          Version: "1",
          Label: {
            Content: { "@xml:lang": "fr-FR", "#text": "Original DR Name" },
          },
          LogicalRecord: {
            ID: "original-lr-id",
            URN: "urn:ddi:original-agency:original-lr-id:1",
            Agency: "original-agency",
            Version: "1",
            VariablesInRecord: { VariableUsedReference: [] },
          },
        },
      ],
      Variable: [],
    };

    const result = buildDuplicatedPhysicalInstance({
      agencyId: "test-agency",
      data,
      title: "Original Title",
      defaultLocale: "fr-FR",
    });

    expect(result.newPhysicalInstanceId).toBe("new-physical-instance-id");
    expect(result.newAgencyId).toBe("test-agency");
    expect(result.duplicatedData.PhysicalInstance[0].ID).toBe("new-physical-instance-id");
    expect(result.duplicatedData.DataRelationship[0].ID).toBe("new-data-relationship-id");
    expect(result.duplicatedData.DataRelationship[0].LogicalRecord.ID).toBe(
      "new-logical-record-id",
    );
  });

  it("should add (copy) suffix to Citation Title and PhysicalInstanceLabel", () => {
    const data = {
      PhysicalInstance: [
        {
          ID: "original-pi-id",
          Agency: "original-agency",
          Version: "1",
          Citation: { Title: { String: { "#text": "Original Title" } } },
          PhysicalInstanceLabel: { Content: { "#text": "Original Label" } },
        },
      ],
      DataRelationship: [
        {
          ID: "original-dr-id",
          Agency: "original-agency",
          Version: "1",
          Label: {
            Content: { "@xml:lang": "fr-FR", "#text": "Original DR Name" },
          },
          LogicalRecord: {
            ID: "original-lr-id",
            URN: "urn:ddi:original-agency:original-lr-id:1",
            Agency: "original-agency",
            Version: "1",
            VariablesInRecord: { VariableUsedReference: [] },
          },
        },
      ],
      Variable: [],
    };

    const result = buildDuplicatedPhysicalInstance({
      agencyId: "test-agency",
      data,
      title: "Original Title",
      defaultLocale: "fr-FR",
    });

    expect(result.duplicatedData.PhysicalInstance[0].Citation.Title.String["#text"]).toBe(
      "Original Title (copy)",
    );
    expect(result.duplicatedData.PhysicalInstance[0].PhysicalInstanceLabel.Content["#text"]).toBe(
      "Original Title (copy)",
    );
  });

  it("should add (copy) suffix to DataRelationship Label", () => {
    const data = {
      PhysicalInstance: [
        {
          ID: "original-pi-id",
          Agency: "original-agency",
          Version: "1",
          Citation: { Title: { String: { "#text": "Test" } } },
        },
      ],
      DataRelationship: [
        {
          ID: "original-dr-id",
          Agency: "original-agency",
          Version: "1",
          Label: {
            Content: { "@xml:lang": "fr-FR", "#text": "Original DR Name" },
          },
          LogicalRecord: {
            ID: "original-lr-id",
            URN: "urn:ddi:original-agency:original-lr-id:1",
            Agency: "original-agency",
            Version: "1",
            VariablesInRecord: { VariableUsedReference: [] },
          },
        },
      ],
      Variable: [],
    };

    const result = buildDuplicatedPhysicalInstance({
      agencyId: "test-agency",
      data,
      title: "Test",
      defaultLocale: "fr-FR",
    });

    expect(result.duplicatedData.DataRelationship[0].Label.Content["#text"]).toBe(
      "Structure : Test (copy)",
    );
  });

  it("should add BasedOnObject to PhysicalInstance", () => {
    const data = {
      PhysicalInstance: [
        {
          ID: "original-pi-id",
          Agency: "original-agency",
          Version: "1",
          Citation: { Title: { String: { "#text": "Test" } } },
        },
      ],
      DataRelationship: [
        {
          ID: "original-dr-id",
          Agency: "original-agency",
          Version: "1",
          Label: { Content: { "@xml:lang": "fr-FR", "#text": "DR Name" } },
          LogicalRecord: {
            ID: "original-lr-id",
            URN: "urn:ddi:original-agency:original-lr-id:1",
            Agency: "original-agency",
            Version: "1",
            VariablesInRecord: { VariableUsedReference: [] },
          },
        },
      ],
      Variable: [],
    };

    const result = buildDuplicatedPhysicalInstance({
      agencyId: "test-agency",
      data,
      title: "Test",
      defaultLocale: "fr-FR",
    });

    expect(result.duplicatedData.PhysicalInstance[0].BasedOnObject).toEqual({
      BasedOnReference: {
        Agency: "original-agency",
        ID: "original-pi-id",
        Version: "1",
        TypeOfObject: "PhysicalInstance",
      },
    });
  });

  it("should add BasedOnObject to DataRelationship", () => {
    const data = {
      PhysicalInstance: [
        {
          ID: "original-pi-id",
          Agency: "original-agency",
          Version: "1",
          Citation: { Title: { String: { "#text": "Test" } } },
        },
      ],
      DataRelationship: [
        {
          ID: "original-dr-id",
          Agency: "original-agency",
          Version: "1",
          Label: { Content: { "@xml:lang": "fr-FR", "#text": "DR Name" } },
          LogicalRecord: {
            ID: "original-lr-id",
            URN: "urn:ddi:original-agency:original-lr-id:1",
            Agency: "original-agency",
            Version: "1",
            VariablesInRecord: { VariableUsedReference: [] },
          },
        },
      ],
      Variable: [],
    };

    const result = buildDuplicatedPhysicalInstance({
      agencyId: "test-agency",
      data,
      title: "Test",
      defaultLocale: "fr-FR",
    });

    expect(result.duplicatedData.DataRelationship[0].BasedOnObject).toEqual({
      BasedOnReference: {
        Agency: "original-agency",
        ID: "original-dr-id",
        Version: "1",
        TypeOfObject: "DataRelationship",
      },
    });
  });

  it("should generate new IDs for Variables and add BasedOnObject", () => {
    uuidIndex = 0;
    const data = {
      PhysicalInstance: [
        {
          ID: "original-pi-id",
          Agency: "original-agency",
          Version: "1",
          Citation: { Title: { String: { "#text": "Test" } } },
        },
      ],
      DataRelationship: [
        {
          ID: "original-dr-id",
          Agency: "original-agency",
          Version: "1",
          Label: { Content: { "@xml:lang": "fr-FR", "#text": "DR Name" } },
          LogicalRecord: {
            ID: "original-lr-id",
            URN: "urn:ddi:original-agency:original-lr-id:1",
            Agency: "original-agency",
            Version: "1",
            VariablesInRecord: { VariableUsedReference: [] },
          },
        },
      ],
      Variable: [
        {
          ID: "original-var-id-1",
          Agency: "original-agency",
          Version: "1",
          VariableName: { String: { "#text": "Var1" } },
        },
        {
          ID: "original-var-id-2",
          Agency: "original-agency",
          Version: "2",
          VariableName: { String: { "#text": "Var2" } },
        },
      ],
    };

    const result = buildDuplicatedPhysicalInstance({
      agencyId: "test-agency",
      data,
      title: "Test",
      defaultLocale: "fr-FR",
    });

    // Variables should have new IDs
    expect(result.duplicatedData.Variable[0].ID).not.toBe("original-var-id-1");
    expect(result.duplicatedData.Variable[1].ID).not.toBe("original-var-id-2");

    // Variables should have BasedOnObject
    expect(result.duplicatedData.Variable[0].BasedOnObject).toEqual({
      BasedOnReference: {
        Agency: "original-agency",
        ID: "original-var-id-1",
        Version: "1",
        TypeOfObject: "Variable",
      },
    });

    expect(result.duplicatedData.Variable[1].BasedOnObject).toEqual({
      BasedOnReference: {
        Agency: "original-agency",
        ID: "original-var-id-2",
        Version: "2",
        TypeOfObject: "Variable",
      },
    });
  });

  it("should update URN for all objects", () => {
    const data = {
      PhysicalInstance: [
        {
          ID: "original-pi-id",
          Agency: "original-agency",
          Version: "1",
          URN: "urn:ddi:original-agency:original-pi-id:1",
          Citation: { Title: { String: { "#text": "Test" } } },
        },
      ],
      DataRelationship: [
        {
          ID: "original-dr-id",
          Agency: "original-agency",
          Version: "1",
          URN: "urn:ddi:original-agency:original-dr-id:1",
          Label: { Content: { "@xml:lang": "fr-FR", "#text": "DR Name" } },
          LogicalRecord: {
            ID: "original-lr-id",
            URN: "urn:ddi:original-agency:original-lr-id:1",
            Agency: "original-agency",
            Version: "1",
            VariablesInRecord: { VariableUsedReference: [] },
          },
        },
      ],
      Variable: [],
    };

    const result = buildDuplicatedPhysicalInstance({
      agencyId: "test-agency",
      data,
      title: "Test",
      defaultLocale: "fr-FR",
    });

    expect(result.duplicatedData.PhysicalInstance[0].URN).toBe(
      `urn:ddi:test-agency:${result.newPhysicalInstanceId}:1`,
    );
    expect(result.duplicatedData.DataRelationship[0].URN).toContain("urn:ddi:test-agency:");
    expect(result.duplicatedData.DataRelationship[0].LogicalRecord.URN).toContain(
      "urn:ddi:test-agency:",
    );
  });

  it("should update Agency for all objects", () => {
    const data = {
      PhysicalInstance: [
        {
          ID: "original-pi-id",
          Agency: "original-agency",
          Version: "1",
          Citation: { Title: { String: { "#text": "Test" } } },
        },
      ],
      DataRelationship: [
        {
          ID: "original-dr-id",
          Agency: "original-agency",
          Version: "1",
          Label: { Content: { "@xml:lang": "fr-FR", "#text": "DR Name" } },
          LogicalRecord: {
            ID: "original-lr-id",
            URN: "urn:ddi:original-agency:original-lr-id:1",
            Agency: "original-agency",
            Version: "1",
            VariablesInRecord: { VariableUsedReference: [] },
          },
        },
      ],
      Variable: [],
    };

    const result = buildDuplicatedPhysicalInstance({
      agencyId: "test-agency",
      data,
      title: "Test",
      defaultLocale: "fr-FR",
    });

    expect(result.duplicatedData.PhysicalInstance[0].Agency).toBe("test-agency");
    expect(result.duplicatedData.DataRelationship[0].Agency).toBe("test-agency");
    expect(result.duplicatedData.DataRelationship[0].LogicalRecord.Agency).toBe("test-agency");
  });

  it("should update DataRelationshipReference in PhysicalInstance", () => {
    const data = {
      PhysicalInstance: [
        {
          ID: "original-pi-id",
          Agency: "original-agency",
          Version: "1",
          Citation: { Title: { String: { "#text": "Test" } } },
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
          Label: { Content: { "@xml:lang": "fr-FR", "#text": "DR Name" } },
          LogicalRecord: {
            ID: "original-lr-id",
            URN: "urn:ddi:original-agency:original-lr-id:1",
            Agency: "original-agency",
            Version: "1",
            VariablesInRecord: { VariableUsedReference: [] },
          },
        },
      ],
      Variable: [],
    };

    const result = buildDuplicatedPhysicalInstance({
      agencyId: "test-agency",
      data,
      title: "Test",
      defaultLocale: "fr-FR",
    });

    expect(result.duplicatedData.PhysicalInstance[0].DataRelationshipReference.ID).toBe(
      "new-data-relationship-id",
    );
    expect(result.duplicatedData.PhysicalInstance[0].DataRelationshipReference.Agency).toBe(
      "test-agency",
    );
  });

  it("should update VariablesInRecord with new variable IDs", () => {
    uuidIndex = 0;
    const data = {
      PhysicalInstance: [
        {
          ID: "original-pi-id",
          Agency: "original-agency",
          Version: "1",
          Citation: { Title: { String: { "#text": "Test" } } },
        },
      ],
      DataRelationship: [
        {
          ID: "original-dr-id",
          Agency: "original-agency",
          Version: "1",
          Label: { Content: { "@xml:lang": "fr-FR", "#text": "DR Name" } },
          LogicalRecord: {
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
        },
      ],
      Variable: [
        {
          ID: "original-var-id-1",
          Agency: "original-agency",
          Version: "1",
          VariableName: { String: { "#text": "Var1" } },
        },
      ],
    };

    const result = buildDuplicatedPhysicalInstance({
      agencyId: "test-agency",
      data,
      title: "Test",
      defaultLocale: "fr-FR",
    });

    const variableRefs =
      result.duplicatedData.DataRelationship[0].LogicalRecord.VariablesInRecord
        .VariableUsedReference;

    expect(variableRefs).toHaveLength(1);
    expect(variableRefs[0].Agency).toBe("test-agency");
    expect(variableRefs[0].ID).not.toBe("original-var-id-1");
  });

  it("should preserve CodeList and Category without regenerating IDs", () => {
    const data = {
      PhysicalInstance: [
        {
          ID: "original-pi-id",
          Agency: "original-agency",
          Version: "1",
          Citation: { Title: { String: { "#text": "Test" } } },
        },
      ],
      DataRelationship: [
        {
          ID: "original-dr-id",
          Agency: "original-agency",
          Version: "1",
          Label: { Content: { "@xml:lang": "fr-FR", "#text": "DR Name" } },
          LogicalRecord: {
            ID: "original-lr-id",
            URN: "urn:ddi:original-agency:original-lr-id:1",
            Agency: "original-agency",
            Version: "1",
            VariablesInRecord: { VariableUsedReference: [] },
          },
        },
      ],
      Variable: [],
      CodeList: [
        {
          ID: "codelist-id",
          Agency: "original-agency",
          CodeListName: { String: { "#text": "My CodeList" } },
        },
      ],
      Category: [
        {
          ID: "category-id",
          Agency: "original-agency",
          CategoryName: { String: { "#text": "Category 1" } },
        },
      ],
    };

    const result = buildDuplicatedPhysicalInstance({
      agencyId: "test-agency",
      data,
      title: "Test",
      defaultLocale: "fr-FR",
    });

    // CodeList and Category should be preserved as-is
    expect(result.duplicatedData.CodeList).toEqual(data.CodeList);
    expect(result.duplicatedData.Category).toEqual(data.Category);
  });

  it("should set @versionDate to current date for all modified objects", () => {
    const data = {
      PhysicalInstance: [
        {
          ID: "original-pi-id",
          Agency: "original-agency",
          Version: "1",
          "@versionDate": "2020-01-01T00:00:00.000Z",
          Citation: { Title: { String: { "#text": "Test" } } },
        },
      ],
      DataRelationship: [
        {
          ID: "original-dr-id",
          Agency: "original-agency",
          Version: "1",
          "@versionDate": "2020-01-01T00:00:00.000Z",
          Label: { Content: { "@xml:lang": "fr-FR", "#text": "DR Name" } },
          LogicalRecord: {
            ID: "original-lr-id",
            URN: "urn:ddi:original-agency:original-lr-id:1",
            Agency: "original-agency",
            Version: "1",
            "@versionDate": "2020-01-01T00:00:00.000Z",
            VariablesInRecord: { VariableUsedReference: [] },
          },
        },
      ],
      Variable: [],
    };

    const beforeTest = new Date().toISOString().substring(0, 10);
    const result = buildDuplicatedPhysicalInstance({
      agencyId: "test-agency",
      data,
      title: "Test",
      defaultLocale: "fr-FR",
    });

    // Check that @versionDate is updated to today
    expect(result.duplicatedData.PhysicalInstance[0]["@versionDate"].substring(0, 10)).toBe(
      beforeTest,
    );
    expect(result.duplicatedData.DataRelationship[0]["@versionDate"].substring(0, 10)).toBe(
      beforeTest,
    );
  });

  it("should handle empty Variable array", () => {
    const data = {
      PhysicalInstance: [
        {
          ID: "original-pi-id",
          Agency: "original-agency",
          Version: "1",
          Citation: { Title: { String: { "#text": "Test" } } },
        },
      ],
      DataRelationship: [
        {
          ID: "original-dr-id",
          Agency: "original-agency",
          Version: "1",
          Label: { Content: { "@xml:lang": "fr-FR", "#text": "DR Name" } },
          LogicalRecord: {
            ID: "original-lr-id",
            URN: "urn:ddi:original-agency:original-lr-id:1",
            Agency: "original-agency",
            Version: "1",
            VariablesInRecord: { VariableUsedReference: [] },
          },
        },
      ],
      Variable: [],
    };

    const result = buildDuplicatedPhysicalInstance({
      agencyId: "test-agency",
      data,
      title: "Test",
      defaultLocale: "fr-FR",
    });

    expect(result.duplicatedData.Variable).toEqual([]);
  });

  it("should handle undefined Variable", () => {
    const data = {
      PhysicalInstance: [
        {
          ID: "original-pi-id",
          Agency: "original-agency",
          Version: "1",
          Citation: { Title: { String: { "#text": "Test" } } },
        },
      ],
      DataRelationship: [
        {
          ID: "original-dr-id",
          Agency: "original-agency",
          Version: "1",
          Label: { Content: { "@xml:lang": "fr-FR", "#text": "DR Name" } },
          LogicalRecord: {
            ID: "original-lr-id",
            URN: "urn:ddi:original-agency:original-lr-id:1",
            Agency: "original-agency",
            Version: "1",
            VariablesInRecord: { VariableUsedReference: [] },
          },
        },
      ],
    };

    const result = buildDuplicatedPhysicalInstance({
      agencyId: "test-agency",
      data,
      title: "Test",
      defaultLocale: "fr-FR",
    });

    expect(result.duplicatedData.Variable).toBeUndefined();
  });
});

describe("buildDuplicatedLogicalRecord", () => {
  it("should preserve xml:lang from original", () => {
    const original = {
      ID: "old-id",
      URN: "urn:ddi:old:old-id:1",
      Agency: "old-agency",
      Version: "1",
      Label: {
        Content: {
          "@xml:lang": "en-US",
          "#text": "Original Label",
        },
      },
      VariablesInRecord: { VariableUsedReference: [] },
    };

    const result = buildDuplicatedLogicalRecord({
      originalLogicalRecord: original,
      newLogicalRecordId: "new-id",
      newAgencyId: "new-agency",
      title: "Test",
      variableIdMap: new Map(),
      defaultLocale: "fr-FR",
    });

    expect(result.Label?.Content?.["@xml:lang"]).toBe("en-US");
  });

  it("should fallback to defaultLocale when no lang specified", () => {
    const original = {
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
      title: "Test",
      variableIdMap: new Map(),
      defaultLocale: "fr-FR",
    });

    expect(result.Label?.Content?.["@xml:lang"]).toBe("fr-FR");
  });

  it("should generate correct label using buildLogicalRecordLabel", () => {
    const original = {
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
      title: "MyTitle",
      variableIdMap: new Map(),
      defaultLocale: "fr-FR",
    });

    expect(result.Label?.Content?.["#text"]).toBe("Enregistrement logique : MyTitle (copy)");
  });

  it("should throw error when originalLogicalRecord is missing", () => {
    expect(() => {
      buildDuplicatedLogicalRecord({
        originalLogicalRecord: null as any,
        newLogicalRecordId: "id",
        newAgencyId: "agency",
        title: "Test",
        variableIdMap: new Map(),
        defaultLocale: "fr-FR",
      });
    }).toThrow("originalLogicalRecord is required");
  });

  it("should throw error when newLogicalRecordId is empty", () => {
    const original = {
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
        title: "Test",
        variableIdMap: new Map(),
        defaultLocale: "fr-FR",
      });
    }).toThrow("newLogicalRecordId and newAgencyId are required");
  });
});

describe("buildDuplicatedDataRelationship", () => {
  it("should create proper BasedOnObject", () => {
    const original = {
      ID: "old-dr-id",
      URN: "urn:ddi:old:old-dr-id:1",
      Agency: "old-agency",
      Version: "2",
      LogicalRecord: {
        ID: "old-lr-id",
        URN: "urn:ddi:old:old-lr-id:1",
        Agency: "old-agency",
        Version: "1",
        VariablesInRecord: { VariableUsedReference: [] },
      },
    };

    const result = buildDuplicatedDataRelationship({
      originalDataRelationship: original,
      newDataRelationshipId: "new-dr-id",
      newAgencyId: "new-agency",
      title: "Test",
      newLogicalRecordId: "new-lr-id",
      variableIdMap: new Map(),
      defaultLocale: "fr-FR",
    });

    expect(result.BasedOnObject).toEqual({
      BasedOnReference: {
        Agency: "old-agency",
        ID: "old-dr-id",
        Version: "2",
        TypeOfObject: "DataRelationship",
      },
    });
  });

  it("should preserve xml:lang from original DataRelationship", () => {
    const original = {
      ID: "old-dr-id",
      URN: "urn:ddi:old:old-dr-id:1",
      Agency: "old-agency",
      Version: "1",
      Label: {
        Content: {
          "@xml:lang": "en-GB",
          "#text": "Original Label",
        },
      },
      LogicalRecord: {
        ID: "old-lr-id",
        URN: "urn:ddi:old:old-lr-id:1",
        Agency: "old-agency",
        Version: "1",
        VariablesInRecord: { VariableUsedReference: [] },
      },
    };

    const result = buildDuplicatedDataRelationship({
      originalDataRelationship: original,
      newDataRelationshipId: "new-dr-id",
      newAgencyId: "new-agency",
      title: "Test",
      newLogicalRecordId: "new-lr-id",
      variableIdMap: new Map(),
      defaultLocale: "fr-FR",
    });

    expect(result.Label?.Content?.["@xml:lang"]).toBe("en-GB");
  });

  it("should throw error when originalDataRelationship is missing", () => {
    expect(() => {
      buildDuplicatedDataRelationship({
        originalDataRelationship: null as any,
        newDataRelationshipId: "new-dr-id",
        newAgencyId: "new-agency",
        title: "Test",
        newLogicalRecordId: "new-lr-id",
        variableIdMap: new Map(),
        defaultLocale: "fr-FR",
      });
    }).toThrow("originalDataRelationship is required");
  });

  it("should throw error when required IDs are empty", () => {
    const original = {
      ID: "old-dr-id",
      URN: "urn:ddi:old:old-dr-id:1",
      Agency: "old-agency",
      Version: "1",
      LogicalRecord: {
        ID: "old-lr-id",
        URN: "urn:ddi:old:old-lr-id:1",
        Agency: "old-agency",
        Version: "1",
        VariablesInRecord: { VariableUsedReference: [] },
      },
    };

    expect(() => {
      buildDuplicatedDataRelationship({
        originalDataRelationship: original,
        newDataRelationshipId: "",
        newAgencyId: "new-agency",
        title: "Test",
        newLogicalRecordId: "new-lr-id",
        variableIdMap: new Map(),
        defaultLocale: "fr-FR",
      });
    }).toThrow("newDataRelationshipId, newAgencyId, and newLogicalRecordId are required");
  });
});
