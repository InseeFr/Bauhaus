import { describe, it, expect, vi, beforeEach } from "vitest";
import { buildDuplicatedPhysicalInstance } from "./duplicatePhysicalInstance";

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
          DataRelationshipName: { String: { "#text": "Original DR Name" } },
          LogicalRecord: {
            ID: "original-lr-id",
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
          DataRelationshipName: { String: { "#text": "Original DR Name" } },
          LogicalRecord: {
            ID: "original-lr-id",
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
    });

    expect(result.duplicatedData.PhysicalInstance[0].Citation.Title.String["#text"]).toBe(
      "Original Title (copy)",
    );
    expect(result.duplicatedData.PhysicalInstance[0].PhysicalInstanceLabel.Content["#text"]).toBe(
      "Original Title (copy)",
    );
  });

  it("should add (copy) suffix to DataRelationshipName", () => {
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
          DataRelationshipName: { String: { "#text": "Original DR Name" } },
          LogicalRecord: {
            ID: "original-lr-id",
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
    });

    expect(result.duplicatedData.DataRelationship[0].DataRelationshipName.String["#text"]).toBe(
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
          DataRelationshipName: { String: { "#text": "DR Name" } },
          LogicalRecord: {
            ID: "original-lr-id",
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
          DataRelationshipName: { String: { "#text": "DR Name" } },
          LogicalRecord: {
            ID: "original-lr-id",
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
          DataRelationshipName: { String: { "#text": "DR Name" } },
          LogicalRecord: {
            ID: "original-lr-id",
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
          DataRelationshipName: { String: { "#text": "DR Name" } },
          LogicalRecord: {
            ID: "original-lr-id",
            URN: "urn:ddi:original-agency:original-lr-id:1",
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
          DataRelationshipName: { String: { "#text": "DR Name" } },
          LogicalRecord: {
            ID: "original-lr-id",
            Agency: "original-agency",
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
          DataRelationshipName: { String: { "#text": "DR Name" } },
          LogicalRecord: {
            ID: "original-lr-id",
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
          DataRelationshipName: { String: { "#text": "DR Name" } },
          LogicalRecord: {
            ID: "original-lr-id",
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
          DataRelationshipName: { String: { "#text": "DR Name" } },
          LogicalRecord: {
            ID: "original-lr-id",
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
          DataRelationshipName: { String: { "#text": "DR Name" } },
          LogicalRecord: {
            ID: "original-lr-id",
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
          DataRelationshipName: { String: { "#text": "DR Name" } },
          LogicalRecord: {
            ID: "original-lr-id",
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
          DataRelationshipName: { String: { "#text": "DR Name" } },
          LogicalRecord: {
            ID: "original-lr-id",
            VariablesInRecord: { VariableUsedReference: [] },
          },
        },
      ],
    };

    const result = buildDuplicatedPhysicalInstance({
      agencyId: "test-agency",
      data,
      title: "Test",
    });

    expect(result.duplicatedData.Variable).toBeUndefined();
  });
});
