import { ddiI18n } from "../i18n";
import { getDdiErrorMessage } from "./api-errors";

const fr = ddiI18n.getFixedT("fr");
const en = ddiI18n.getFixedT("en");

// Rejet nu du SDK sur un 409 du back : { message, code, params, status }.
const missingVariableScheme = {
  message: "L'opération (StudyUnit fr.insee/su-1) n'a pas de VariableScheme…",
  code: "STUDY_UNIT_MISSING_VARIABLE_SCHEME",
  params: { studyUnit: "fr.insee/su-1" },
  status: 409,
};

describe("getDdiErrorMessage", () => {
  it("traduit le code d'erreur du back en français, avec ses paramètres", () => {
    expect(getDdiErrorMessage(missingVariableScheme, fr, "repli")).toBe(
      "L'opération (fr.insee/su-1) n'a pas de VariableScheme pour ranger ses variables : il doit être créé en amont.",
    );
  });

  it("traduit le code d'erreur du back en anglais, avec ses paramètres", () => {
    expect(getDdiErrorMessage(missingVariableScheme, en, "fallback")).toBe(
      "The operation (fr.insee/su-1) has no VariableScheme to file its variables: it must be created beforehand.",
    );
  });

  it("interpole le nombre de LogicalProducts", () => {
    const error = {
      code: "STUDY_UNIT_SEVERAL_LOGICAL_PRODUCTS",
      params: { studyUnit: "fr.insee/su-1", count: "2" },
      status: 409,
    };

    expect(getDdiErrorMessage(error, en, "fallback")).toBe(
      "The operation (fr.insee/su-1) has 2 LogicalProducts: only one is expected to file its variables.",
    );
  });

  it("garde le message du back quand le code n'a pas de traduction", () => {
    const error = { message: "Message du back", code: "UNKNOWN_CODE", status: 409 };

    expect(getDdiErrorMessage(error, en, "fallback")).toBe("Message du back");
  });

  it("garde le message du back quand l'erreur n'a pas de code", () => {
    expect(getDdiErrorMessage({ message: "Boom", status: 500 }, en, "fallback")).toBe("Boom");
  });

  it("retombe sur le repli sans code ni message", () => {
    expect(getDdiErrorMessage({ status: 500 }, en, "fallback")).toBe("fallback");
  });
});
