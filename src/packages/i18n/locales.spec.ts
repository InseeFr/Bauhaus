import en from "./locales/en.json";
import fr from "./locales/fr.json";

import { appI18n } from ".";

const CONSTANT_NAME = /^[A-Z0-9_]+$/;

const errorTranslations = (catalogue: { errors: Record<string, unknown> }) =>
  Object.entries(catalogue.errors).filter(
    (entry): entry is [string, string] => typeof entry[1] === "string",
  );

describe.each([
  ["fr", fr],
  ["en", en],
])("catalogue global des erreurs (%s)", (_lang, catalogue) => {
  it("traduit chaque code par une phrase, jamais par le nom de sa constante", () => {
    const placeholders = errorTranslations(catalogue).filter(([, text]) =>
      CONSTANT_NAME.test(text),
    );

    expect(placeholders).toEqual([]);
  });
});

/**
 * Codes chaînes renvoyés par le back : refus de saisie des opérations (`ErrorCodes`,
 * `IndicatorErrorCode`) et pannes de dépendances (`CodedRmesException`). Sans traduction, le
 * message anglais du back s'afficherait.
 */
const BACK_STRING_CODES = [
  "406_OPERATION_FAMILY_OPERATION_FAMILY_EXISTING_PREF_LABEL_LG1",
  "406_OPERATION_FAMILY_OPERATION_FAMILY_EXISTING_PREF_LABEL_LG2",
  "406_OPERATION_DOCUMENT_OPERATION_DOCUMENT_LINK_EXISTING_LABEL_LG1",
  "406_OPERATION_DOCUMENT_OPERATION_DOCUMENT_LINK_EXISTING_LABEL_LG2",
  "406_OPERATION_SERIES_OPERATION_SERIES_EXISTING_PREF_LABEL_LG1",
  "406_OPERATION_SERIES_OPERATION_SERIES_EXISTING_PREF_LABEL_LG2",
  "406_OPERATION_OPERATION_OPERATION_OPERATION_EXISTING_PREF_LABEL_LG1",
  "406_OPERATION_OPERATION_OPERATION_OPERATION_EXISTING_PREF_LABEL_LG2",
  "406_OPERATION_INDICATOR_OPERATION_INDICATOR_EMPTY_WAS_GENERATED_BY",
  "406_OPERATION_INDICATOR_OPERATION_INDICATOR_EXISTING_PREF_LABEL_LG1",
  "406_OPERATION_INDICATOR_OPERATION_INDICATOR_EXISTING_PREF_LABEL_LG2",
  "OPERATION_INDICATOR_VALIDATION_UNVALIDATED_SERIES",
  "INVALID_REQUEST_BODY",
  "SIMS_CREATION_FAILED",
  "PUBLICATION_REPOSITORY_UNAVAILABLE",
  "RDF_REPOSITORY_UNAVAILABLE",
  "RDF_QUERY_FAILED",
  "COLECTICA_UNAVAILABLE",
  "DDI_SENTINEL_REPRESENTATION_LABEL_REQUIRED",
  "DDI_SENTINEL_CODE_LIST_LABEL_REQUIRED",
  "DDI4_INVALID",
];

describe.each([
  ["fr", fr],
  ["en", en],
])("codes chaînes du back (%s)", (_lang, catalogue) => {
  it.each(BACK_STRING_CODES)("traduit %s", (code) => {
    expect(catalogue.errors).toHaveProperty([code], expect.any(String));
  });
});

describe("refus d'une liste de valeurs sentinelles sans libellé", () => {
  it("nomme la liste fautive à partir des params", () => {
    expect(
      appI18n.t("errors.DDI_SENTINEL_REPRESENTATION_LABEL_REQUIRED", {
        agency: "fr.insee",
        id: "mmvr-1",
      }),
    ).toContain("fr.insee/mmvr-1");
  });
});

describe("refus de supprimer un objet publié", () => {
  it("parle de structure, et non de liste de codes, pour une structure publiée", () => {
    expect(fr.errors["1009"]).toBe(
      "La structure n'a pas pu être supprimée : elle a déjà été publiée.",
    );
    expect(en.errors["1009"]).toBe("The structure could not be removed: it is already published.");
  });
});
