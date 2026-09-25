import { i18nStub, mandatoryPropertyError } from "@utils/validation.testing";

import { validate } from "./validation";

vi.mock("../../../i18n", () => ({
  operationsI18n: i18nStub(
    {
      fr: {
        "common.title": "Intitulé",
      },
      en: {
        "common.title": "Title",
      },
    },
    "en",
  ),
}));

const NO_FIELD_ERROR = {
  prefLabelLg1: "",
  prefLabelLg2: "",
};

const titleLg1Required = mandatoryPropertyError("Intitulé");
const titleLg2Required = mandatoryPropertyError("Title");

const cases: {
  name: string;
  family: Parameters<typeof validate>[0];
  expected: ReturnType<typeof validate>;
}[] = [
  {
    name: "should return an error for prefLabelLg1",
    family: {
      prefLabelLg1: "",
      prefLabelLg2: "prefLabelLg2",
    },
    expected: {
      errorMessage: [titleLg1Required],
      fields: { ...NO_FIELD_ERROR, prefLabelLg1: titleLg1Required },
    },
  },
  {
    name: "should return an error for prefLabelLg2",
    family: {
      prefLabelLg1: "prefLabelLg1",
      prefLabelLg2: "",
    },
    expected: {
      errorMessage: [titleLg2Required],
      fields: { ...NO_FIELD_ERROR, prefLabelLg2: titleLg2Required },
    },
  },
  {
    name: "should return an error for prefLabelLg1 and prefLabelLg2",
    family: {
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
    name: "should return no error",
    family: {
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
  cases.forEach(({ name, family, expected }) => {
    it(name, function () {
      expect(validate(family)).toEqual(expected);
    });
  });
});
