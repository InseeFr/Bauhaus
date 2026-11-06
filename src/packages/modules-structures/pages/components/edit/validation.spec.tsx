vi.mock("../../../i18n", async () =>
  (await import("../../validation.testing")).structuresI18nWith({
    fr: {
      "component.notation": "Notation",
      "component.label": "Libellé",
      "component.type.title": "Type",
    },
    en: {
      "component.notation": "Notation",
      "component.label": "Label",
      "component.type.title": "Type",
    },
  }),
);

import { requiredError } from "../../validation.testing";
import { validate } from "./validation";

const cases = [
  {
    name: "should return an error for identifiant",
    component: { labelLg1: "labelLg1", labelLg2: "labelLg2", type: "type" },
    errors: { identifiant: requiredError("Notation") },
  },
  {
    name: "should return an error for labelLg1 and labelLg2",
    component: { identifiant: "id", type: "type" },
    errors: { labelLg1: requiredError("Libellé"), labelLg2: requiredError("Label") },
  },
  {
    name: "should return an error for type",
    component: { identifiant: "id", labelLg1: "labelLg1", labelLg2: "labelLg2" },
    errors: { type: requiredError("Type") },
  },
  {
    name: "should return no error",
    component: { identifiant: "id", labelLg1: "labelLg1", labelLg2: "labelLg2", type: "type" },
    errors: {},
  },
];

describe("validation", function () {
  // Pas de `it.each` et de `$name` : Vitest tronque à 40 caractères les valeurs interpolées.
  cases.forEach(({ name, component, errors }) =>
    it(name, function () {
      expect(validate(component)).toEqual({
        errorMessage: Object.values(errors),
        fields: { identifiant: "", labelLg1: "", labelLg2: "", type: "", ...errors },
      });
    }),
  );
});
