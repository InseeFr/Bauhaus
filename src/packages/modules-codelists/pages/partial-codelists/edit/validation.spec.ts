import {
  expectFieldErrors,
  i18nStub,
  mandatoryPropertyError,
  withoutErrors,
} from "@utils/validation.testing";

import { validate } from "./validation";

vi.mock("../../../i18n", () => ({
  codelistsI18n: i18nStub(
    {
      fr: {
        "partial-codelists.identifier": "Identifiant",
        "partial-codelists.invalidCharactersError":
          "La valeur renseignée dans ce champ contient des caractères invalides",
        "partial-codelists.parentCodelist": "Liste de codes parent",
        "partial-codelists.label": "Libellé",
        "partial-codelists.creator": "Propriétaire",
        "partial-codelists.disseminationStatus": "Statut de diffusion",
      },
      en: {
        "partial-codelists.label": "Label",
      },
    },
    "fr",
  ),
}));

const MANDATORY_FIELD_ERRORS = {
  id: mandatoryPropertyError("Identifiant"),
  parentCode: mandatoryPropertyError("Liste de codes parent"),
  labelLg1: mandatoryPropertyError("Libellé"),
  labelLg2: mandatoryPropertyError("Label"),
  creator: mandatoryPropertyError("Propriétaire"),
  disseminationStatus: mandatoryPropertyError("Statut de diffusion"),
};

const invalidCharactersError =
  "La valeur renseignée dans ce champ contient des caractères invalides";

const validCodelist = {
  id: "valid_id_123",
  parentCode: "parentCode",
  labelLg1: "labelLg1",
  labelLg2: "labelLg2",
  creator: "creator",
  disseminationStatus: "status",
};

describe("validate", () => {
  it("should return errors for missing mandatory fields", () => {
    expectFieldErrors(validate({}), MANDATORY_FIELD_ERRORS);
  });

  it("should return error for invalid id characters", () => {
    const codelist = { ...validCodelist, id: "invalid id!" };

    expectFieldErrors(validate(codelist), { id: invalidCharactersError });
  });

  it("should pass validation for valid codelist", () => {
    const result = validate(validCodelist);

    expect(result.errorMessage).toHaveLength(0);
    expect(result.fields).toEqual(withoutErrors(MANDATORY_FIELD_ERRORS));
  });
});
