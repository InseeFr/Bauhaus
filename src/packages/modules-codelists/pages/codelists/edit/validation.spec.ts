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
        "codelists.codelistURI": "URI souhaité pour la liste de codes",
        "codelists.codesURI": "Modèle souhaité pour les URI des codes",
        "codelists.classURI": "URI du concept associé",
        "codelists.identifier": "Identifiant",
        "codelists.label": "Libellé",
        "codelists.creator": "Propriétaire",
        "codelists.disseminationStatus": "Statut de diffusion",
      },
      en: {
        "codelists.label": "Label",
      },
    },
    "fr",
  ),
}));

const MANDATORY_FIELD_ERRORS = {
  lastListUriSegment: mandatoryPropertyError("URI souhaité pour la liste de codes"),
  lastCodeUriSegment: mandatoryPropertyError("Modèle souhaité pour les URI des codes"),
  lastClassUriSegment: mandatoryPropertyError("URI du concept associé"),
  id: mandatoryPropertyError("Identifiant"),
  labelLg1: mandatoryPropertyError("Libellé"),
  labelLg2: mandatoryPropertyError("Label"),
  creator: mandatoryPropertyError("Propriétaire"),
  disseminationStatus: mandatoryPropertyError("Statut de diffusion"),
};

describe("validate", () => {
  it("should return errors for missing mandatory fields", () => {
    expectFieldErrors(validate({}), MANDATORY_FIELD_ERRORS);
  });

  it("should pass validation for valid codelist", () => {
    const codelist = {
      lastListUriSegment: "segment1",
      lastCodeUriSegment: "segment2",
      lastClassUriSegment: "segment3",
      id: "valid_id_123",
      labelLg1: "labelLg1",
      labelLg2: "labelLg2",
      creator: "creator",
      disseminationStatus: "status",
    };

    const result = validate(codelist);

    expect(result.errorMessage).toHaveLength(0);
    expect(result.fields).toEqual(withoutErrors(MANDATORY_FIELD_ERRORS));
  });
});
