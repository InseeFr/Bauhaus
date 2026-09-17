vi.mock("../../../i18n", async () =>
  (await import("../../validation.testing")).structuresI18nWith({
    fr: {
      "structure.notation": "Notation",
      "structure.label": "Libellé",
    },
    en: {
      "structure.notation": "Notation",
      "structure.label": "Label",
    },
  }),
);

import { requiredError } from "../../validation.testing";
import { validate } from "./validation";

const cases = [
  {
    name: "should return an error for id",
    structure: { identifiant: "", labelLg1: "labelLg1", labelLg2: "labelLg2" },
    errors: { identifiant: requiredError("Notation") },
  },
  {
    name: "should return an error for labelLg1",
    structure: { identifiant: "id", labelLg1: "", labelLg2: "labelLg2" },
    errors: { labelLg1: requiredError("Libellé") },
  },
  {
    name: "should return an error for labelLg2",
    structure: { identifiant: "id", labelLg1: "labelLg1", labelLg2: "" },
    errors: { labelLg2: requiredError("Label") },
  },
  {
    name: "should return no error",
    structure: { identifiant: "id", labelLg1: "labelLg1", labelLg2: "labelLg2" },
    errors: {},
  },
];

describe("validation", function () {
  // Pas de `it.each` et de `$name` : Vitest tronque à 40 caractères les valeurs interpolées.
  cases.forEach(({ name, structure, errors }) =>
    it(name, function () {
      expect(validate(structure)).toEqual({
        errorMessage: Object.values(errors),
        fields: { identifiant: "", labelLg1: "", labelLg2: "", ...errors },
      });
    }),
  );
});
