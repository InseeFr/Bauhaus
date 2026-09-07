import { describe, it, expect } from "vitest";

import { overrideDialogKeyBase, overrideDialogTexts } from "./overrideDialogTexts";

// Rend `clé|{options}` pour pouvoir vérifier les valeurs interpolées.
const t = (key: string, options?: Record<string, unknown>) =>
  options ? `${key}|${JSON.stringify(options)}` : key;

const params = {
  codeListLabel: "Liste de codes test",
  otherVariableNames: ["Sexe", "Âge", "Poids"],
  categoryLabel: "Oui",
  otherCodeListNames: ["Pays", "Pays de naissance"],
  editedVariableName: "Client",
};

describe("overrideDialogKeyBase", () => {
  it("maps each case to its i18n key root", () => {
    expect(overrideDialogKeyBase("list")).toBe("physicalInstance.view.code.overrideShared");
    expect(overrideDialogKeyBase("listAndCategory")).toBe(
      "physicalInstance.view.code.overrideSharedCategory",
    );
    expect(overrideDialogKeyBase("category")).toBe("physicalInstance.view.code.overrideCategory");
  });
});

describe("overrideDialogTexts", () => {
  it("counts only the OTHER variables, never the one being edited (case 1)", () => {
    const texts = overrideDialogTexts("list", t, params);

    expect(texts.contextSentences).toEqual([
      'physicalInstance.view.code.overrideShared.message|{"label":"Liste de codes test","count":3,"firstOther":"Sexe"}',
    ]);
    expect(texts.overwrite.description).toBe(
      'physicalInstance.view.code.overrideShared.overwriteDescription|{"label":"Liste de codes test","count":3,"firstOther":"Sexe"}',
    );
  });

  it("names the single other variable instead of counting it", () => {
    // « aussi utilisée par la variable Âge » est actionnable ; « par 1 variable » ne l'est pas.
    const texts = overrideDialogTexts("list", t, { ...params, otherVariableNames: ["Âge"] });

    expect(texts.contextSentences[0]).toContain('"count":1');
    expect(texts.contextSentences[0]).toContain('"firstOther":"Âge"');
    // Un seul nom : il est déjà cité, pas d'énumération redondante.
    expect(texts.impactedSummary).toBeNull();
  });

  it("enumerates the impacted variables when there are several", () => {
    const texts = overrideDialogTexts("list", t, params);

    expect(texts.impactedSummary).toBe("Sexe, Âge, Poids");
  });

  it("truncates the enumeration beyond three names", () => {
    const texts = overrideDialogTexts("list", t, {
      ...params,
      otherVariableNames: ["Sexe", "Âge", "Poids", "Taille", "Ville"],
    });

    expect(texts.impactedSummary).toBe(
      'physicalInstance.view.code.override.andMore|{"names":"Sexe, Âge, Poids","count":2}',
    );
  });

  it("describes both the list and the category when both are shared (case 2)", () => {
    const texts = overrideDialogTexts("listAndCategory", t, params);

    // La liste (N autres variables) puis la catégorie (N autres listes).
    expect(texts.contextSentences).toEqual([
      'physicalInstance.view.code.overrideShared.message|{"label":"Liste de codes test","count":3,"firstOther":"Sexe"}',
      'physicalInstance.view.code.overrideSharedCategory.categoryMessage|{"label":"Oui","count":2,"firstOther":"Pays"}',
    ]);
    // Deux populations impactées : on ne les mélange pas dans une énumération unique.
    expect(texts.impactedSummary).toBeNull();
  });

  it("says nothing about the category when no other list uses it (case 2)", () => {
    // La popup combinée s'affiche dès que la liste est partagée, y compris quand la catégorie
    // n'est utilisée que par cette liste : annoncer « 0 autres listes » serait absurde.
    const texts = overrideDialogTexts("listAndCategory", t, { ...params, otherCodeListNames: [] });

    expect(texts.contextSentences).toHaveLength(1);
    expect(texts.contextSentences[0]).toContain("overrideShared.message");
  });

  it("states the list is own to the variable when only the category is shared (case 3)", () => {
    const texts = overrideDialogTexts("category", t, params);

    expect(texts.contextSentences).toEqual([
      'physicalInstance.view.code.overrideCategory.ownListMessage|{"variable":"Client"}',
      'physicalInstance.view.code.overrideCategory.categoryMessage|{"label":"Oui","count":2,"firstOther":"Pays"}',
    ]);
    // L'écrasement se compte en listes impactées, pas en variables.
    expect(texts.overwrite.description).toBe(
      'physicalInstance.view.code.overrideCategory.overwriteDescription|{"label":"Oui","count":2,"firstOther":"Pays"}',
    );
    expect(texts.impactedSummary).toBe("Pays, Pays de naissance");
  });

  it("gives every case a self-sufficient label for both choices", () => {
    // Un intitulé de bouton doit se comprendre sans lire le corps du texte : « Créer » seul ne
    // dit pas quoi. Chaque cas porte donc ses propres intitulés.
    for (const dialogCase of ["list", "listAndCategory", "category"] as const) {
      const texts = overrideDialogTexts(dialogCase, t, params);
      const keyBase = overrideDialogKeyBase(dialogCase);

      expect(texts.variant.label).toBe(`${keyBase}.variantLabel`);
      expect(texts.overwrite.label).toBe(`${keyBase}.overwriteLabel`);
      expect(texts.title).toBe(`${keyBase}.title`);
    }
  });

  it("shares the wording that does not depend on the case", () => {
    const texts = overrideDialogTexts("category", t, params);

    expect(texts.question).toBe("physicalInstance.view.code.override.question");
    expect(texts.cancel).toBe("physicalInstance.view.code.override.cancel");
  });
});
