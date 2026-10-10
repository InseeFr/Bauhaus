import { i18nStub, mandatoryPropertyError } from "@utils/validation.testing";

import { validate } from "./validation";

vi.mock("../../../i18n", () => ({
  classificationsI18n: i18nStub(
    {
      fr: { "classification.title": "Intitulé" },
      en: { "classification.title": "Title" },
    },
    "fr",
  ),
}));

const titleLg1Required = mandatoryPropertyError("Intitulé");
const titleLg2Required = mandatoryPropertyError("Title");
const invalidUrl = "Invalid URL";

const NO_FIELD_ERROR = {
  prefLabelLg1: "",
  prefLabelLg2: "",
  additionalMaterial: "",
  legalMaterial: "",
  homepage: "",
};

const cases: {
  name: string;
  classification: Parameters<typeof validate>[0];
  expected: ReturnType<typeof validate>;
}[] = [
  {
    name: "should return an error for prefLabelLg1 and prefLabelLg2",
    classification: {
      prefLabelLg1: "",
      prefLabelLg2: "",
    },
    expected: {
      errorMessage: [titleLg1Required, titleLg2Required],
      fields: {
        ...NO_FIELD_ERROR,
        prefLabelLg1: titleLg1Required,
        prefLabelLg2: titleLg2Required,
      },
    },
  },
  {
    name: "should return an error for additionalMaterial, legalMaterial and homepage",
    classification: {
      prefLabelLg1: "prefLabelLg1",
      prefLabelLg2: "prefLabelLg2",
      additionalMaterial: "notAnUrl",
      legalMaterial: "notAnUrlEither",
      homepage: "definetelyNotAnUrl",
    },
    expected: {
      errorMessage: [invalidUrl, invalidUrl, invalidUrl],
      fields: {
        ...NO_FIELD_ERROR,
        additionalMaterial: invalidUrl,
        legalMaterial: invalidUrl,
        homepage: invalidUrl,
      },
    },
  },
  {
    name: "should return no error",
    classification: {
      prefLabelLg1: "prefLabelLg1",
      prefLabelLg2: "prefLabelLg2",
    },
    expected: {
      errorMessage: [],
      fields: NO_FIELD_ERROR,
    },
  },
];

describe("validation", function () {
  cases.forEach(({ name, classification, expected }) => {
    it(name, function () {
      expect(validate(classification)).toEqual(expected);
    });
  });
});
