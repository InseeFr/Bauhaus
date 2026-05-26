import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { usePhysicalInstanceByLangs } from "./usePhysicalInstanceByLangs";
import type { PhysicalInstanceResponse } from "../physical-instances/types/api";

const baseRef = [
  {
    $type: "Variable" as const,
    URN: "urn:ddi:fr.insee:ref-1:1",
    Agency: "fr.insee",
    ID: "ref-1",
    Version: "1",
  },
];

const singleLangData: PhysicalInstanceResponse = {
  PhysicalInstance: [
    {
      $type: "PhysicalInstance",
      URN: "urn:pi:1",
      Agency: "fr.insee",
      ID: "pi-1",
      Version: "1",
      Citation: {
        Title: [{ "@language": "fr-FR", "@value": "Titre FR" }],
      },
      DataRelationshipReference: baseRef,
    },
  ],
  DataRelationship: [
    {
      $type: "DataRelationship",
      URN: "urn:dr:1",
      Agency: "fr.insee",
      ID: "dr-1",
      Version: "1",
      Label: [{ "@language": "fr-FR", "@value": "Label DR FR" }],
      LogicalRecord: {
        $type: "LogicalRecordType",
        URN: "urn:lr:1",
        Agency: "fr.insee",
        ID: "lr-1",
        Version: "1",
        Label: [{ "@language": "fr-FR", "@value": "Label LR FR" }],
        VariablesInRecord: { VariableUsedReference: [] },
      },
    },
  ],
  Variable: [
    {
      $type: "Variable",
      URN: "urn:v:1",
      Agency: "fr.insee",
      ID: "v-1",
      Version: "1",
      VariableName: [{ "@language": "fr-FR", "@value": "NomVar FR" }],
      Label: [{ "@language": "fr-FR", "@value": "Label Var FR" }],
      Description: [{ "@language": "fr-FR", "@value": "Desc FR" }],
    },
  ],
  CodeList: [
    {
      $type: "CodeList",
      URN: "urn:cl:1",
      Agency: "fr.insee",
      ID: "cl-1",
      Version: "1",
      Label: [{ "@language": "fr-FR", "@value": "Label CL FR" }],
    },
  ],
  Category: [
    {
      $type: "Category",
      URN: "urn:cat:1",
      Agency: "fr.insee",
      ID: "cat-1",
      Version: "1",
      Label: [{ "@language": "fr-FR", "@value": "Label Cat FR" }],
    },
  ],
};

const multiLangData: PhysicalInstanceResponse = {
  PhysicalInstance: [
    {
      $type: "PhysicalInstance",
      URN: "urn:pi:1",
      Agency: "fr.insee",
      ID: "pi-1",
      Version: "1",
      Citation: {
        Title: [
          { "@language": "fr-FR", "@value": "Titre FR" },
          { "@language": "en-GB", "@value": "Title EN" },
        ],
      },
      DataRelationshipReference: baseRef,
    },
  ],
  DataRelationship: [
    {
      $type: "DataRelationship",
      URN: "urn:dr:1",
      Agency: "fr.insee",
      ID: "dr-1",
      Version: "1",
      Label: [
        { "@language": "fr-FR", "@value": "Label DR FR" },
        { "@language": "en-GB", "@value": "Label DR EN" },
      ],
      LogicalRecord: {
        $type: "LogicalRecordType",
        URN: "urn:lr:1",
        Agency: "fr.insee",
        ID: "lr-1",
        Version: "1",
        Label: [
          { "@language": "fr-FR", "@value": "Label LR FR" },
          { "@language": "en-GB", "@value": "Label LR EN" },
        ],
        VariablesInRecord: { VariableUsedReference: [] },
      },
    },
  ],
  Variable: [
    {
      $type: "Variable",
      URN: "urn:v:1",
      Agency: "fr.insee",
      ID: "v-1",
      Version: "1",
      VariableName: [
        { "@language": "fr-FR", "@value": "NomVar FR" },
        { "@language": "en-GB", "@value": "VarName EN" },
      ],
      Label: [
        { "@language": "fr-FR", "@value": "Label Var FR" },
        { "@language": "en-GB", "@value": "Label Var EN" },
      ],
      Description: [
        { "@language": "fr-FR", "@value": "Desc FR" },
        { "@language": "en-GB", "@value": "Desc EN" },
      ],
    },
  ],
  CodeList: [
    {
      $type: "CodeList",
      URN: "urn:cl:1",
      Agency: "fr.insee",
      ID: "cl-1",
      Version: "1",
      Label: [
        { "@language": "fr-FR", "@value": "Label CL FR" },
        { "@language": "en-GB", "@value": "Label CL EN" },
      ],
    },
  ],
  Category: [
    {
      $type: "Category",
      URN: "urn:cat:1",
      Agency: "fr.insee",
      ID: "cat-1",
      Version: "1",
      Label: [
        { "@language": "fr-FR", "@value": "Label Cat FR" },
        { "@language": "en-GB", "@value": "Label Cat EN" },
      ],
    },
  ],
};

describe("usePhysicalInstanceByLangs", () => {
  it("should return an empty Map when data is undefined", () => {
    const { result } = renderHook(() => usePhysicalInstanceByLangs(undefined));
    expect(result.current.size).toBe(0);
  });

  it("should return a Map with one entry for single-language data", () => {
    const { result } = renderHook(() => usePhysicalInstanceByLangs(singleLangData));
    expect(result.current.size).toBe(1);
    expect(result.current.has("fr-FR")).toBe(true);
  });

  it("should return a Map with two entries for multi-language data", () => {
    const { result } = renderHook(() => usePhysicalInstanceByLangs(multiLangData));
    expect(result.current.size).toBe(2);
    expect(result.current.has("fr-FR")).toBe(true);
    expect(result.current.has("en-GB")).toBe(true);
  });

  describe("PhysicalInstance", () => {
    it("should filter Citation.Title to the correct language", () => {
      const { result } = renderHook(() => usePhysicalInstanceByLangs(multiLangData));

      const frData = result.current.get("fr-FR")!;
      const enData = result.current.get("en-GB")!;

      expect(frData.PhysicalInstance![0].Citation.Title).toEqual([
        { "@language": "fr-FR", "@value": "Titre FR" },
      ]);
      expect(enData.PhysicalInstance![0].Citation.Title).toEqual([
        { "@language": "en-GB", "@value": "Title EN" },
      ]);
    });
  });

  describe("DataRelationship", () => {
    it("should filter Label.Content to the correct language", () => {
      const { result } = renderHook(() => usePhysicalInstanceByLangs(multiLangData));

      const frData = result.current.get("fr-FR")!;
      const enData = result.current.get("en-GB")!;

      expect(frData.DataRelationship![0].Label).toEqual([
        { "@language": "fr-FR", "@value": "Label DR FR" },
      ]);
      expect(enData.DataRelationship![0].Label).toEqual([
        { "@language": "en-GB", "@value": "Label DR EN" },
      ]);
    });

    it("should filter LogicalRecord.Label to the correct language", () => {
      const { result } = renderHook(() => usePhysicalInstanceByLangs(multiLangData));

      const frData = result.current.get("fr-FR")!;
      const enData = result.current.get("en-GB")!;

      expect(frData.DataRelationship![0].LogicalRecord.Label).toEqual([
        { "@language": "fr-FR", "@value": "Label LR FR" },
      ]);
      expect(enData.DataRelationship![0].LogicalRecord.Label).toEqual([
        { "@language": "en-GB", "@value": "Label LR EN" },
      ]);
    });
  });

  describe("Variable", () => {
    it("should filter VariableName.String to the correct language", () => {
      const { result } = renderHook(() => usePhysicalInstanceByLangs(multiLangData));

      const frData = result.current.get("fr-FR")!;
      const enData = result.current.get("en-GB")!;

      expect(frData.Variable![0].VariableName).toEqual([
        { "@language": "fr-FR", "@value": "NomVar FR" },
      ]);
      expect(enData.Variable![0].VariableName).toEqual([
        { "@language": "en-GB", "@value": "VarName EN" },
      ]);
    });

    it("should filter Label.Content to the correct language", () => {
      const { result } = renderHook(() => usePhysicalInstanceByLangs(multiLangData));

      const frData = result.current.get("fr-FR")!;
      const enData = result.current.get("en-GB")!;

      expect(frData.Variable![0].Label).toEqual([
        { "@language": "fr-FR", "@value": "Label Var FR" },
      ]);
      expect(enData.Variable![0].Label).toEqual([
        { "@language": "en-GB", "@value": "Label Var EN" },
      ]);
    });

    it("should filter Description.Content to the correct language", () => {
      const { result } = renderHook(() => usePhysicalInstanceByLangs(multiLangData));

      const frData = result.current.get("fr-FR")!;
      const enData = result.current.get("en-GB")!;

      expect(frData.Variable![0].Description).toEqual([
        { "@language": "fr-FR", "@value": "Desc FR" },
      ]);
      expect(enData.Variable![0].Description).toEqual([
        { "@language": "en-GB", "@value": "Desc EN" },
      ]);
    });

    it("should not include Description when it is absent from the original", () => {
      const dataWithoutDesc: PhysicalInstanceResponse = {
        ...singleLangData,
        Variable: [{ ...singleLangData.Variable![0], Description: undefined }],
      };

      const { result } = renderHook(() => usePhysicalInstanceByLangs(dataWithoutDesc));

      expect(result.current.get("fr-FR")!.Variable![0].Description).toBeUndefined();
    });
  });

  describe("CodeList", () => {
    it("should filter Label.Content to the correct language", () => {
      const { result } = renderHook(() => usePhysicalInstanceByLangs(multiLangData));

      const frData = result.current.get("fr-FR")!;
      const enData = result.current.get("en-GB")!;

      expect(frData.CodeList![0].Label).toEqual([
        { "@language": "fr-FR", "@value": "Label CL FR" },
      ]);
      expect(enData.CodeList![0].Label).toEqual([
        { "@language": "en-GB", "@value": "Label CL EN" },
      ]);
    });

    it("should not include Label when it is absent from the original", () => {
      const dataWithoutLabel: PhysicalInstanceResponse = {
        ...singleLangData,
        CodeList: [{ ...singleLangData.CodeList![0], Label: undefined }],
      };

      const { result } = renderHook(() => usePhysicalInstanceByLangs(dataWithoutLabel));

      expect(result.current.get("fr-FR")!.CodeList![0].Label).toBeUndefined();
    });
  });

  describe("Category", () => {
    it("should filter Label.Content to the correct language", () => {
      const { result } = renderHook(() => usePhysicalInstanceByLangs(multiLangData));

      const frData = result.current.get("fr-FR")!;
      const enData = result.current.get("en-GB")!;

      expect(frData.Category![0].Label).toEqual([
        { "@language": "fr-FR", "@value": "Label Cat FR" },
      ]);
      expect(enData.Category![0].Label).toEqual([
        { "@language": "en-GB", "@value": "Label Cat EN" },
      ]);
    });
  });

  describe("fallback behaviour", () => {
    it("should match by primary subtag when exact lang is missing (fr matches fr-FR)", () => {
      const mixedData: PhysicalInstanceResponse = {
        ...singleLangData,
        Variable: [
          {
            ...singleLangData.Variable![0],
            // Field stored as "fr" instead of "fr-FR"
            Description: [{ "@language": "fr", "@value": "Desc FR subtag" }],
          },
        ],
      };

      const { result } = renderHook(() => usePhysicalInstanceByLangs(mixedData));

      const frData = result.current.get("fr-FR")!;
      expect(frData.Variable![0].Description).toEqual([
        { "@language": "fr", "@value": "Desc FR subtag" },
      ]);
    });

    it("should use empty string when no entry matches the requested language", () => {
      const mixedData: PhysicalInstanceResponse = {
        ...multiLangData,
        Variable: [
          {
            ...multiLangData.Variable![0],
            // Description only in en-GB
            Description: [{ "@language": "en-GB", "@value": "Desc EN only" }],
          },
        ],
      };

      const { result } = renderHook(() => usePhysicalInstanceByLangs(mixedData));

      const frData = result.current.get("fr-FR")!;
      expect(frData.Variable![0].Description).toEqual([{ "@language": "fr-FR", "@value": "" }]);
    });
  });

  describe("non-localized fields", () => {
    it("should preserve non-localized fields unchanged", () => {
      const { result } = renderHook(() => usePhysicalInstanceByLangs(singleLangData));

      const frData = result.current.get("fr-FR")!;
      expect(frData.Variable![0].ID).toBe("v-1");
      expect(frData.Variable![0].Agency).toBe("fr.insee");
      expect(frData.Variable![0].Version).toBe("1");
      expect(frData.Variable![0].URN).toBe("urn:v:1");
    });

    it("should preserve VariablesInRecord unchanged", () => {
      const { result } = renderHook(() => usePhysicalInstanceByLangs(singleLangData));

      const frData = result.current.get("fr-FR")!;
      expect(frData.DataRelationship![0].LogicalRecord.VariablesInRecord).toEqual({
        VariableUsedReference: [],
      });
    });
  });
});
