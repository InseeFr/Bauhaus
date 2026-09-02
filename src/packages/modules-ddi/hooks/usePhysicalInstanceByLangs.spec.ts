import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { usePhysicalInstanceByLangs } from "./usePhysicalInstanceByLangs";
import type { PhysicalInstanceResponse } from "../physical-instances/types/api";
import { replaceItemsOfType, singleItemOfType } from "../physical-instances/types/ddi4Items";
import { envelope } from "../physical-instances/types/ddi4Items.testing";

const baseRef = [
  {
    $type: "Variable" as const,
    URN: "urn:ddi:fr.insee:ref-1:1",
    Agency: "fr.insee",
    ID: "ref-1",
    Version: "1",
  },
];

const singleLangData: PhysicalInstanceResponse = envelope({
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
      LogicalRecord: [
        {
          $type: "LogicalRecordType",
          URN: "urn:lr:1",
          Agency: "fr.insee",
          ID: "lr-1",
          Version: "1",
          Label: [{ "@language": "fr-FR", "@value": "Label LR FR" }],
          VariablesInRecord: { VariableUsedReference: [] },
        },
      ],
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
});

const multiLangData: PhysicalInstanceResponse = envelope({
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
      LogicalRecord: [
        {
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
      ],
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
});

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

      expect(singleItemOfType(frData, "PhysicalInstance")!.Citation!.Title).toEqual([
        { "@language": "fr-FR", "@value": "Titre FR" },
      ]);
      expect(singleItemOfType(enData, "PhysicalInstance")!.Citation!.Title).toEqual([
        { "@language": "en-GB", "@value": "Title EN" },
      ]);
    });
  });

  describe("DataRelationship", () => {
    it("should filter Label.Content to the correct language", () => {
      const { result } = renderHook(() => usePhysicalInstanceByLangs(multiLangData));

      const frData = result.current.get("fr-FR")!;
      const enData = result.current.get("en-GB")!;

      expect(singleItemOfType(frData, "DataRelationship")!.Label).toEqual([
        { "@language": "fr-FR", "@value": "Label DR FR" },
      ]);
      expect(singleItemOfType(enData, "DataRelationship")!.Label).toEqual([
        { "@language": "en-GB", "@value": "Label DR EN" },
      ]);
    });

    it("should filter LogicalRecord.Label to the correct language", () => {
      const { result } = renderHook(() => usePhysicalInstanceByLangs(multiLangData));

      const frData = result.current.get("fr-FR")!;
      const enData = result.current.get("en-GB")!;

      expect(singleItemOfType(frData, "DataRelationship")!.LogicalRecord![0].Label).toEqual([
        { "@language": "fr-FR", "@value": "Label LR FR" },
      ]);
      expect(singleItemOfType(enData, "DataRelationship")!.LogicalRecord![0].Label).toEqual([
        { "@language": "en-GB", "@value": "Label LR EN" },
      ]);
    });
  });

  describe("Variable", () => {
    it("should filter VariableName.String to the correct language", () => {
      const { result } = renderHook(() => usePhysicalInstanceByLangs(multiLangData));

      const frData = result.current.get("fr-FR")!;
      const enData = result.current.get("en-GB")!;

      expect(singleItemOfType(frData, "Variable")!.VariableName).toEqual([
        { "@language": "fr-FR", "@value": "NomVar FR" },
      ]);
      expect(singleItemOfType(enData, "Variable")!.VariableName).toEqual([
        { "@language": "en-GB", "@value": "VarName EN" },
      ]);
    });

    it("should filter Label.Content to the correct language", () => {
      const { result } = renderHook(() => usePhysicalInstanceByLangs(multiLangData));

      const frData = result.current.get("fr-FR")!;
      const enData = result.current.get("en-GB")!;

      expect(singleItemOfType(frData, "Variable")!.Label).toEqual([
        { "@language": "fr-FR", "@value": "Label Var FR" },
      ]);
      expect(singleItemOfType(enData, "Variable")!.Label).toEqual([
        { "@language": "en-GB", "@value": "Label Var EN" },
      ]);
    });

    it("should filter Description.Content to the correct language", () => {
      const { result } = renderHook(() => usePhysicalInstanceByLangs(multiLangData));

      const frData = result.current.get("fr-FR")!;
      const enData = result.current.get("en-GB")!;

      expect(singleItemOfType(frData, "Variable")!.Description).toEqual([
        { "@language": "fr-FR", "@value": "Desc FR" },
      ]);
      expect(singleItemOfType(enData, "Variable")!.Description).toEqual([
        { "@language": "en-GB", "@value": "Desc EN" },
      ]);
    });

    it("should not include Description when it is absent from the original", () => {
      const dataWithoutDesc = replaceItemsOfType(singleLangData, "Variable", [
        { ...singleItemOfType(singleLangData, "Variable")!, Description: undefined },
      ]);

      const { result } = renderHook(() => usePhysicalInstanceByLangs(dataWithoutDesc));

      expect(
        singleItemOfType(result.current.get("fr-FR")!, "Variable")!.Description,
      ).toBeUndefined();
    });
  });

  describe("CodeList", () => {
    it("should filter Label.Content to the correct language", () => {
      const { result } = renderHook(() => usePhysicalInstanceByLangs(multiLangData));

      const frData = result.current.get("fr-FR")!;
      const enData = result.current.get("en-GB")!;

      expect(singleItemOfType(frData, "CodeList")!.Label).toEqual([
        { "@language": "fr-FR", "@value": "Label CL FR" },
      ]);
      expect(singleItemOfType(enData, "CodeList")!.Label).toEqual([
        { "@language": "en-GB", "@value": "Label CL EN" },
      ]);
    });

    it("should not include Label when it is absent from the original", () => {
      const dataWithoutLabel = replaceItemsOfType(singleLangData, "CodeList", [
        { ...singleItemOfType(singleLangData, "CodeList")!, Label: undefined },
      ]);

      const { result } = renderHook(() => usePhysicalInstanceByLangs(dataWithoutLabel));

      expect(singleItemOfType(result.current.get("fr-FR")!, "CodeList")!.Label).toBeUndefined();
    });
  });

  describe("Category", () => {
    it("should filter Label.Content to the correct language", () => {
      const { result } = renderHook(() => usePhysicalInstanceByLangs(multiLangData));

      const frData = result.current.get("fr-FR")!;
      const enData = result.current.get("en-GB")!;

      expect(singleItemOfType(frData, "Category")!.Label).toEqual([
        { "@language": "fr-FR", "@value": "Label Cat FR" },
      ]);
      expect(singleItemOfType(enData, "Category")!.Label).toEqual([
        { "@language": "en-GB", "@value": "Label Cat EN" },
      ]);
    });
  });

  describe("fallback behaviour", () => {
    it("should match by primary subtag when exact lang is missing (fr matches fr-FR)", () => {
      const mixedData: PhysicalInstanceResponse = replaceItemsOfType(singleLangData, "Variable", [
        {
          ...singleItemOfType(singleLangData, "Variable")!,
          // Field stored as "fr" instead of "fr-FR"
          Description: [{ "@language": "fr", "@value": "Desc FR subtag" }],
        },
      ]);

      const { result } = renderHook(() => usePhysicalInstanceByLangs(mixedData));

      const frData = result.current.get("fr-FR")!;
      expect(singleItemOfType(frData, "Variable")!.Description).toEqual([
        { "@language": "fr", "@value": "Desc FR subtag" },
      ]);
    });

    it("should use empty string when no entry matches the requested language", () => {
      const mixedData: PhysicalInstanceResponse = replaceItemsOfType(multiLangData, "Variable", [
        {
          ...singleItemOfType(multiLangData, "Variable")!,
          // Description only in en-GB
          Description: [{ "@language": "en-GB", "@value": "Desc EN only" }],
        },
      ]);

      const { result } = renderHook(() => usePhysicalInstanceByLangs(mixedData));

      const frData = result.current.get("fr-FR")!;
      expect(singleItemOfType(frData, "Variable")!.Description).toEqual([
        { "@language": "fr-FR", "@value": "" },
      ]);
    });
  });

  describe("non-localized fields", () => {
    it("should preserve non-localized fields unchanged", () => {
      const { result } = renderHook(() => usePhysicalInstanceByLangs(singleLangData));

      const frData = result.current.get("fr-FR")!;
      expect(singleItemOfType(frData, "Variable")!.ID).toBe("v-1");
      expect(singleItemOfType(frData, "Variable")!.Agency).toBe("fr.insee");
      expect(singleItemOfType(frData, "Variable")!.Version).toBe("1");
      expect(singleItemOfType(frData, "Variable")!.URN).toBe("urn:v:1");
    });

    it("should preserve VariablesInRecord unchanged", () => {
      const { result } = renderHook(() => usePhysicalInstanceByLangs(singleLangData));

      const frData = result.current.get("fr-FR")!;
      expect(
        singleItemOfType(frData, "DataRelationship")!.LogicalRecord![0].VariablesInRecord,
      ).toEqual({
        VariableUsedReference: [],
      });
    });
  });
});
