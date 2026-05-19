import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { usePhysicalInstanceByLangs } from "./usePhysicalInstanceByLangs";
import type { PhysicalInstanceResponse } from "../physical-instances/types/api";

const baseRef = {
  Agency: "fr.insee",
  ID: "ref-1",
  Version: "1",
  TypeOfObject: "Variable",
};

const singleLangData: PhysicalInstanceResponse = {
  PhysicalInstance: [
    {
      URN: "urn:pi:1",
      Agency: "fr.insee",
      ID: "pi-1",
      Version: "1",
      Citation: {
        Title: {
          String: [{ MultilingualStringValue: { LanguageTag: "fr-FR", Value: "Titre FR" } }],
        },
      },
      DataRelationshipReference: baseRef,
    },
  ],
  DataRelationship: [
    {
      URN: "urn:dr:1",
      Agency: "fr.insee",
      ID: "dr-1",
      Version: "1",
      Label: {
        Content: [{ MultilingualStringValue: { LanguageTag: "fr-FR", Value: "Label DR FR" } }],
      },
      LogicalRecord: {
        URN: "urn:lr:1",
        Agency: "fr.insee",
        ID: "lr-1",
        Version: "1",
        Label: {
          Content: [{ MultilingualStringValue: { LanguageTag: "fr-FR", Value: "Label LR FR" } }],
        },
        VariablesInRecord: { VariableUsedReference: [] },
      },
    },
  ],
  Variable: [
    {
      URN: "urn:v:1",
      Agency: "fr.insee",
      ID: "v-1",
      Version: "1",
      VariableName: {
        String: [{ MultilingualStringValue: { LanguageTag: "fr-FR", Value: "NomVar FR" } }],
      },
      Label: {
        Content: [{ MultilingualStringValue: { LanguageTag: "fr-FR", Value: "Label Var FR" } }],
      },
      Description: {
        Content: [{ MultilingualStringValue: { LanguageTag: "fr-FR", Value: "Desc FR" } }],
      },
    },
  ],
  CodeList: [
    {
      URN: "urn:cl:1",
      Agency: "fr.insee",
      ID: "cl-1",
      Version: "1",
      Label: {
        Content: [{ MultilingualStringValue: { LanguageTag: "fr-FR", Value: "Label CL FR" } }],
      },
    },
  ],
  Category: [
    {
      URN: "urn:cat:1",
      Agency: "fr.insee",
      ID: "cat-1",
      Version: "1",
      Label: {
        Content: [{ MultilingualStringValue: { LanguageTag: "fr-FR", Value: "Label Cat FR" } }],
      },
    },
  ],
};

const multiLangData: PhysicalInstanceResponse = {
  PhysicalInstance: [
    {
      URN: "urn:pi:1",
      Agency: "fr.insee",
      ID: "pi-1",
      Version: "1",
      Citation: {
        Title: {
          String: [
            { MultilingualStringValue: { LanguageTag: "fr-FR", Value: "Titre FR" } },
            { MultilingualStringValue: { LanguageTag: "en-GB", Value: "Title EN" } },
          ],
        },
      },
      DataRelationshipReference: baseRef,
    },
  ],
  DataRelationship: [
    {
      URN: "urn:dr:1",
      Agency: "fr.insee",
      ID: "dr-1",
      Version: "1",
      Label: {
        Content: [
          { MultilingualStringValue: { LanguageTag: "fr-FR", Value: "Label DR FR" } },
          { MultilingualStringValue: { LanguageTag: "en-GB", Value: "Label DR EN" } },
        ],
      },
      LogicalRecord: {
        URN: "urn:lr:1",
        Agency: "fr.insee",
        ID: "lr-1",
        Version: "1",
        Label: {
          Content: [
            { MultilingualStringValue: { LanguageTag: "fr-FR", Value: "Label LR FR" } },
            { MultilingualStringValue: { LanguageTag: "en-GB", Value: "Label LR EN" } },
          ],
        },
        VariablesInRecord: { VariableUsedReference: [] },
      },
    },
  ],
  Variable: [
    {
      URN: "urn:v:1",
      Agency: "fr.insee",
      ID: "v-1",
      Version: "1",
      VariableName: {
        String: [
          { MultilingualStringValue: { LanguageTag: "fr-FR", Value: "NomVar FR" } },
          { MultilingualStringValue: { LanguageTag: "en-GB", Value: "VarName EN" } },
        ],
      },
      Label: {
        Content: [
          { MultilingualStringValue: { LanguageTag: "fr-FR", Value: "Label Var FR" } },
          { MultilingualStringValue: { LanguageTag: "en-GB", Value: "Label Var EN" } },
        ],
      },
      Description: {
        Content: [
          { MultilingualStringValue: { LanguageTag: "fr-FR", Value: "Desc FR" } },
          { MultilingualStringValue: { LanguageTag: "en-GB", Value: "Desc EN" } },
        ],
      },
    },
  ],
  CodeList: [
    {
      URN: "urn:cl:1",
      Agency: "fr.insee",
      ID: "cl-1",
      Version: "1",
      Label: {
        Content: [
          { MultilingualStringValue: { LanguageTag: "fr-FR", Value: "Label CL FR" } },
          { MultilingualStringValue: { LanguageTag: "en-GB", Value: "Label CL EN" } },
        ],
      },
    },
  ],
  Category: [
    {
      URN: "urn:cat:1",
      Agency: "fr.insee",
      ID: "cat-1",
      Version: "1",
      Label: {
        Content: [
          { MultilingualStringValue: { LanguageTag: "fr-FR", Value: "Label Cat FR" } },
          { MultilingualStringValue: { LanguageTag: "en-GB", Value: "Label Cat EN" } },
        ],
      },
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
    it("should filter Citation.Title.String to the correct language", () => {
      const { result } = renderHook(() => usePhysicalInstanceByLangs(multiLangData));

      const frData = result.current.get("fr-FR")!;
      const enData = result.current.get("en-GB")!;

      expect(frData.PhysicalInstance![0].Citation.Title.String).toEqual([
        { MultilingualStringValue: { LanguageTag: "fr-FR", Value: "Titre FR" } },
      ]);
      expect(enData.PhysicalInstance![0].Citation.Title.String).toEqual([
        { MultilingualStringValue: { LanguageTag: "en-GB", Value: "Title EN" } },
      ]);
    });
  });

  describe("DataRelationship", () => {
    it("should filter Label.Content to the correct language", () => {
      const { result } = renderHook(() => usePhysicalInstanceByLangs(multiLangData));

      const frData = result.current.get("fr-FR")!;
      const enData = result.current.get("en-GB")!;

      expect(frData.DataRelationship![0].Label!.Content).toEqual([
        { MultilingualStringValue: { LanguageTag: "fr-FR", Value: "Label DR FR" } },
      ]);
      expect(enData.DataRelationship![0].Label!.Content).toEqual([
        { MultilingualStringValue: { LanguageTag: "en-GB", Value: "Label DR EN" } },
      ]);
    });

    it("should filter LogicalRecord.Label.Content to the correct language", () => {
      const { result } = renderHook(() => usePhysicalInstanceByLangs(multiLangData));

      const frData = result.current.get("fr-FR")!;
      const enData = result.current.get("en-GB")!;

      expect(frData.DataRelationship![0].LogicalRecord.Label!.Content).toEqual([
        { MultilingualStringValue: { LanguageTag: "fr-FR", Value: "Label LR FR" } },
      ]);
      expect(enData.DataRelationship![0].LogicalRecord.Label!.Content).toEqual([
        { MultilingualStringValue: { LanguageTag: "en-GB", Value: "Label LR EN" } },
      ]);
    });
  });

  describe("Variable", () => {
    it("should filter VariableName.String to the correct language", () => {
      const { result } = renderHook(() => usePhysicalInstanceByLangs(multiLangData));

      const frData = result.current.get("fr-FR")!;
      const enData = result.current.get("en-GB")!;

      expect(frData.Variable![0].VariableName.String).toEqual([
        { MultilingualStringValue: { LanguageTag: "fr-FR", Value: "NomVar FR" } },
      ]);
      expect(enData.Variable![0].VariableName.String).toEqual([
        { MultilingualStringValue: { LanguageTag: "en-GB", Value: "VarName EN" } },
      ]);
    });

    it("should filter Label.Content to the correct language", () => {
      const { result } = renderHook(() => usePhysicalInstanceByLangs(multiLangData));

      const frData = result.current.get("fr-FR")!;
      const enData = result.current.get("en-GB")!;

      expect(frData.Variable![0].Label.Content).toEqual([
        { MultilingualStringValue: { LanguageTag: "fr-FR", Value: "Label Var FR" } },
      ]);
      expect(enData.Variable![0].Label.Content).toEqual([
        { MultilingualStringValue: { LanguageTag: "en-GB", Value: "Label Var EN" } },
      ]);
    });

    it("should filter Description.Content to the correct language", () => {
      const { result } = renderHook(() => usePhysicalInstanceByLangs(multiLangData));

      const frData = result.current.get("fr-FR")!;
      const enData = result.current.get("en-GB")!;

      expect(frData.Variable![0].Description!.Content).toEqual([
        { MultilingualStringValue: { LanguageTag: "fr-FR", Value: "Desc FR" } },
      ]);
      expect(enData.Variable![0].Description!.Content).toEqual([
        { MultilingualStringValue: { LanguageTag: "en-GB", Value: "Desc EN" } },
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

      expect(frData.CodeList![0].Label!.Content).toEqual([
        { MultilingualStringValue: { LanguageTag: "fr-FR", Value: "Label CL FR" } },
      ]);
      expect(enData.CodeList![0].Label!.Content).toEqual([
        { MultilingualStringValue: { LanguageTag: "en-GB", Value: "Label CL EN" } },
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

      expect(frData.Category![0].Label.Content).toEqual([
        { MultilingualStringValue: { LanguageTag: "fr-FR", Value: "Label Cat FR" } },
      ]);
      expect(enData.Category![0].Label.Content).toEqual([
        { MultilingualStringValue: { LanguageTag: "en-GB", Value: "Label Cat EN" } },
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
            Description: {
              Content: [
                { MultilingualStringValue: { LanguageTag: "fr", Value: "Desc FR subtag" } },
              ],
            },
          },
        ],
      };

      const { result } = renderHook(() => usePhysicalInstanceByLangs(mixedData));

      const frData = result.current.get("fr-FR")!;
      expect(frData.Variable![0].Description!.Content).toEqual([
        { MultilingualStringValue: { LanguageTag: "fr", Value: "Desc FR subtag" } },
      ]);
    });

    it("should use empty string when no entry matches the requested language", () => {
      const mixedData: PhysicalInstanceResponse = {
        ...multiLangData,
        Variable: [
          {
            ...multiLangData.Variable![0],
            // Description only in en-GB
            Description: {
              Content: [
                { MultilingualStringValue: { LanguageTag: "en-GB", Value: "Desc EN only" } },
              ],
            },
          },
        ],
      };

      const { result } = renderHook(() => usePhysicalInstanceByLangs(mixedData));

      const frData = result.current.get("fr-FR")!;
      expect(frData.Variable![0].Description!.Content).toEqual([
        { MultilingualStringValue: { LanguageTag: "fr-FR", Value: "" } },
      ]);
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
