import { describe, it, expect } from "vitest";

import type { Category, CodeList, CodeListUsage, CategoryUsage } from "../../types/api";
import {
  isCodeListSharedWithOthers,
  otherVariableNames,
  otherCodeListNames,
  isCategorySharedWithOtherLists,
  createCodeListVariant,
  createCategoryVariant,
} from "./CodeRepresentation.utils";

const usage = (variableId: string, variableLabel = "Sexe"): CodeListUsage => ({
  studyUnitAgencyId: "fr.insee",
  studyUnitId: "su-1",
  studyUnitLabel: "Recensement 2024",
  physicalInstanceAgencyId: "fr.insee",
  physicalInstanceId: "pi-1",
  physicalInstanceLabel: "Fichier détail",
  variableAgencyId: "fr.insee",
  variableId,
  variableLabel,
});

describe("isCodeListSharedWithOthers", () => {
  it("returns false when no usage exists", () => {
    expect(isCodeListSharedWithOthers([], "var-1")).toBe(false);
  });

  it("returns false when the only usage is the current variable", () => {
    expect(isCodeListSharedWithOthers([usage("var-1")], "var-1")).toBe(false);
  });

  it("returns true when another variable uses the code list", () => {
    expect(isCodeListSharedWithOthers([usage("var-1"), usage("var-2")], "var-1")).toBe(true);
  });

  it("returns true when current variable id is undefined and there are usages", () => {
    expect(isCodeListSharedWithOthers([usage("var-2")], undefined)).toBe(true);
  });
});

describe("otherVariableNames", () => {
  it("names only the variables other than the current one", () => {
    const usages = [usage("var-1", "Client"), usage("var-2", "Sexe"), usage("var-3", "Âge")];

    expect(otherVariableNames(usages, "var-1")).toEqual(["Sexe", "Âge"]);
  });

  it("counts a variable once even when it appears in several physical instances", () => {
    // Une ligne d'usage par (variable × PhysicalInstance) : sans dédoublonnage, la popup
    // annoncerait deux variables impactées là où il n'y en a qu'une.
    const usages = [usage("var-2", "Sexe"), usage("var-2", "Sexe")];

    expect(otherVariableNames(usages, "var-1")).toEqual(["Sexe"]);
  });

  it("falls back to the identifier when a variable has no label", () => {
    expect(otherVariableNames([{ ...usage("var-2"), variableLabel: null }], "var-1")).toEqual([
      "var-2",
    ]);
  });

  it("returns nothing when the current variable is the only user", () => {
    expect(otherVariableNames([usage("var-1")], "var-1")).toEqual([]);
  });
});

describe("isCategorySharedWithOtherLists", () => {
  const listUsage = (codeListId: string): CategoryUsage => ({
    group: { agencyId: "fr.insee", id: "grp-1", label: "Groupe démographie" },
    studyUnit: { agencyId: "fr.insee", id: "su-1", label: "Recensement 2024" },
    physicalInstance: { agencyId: "fr.insee", id: "pi-1", label: "Fichier détail" },
    variable: { agencyId: "fr.insee", id: "var-1", label: "Sexe" },
    codeList: { agencyId: "fr.insee", id: codeListId, label: "Pays" },
  });

  it("returns false when no code list uses the category", () => {
    expect(isCategorySharedWithOtherLists([], "cl-1")).toBe(false);
  });

  it("returns false when the only usage is the current code list", () => {
    expect(isCategorySharedWithOtherLists([listUsage("cl-1")], "cl-1")).toBe(false);
  });

  it("returns true when another code list uses the category", () => {
    expect(isCategorySharedWithOtherLists([listUsage("cl-1"), listUsage("cl-2")], "cl-1")).toBe(
      true,
    );
  });

  it("returns true when current code list id is undefined and there are usages", () => {
    expect(isCategorySharedWithOtherLists([listUsage("cl-2")], undefined)).toBe(true);
  });

  describe("otherCodeListNames", () => {
    it("names only the code lists other than the one being edited", () => {
      const usages = [
        { ...listUsage("cl-1"), codeList: { agencyId: "fr.insee", id: "cl-1", label: "Courante" } },
        { ...listUsage("cl-2"), codeList: { agencyId: "fr.insee", id: "cl-2", label: "Pays" } },
      ];

      expect(otherCodeListNames(usages, "cl-1")).toEqual(["Pays"]);
    });

    it("counts a code list once even when several variables use it", () => {
      expect(otherCodeListNames([listUsage("cl-2"), listUsage("cl-2")], "cl-1")).toEqual(["Pays"]);
    });

    it("falls back to the identifier when a code list has no label", () => {
      const usage = {
        ...listUsage("cl-2"),
        codeList: { agencyId: "fr.insee", id: "cl-2", label: null },
      };

      expect(otherCodeListNames([usage], "cl-1")).toEqual(["cl-2"]);
    });
  });
});

describe("createCodeListVariant", () => {
  const source: CodeList = {
    $type: "CodeList",
    VersionDate: { DateTime: "2024-01-01T00:00:00Z" },
    URN: "urn:ddi:fr.insee:cl-source:2",
    Agency: "fr.insee",
    ID: "cl-source",
    Version: "2",
    Label: [{ "@language": "fr-FR", "@value": "Pays" }],
    Code: [
      {
        $type: "CodeType",
        URN: "urn:ddi:fr.insee:code-1:1",
        Agency: "fr.insee",
        ID: "code-1",
        Version: "1",
        CategoryReference: {
          $type: "Category",
          URN: "urn:ddi:fr.insee:cat-1:1",
          Agency: "fr.insee",
          ID: "cat-1",
          Version: "1",
        },
        Value: { StringValue: "01" },
      },
    ],
  };

  it("creates a new code list with a fresh ID and version 1", () => {
    const variant = createCodeListVariant(source, "fr.insee");

    expect(variant.ID).not.toBe("cl-source");
    expect(variant.Version).toBe("1");
    // Le contenu (label, valeurs) est conservé.
    expect(variant.Label).toEqual(source.Label);
    expect(variant.Code?.[0]?.Value?.StringValue).toBe("01");
  });

  it("leaves the URN and the version date to the back-office", () => {
    // L'URN est une fonction de l'identité DDI et la VersionDate est stampée à l'écriture :
    // les fabriquer ici recopierait deux règles du back qui ne s'appliquent qu'à la sauvegarde.
    // Celles de la source seraient en plus fausses pour la variante.
    const variant = createCodeListVariant(source, "fr.insee");

    expect(variant.URN).toBeUndefined();
    expect(variant.VersionDate).toBeUndefined();
    expect(variant.Code?.[0]?.URN).toBeUndefined();
  });

  it("references the source list through a DDI BasedOnObject", () => {
    const variant = createCodeListVariant(source, "fr.insee");

    expect(variant.BasedOnObject).toEqual({
      $type: "BasedOnObjectType",
      BasedOnReference: [
        {
          $type: "CodeList",
          URN: "urn:ddi:fr.insee:cl-source:2",
          Agency: "fr.insee",
          ID: "cl-source",
          Version: "2",
        },
      ],
    });
  });

  it("gives the codes new identities but keeps their category references", () => {
    const variant = createCodeListVariant(source, "fr.insee");

    const code = variant.Code![0];
    expect(code.ID).not.toBe("code-1");
    expect(code.Version).toBe("1");
    // La catégorie reste l'item partagé : seul l'objet liste est forké (cas 1).
    expect(code.CategoryReference?.ID).toBe("cat-1");
    expect(code.Value?.StringValue).toBe("01");
  });
});

describe("createCategoryVariant", () => {
  const source: Category = {
    $type: "Category",
    VersionDate: { DateTime: "2024-01-01T00:00:00Z" },
    URN: "urn:ddi:fr.insee:cat-source:3",
    Agency: "fr.insee",
    ID: "cat-source",
    Version: "3",
    Label: [{ "@language": "fr-FR", "@value": "Europe modifiée" }],
  };

  it("creates a new category with a fresh ID and version 1", () => {
    const variant = createCategoryVariant(source, "fr.insee");

    expect(variant.ID).not.toBe("cat-source");
    expect(variant.Version).toBe("1");
    // Le libellé édité est conservé : c'est lui qu'on isole dans la variante.
    expect(variant.Label).toEqual(source.Label);
  });

  it("leaves the URN and the version date to the back-office", () => {
    const variant = createCategoryVariant(source, "fr.insee");

    expect(variant.URN).toBeUndefined();
    expect(variant.VersionDate).toBeUndefined();
  });

  it("references the source category through a DDI BasedOnObject", () => {
    const variant = createCategoryVariant(source, "fr.insee");

    expect(variant.BasedOnObject).toEqual({
      $type: "BasedOnObjectType",
      BasedOnReference: [
        {
          $type: "Category",
          URN: "urn:ddi:fr.insee:cat-source:3",
          Agency: "fr.insee",
          ID: "cat-source",
          Version: "3",
        },
      ],
    });
  });
});
