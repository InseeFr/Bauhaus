import { i18nStub, mandatoryPropertyError } from "@utils/validation.testing";

import { validate } from "./validation";

vi.mock("../../../i18n", () => ({
  classificationsI18n: i18nStub(
    {
      fr: {
        "item.title": "Intitulé",
        "item.altLabelError":
          "Le titre abrégé ({{length}}) doit contenir maximum {{length}} caractères",
      },
      en: {
        "item.title": "Title",
        "item.altLabelError":
          "The short title ({{length}}) should contain {{length}} characters max",
      },
    },
    "fr",
  ),
}));

const ALT_LABELS_LENGTH = "65";

const titleLg1Required = mandatoryPropertyError("Intitulé");
const titleLg2Required = mandatoryPropertyError("Title");
const altLabelTooLong = "Le titre abrégé (65) doit contenir maximum 65 caractères";

const NO_FIELD_ERROR = {
  prefLabelLg1: "",
  prefLabelLg2: "",
  altLabelsLg1_: "",
  altLabelsLg2_: "",
};

const cases: {
  name: string;
  item: Parameters<typeof validate>[0];
  expected: ReturnType<typeof validate>;
}[] = [
  {
    name: "should return an error for prefLabelLg1 and prefLabelLg2",
    item: {
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
    name: "should return an error if altLabelsLg1_ is too long",
    item: {
      prefLabelLg1: "prefLabelLg1",
      prefLabelLg2: "prefLabelLg2",
      altLabelsLg1_:
        "a way way way way way way way way way way way way way way way way too long string",
    },
    expected: {
      errorMessage: [altLabelTooLong],
      fields: {
        ...NO_FIELD_ERROR,
        altLabelsLg1_: altLabelTooLong,
      },
    },
  },
  {
    name: "should return no error",
    item: {
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
  cases.forEach(({ name, item, expected }) => {
    it(name, function () {
      expect(validate(item, ALT_LABELS_LENGTH)).toEqual(expected);
    });
  });
});
