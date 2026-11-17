import { renderHook } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import type { PhysicalInstanceResponse } from "../physical-instances/types/api";
import { replaceItemsOfType, singleItemOfType } from "../physical-instances/types/ddi4Items";
import { envelope } from "../physical-instances/types/ddi4Items.testing";
import { usePhysicalInstanceByLangs } from "./usePhysicalInstanceByLangs";

const baseRef = [
  {
    $type: "Variable" as const,
    URN: "urn:ddi:fr.insee:ref-1:1",
    Agency: "fr.insee",
    ID: "ref-1",
    Version: "1",
  },
];

/** Même jeu de données en une seule langue, ou traduit en anglais quand `english` est vrai. */
const physicalInstanceData = (english = false): PhysicalInstanceResponse => {
  const localized = (fr: string, en: string) => [
    { "@language": "fr-FR", "@value": fr },
    ...(english ? [{ "@language": "en-GB", "@value": en }] : []),
  ];

  return envelope({
    PhysicalInstance: [
      {
        $type: "PhysicalInstance",
        URN: "urn:pi:1",
        Agency: "fr.insee",
        ID: "pi-1",
        Version: "1",
        Citation: {
          Title: localized("Titre FR", "Title EN"),
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
        Label: localized("Label DR FR", "Label DR EN"),
        LogicalRecord: [
          {
            $type: "LogicalRecordType",
            URN: "urn:lr:1",
            Agency: "fr.insee",
            ID: "lr-1",
            Version: "1",
            Label: localized("Label LR FR", "Label LR EN"),
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
        VariableName: localized("NomVar FR", "VarName EN"),
        Label: localized("Label Var FR", "Label Var EN"),
        Description: localized("Desc FR", "Desc EN"),
      },
    ],
    CodeList: [
      {
        $type: "CodeList",
        URN: "urn:cl:1",
        Agency: "fr.insee",
        ID: "cl-1",
        Version: "1",
        Label: localized("Label CL FR", "Label CL EN"),
      },
    ],
    Category: [
      {
        $type: "Category",
        URN: "urn:cat:1",
        Agency: "fr.insee",
        ID: "cat-1",
        Version: "1",
        Label: localized("Label Cat FR", "Label Cat EN"),
      },
    ],
  });
};

const singleLangData = physicalInstanceData();
const multiLangData = physicalInstanceData(true);

const byLangs = (data?: PhysicalInstanceResponse) =>
  renderHook(() => usePhysicalInstanceByLangs(data)).result.current;

/** Le champ lu par `select` ne garde, dans chaque langue, que la valeur de cette langue. */
const expectFieldFilteredByLang = (
  select: (data: PhysicalInstanceResponse) => unknown,
  frValue: string,
  enValue: string,
) => {
  const result = byLangs(multiLangData);

  expect(select(result.get("fr-FR")!)).toEqual([{ "@language": "fr-FR", "@value": frValue }]);
  expect(select(result.get("en-GB")!)).toEqual([{ "@language": "en-GB", "@value": enValue }]);
};

describe("usePhysicalInstanceByLangs", () => {
  it("should return an empty Map when data is undefined", () => {
    expect(byLangs(undefined).size).toBe(0);
  });

  it("should return a Map with one entry for single-language data", () => {
    const result = byLangs(singleLangData);

    expect(result.size).toBe(1);
    expect(result.has("fr-FR")).toBe(true);
  });

  it("should return a Map with two entries for multi-language data", () => {
    const result = byLangs(multiLangData);

    expect(result.size).toBe(2);
    expect(result.has("fr-FR")).toBe(true);
    expect(result.has("en-GB")).toBe(true);
  });

  describe("PhysicalInstance", () => {
    it("should filter Citation.Title to the correct language", () => {
      expectFieldFilteredByLang(
        (data) => singleItemOfType(data, "PhysicalInstance")!.Citation!.Title,
        "Titre FR",
        "Title EN",
      );
    });
  });

  describe("DataRelationship", () => {
    it("should filter Label.Content to the correct language", () => {
      expectFieldFilteredByLang(
        (data) => singleItemOfType(data, "DataRelationship")!.Label,
        "Label DR FR",
        "Label DR EN",
      );
    });

    it("should filter LogicalRecord.Label to the correct language", () => {
      expectFieldFilteredByLang(
        (data) => singleItemOfType(data, "DataRelationship")!.LogicalRecord![0].Label,
        "Label LR FR",
        "Label LR EN",
      );
    });
  });

  describe("Variable", () => {
    it("should filter VariableName.String to the correct language", () => {
      expectFieldFilteredByLang(
        (data) => singleItemOfType(data, "Variable")!.VariableName,
        "NomVar FR",
        "VarName EN",
      );
    });

    it("should filter Label.Content to the correct language", () => {
      expectFieldFilteredByLang(
        (data) => singleItemOfType(data, "Variable")!.Label,
        "Label Var FR",
        "Label Var EN",
      );
    });

    it("should filter Description.Content to the correct language", () => {
      expectFieldFilteredByLang(
        (data) => singleItemOfType(data, "Variable")!.Description,
        "Desc FR",
        "Desc EN",
      );
    });

    it("should not include Description when it is absent from the original", () => {
      const dataWithoutDesc = replaceItemsOfType(singleLangData, "Variable", [
        { ...singleItemOfType(singleLangData, "Variable")!, Description: undefined },
      ]);

      const result = byLangs(dataWithoutDesc);

      expect(singleItemOfType(result.get("fr-FR")!, "Variable")!.Description).toBeUndefined();
    });
  });

  describe("CodeList", () => {
    it("should filter Label.Content to the correct language", () => {
      expectFieldFilteredByLang(
        (data) => singleItemOfType(data, "CodeList")!.Label,
        "Label CL FR",
        "Label CL EN",
      );
    });

    it("should not include Label when it is absent from the original", () => {
      const dataWithoutLabel = replaceItemsOfType(singleLangData, "CodeList", [
        { ...singleItemOfType(singleLangData, "CodeList")!, Label: undefined },
      ]);

      const result = byLangs(dataWithoutLabel);

      expect(singleItemOfType(result.get("fr-FR")!, "CodeList")!.Label).toBeUndefined();
    });
  });

  describe("Category", () => {
    it("should filter Label.Content to the correct language", () => {
      expectFieldFilteredByLang(
        (data) => singleItemOfType(data, "Category")!.Label,
        "Label Cat FR",
        "Label Cat EN",
      );
    });
  });

  describe("fallback behaviour", () => {
    /** Même variable, dont la seule description porte la langue `lang`. */
    const dataWithDescriptionIn = (
      source: PhysicalInstanceResponse,
      lang: string,
      value: string,
    ): PhysicalInstanceResponse =>
      replaceItemsOfType(source, "Variable", [
        {
          ...singleItemOfType(source, "Variable")!,
          Description: [{ "@language": lang, "@value": value }],
        },
      ]);

    it("should match by primary subtag when exact lang is missing (fr matches fr-FR)", () => {
      // Field stored as "fr" instead of "fr-FR"
      const mixedData = dataWithDescriptionIn(singleLangData, "fr", "Desc FR subtag");

      const frData = byLangs(mixedData).get("fr-FR")!;

      expect(singleItemOfType(frData, "Variable")!.Description).toEqual([
        { "@language": "fr", "@value": "Desc FR subtag" },
      ]);
    });

    it("should use empty string when no entry matches the requested language", () => {
      // Description only in en-GB
      const mixedData = dataWithDescriptionIn(multiLangData, "en-GB", "Desc EN only");

      const frData = byLangs(mixedData).get("fr-FR")!;

      expect(singleItemOfType(frData, "Variable")!.Description).toEqual([
        { "@language": "fr-FR", "@value": "" },
      ]);
    });
  });

  describe("non-localized fields", () => {
    it("should preserve non-localized fields unchanged", () => {
      const frData = byLangs(singleLangData).get("fr-FR")!;

      expect(singleItemOfType(frData, "Variable")!.ID).toBe("v-1");
      expect(singleItemOfType(frData, "Variable")!.Agency).toBe("fr.insee");
      expect(singleItemOfType(frData, "Variable")!.Version).toBe("1");
      expect(singleItemOfType(frData, "Variable")!.URN).toBe("urn:v:1");
    });

    it("should preserve VariablesInRecord unchanged", () => {
      const frData = byLangs(singleLangData).get("fr-FR")!;

      expect(
        singleItemOfType(frData, "DataRelationship")!.LogicalRecord![0].VariablesInRecord,
      ).toEqual({
        VariableUsedReference: [],
      });
    });
  });
});
