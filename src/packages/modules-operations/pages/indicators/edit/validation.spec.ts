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
        "app.creatorsTitle": "Owners",
        "common.generatedBy": "Produced from",
      },
    },
    "en",
  ),
}));

const validIndicator = {
  prefLabelLg1: "prefLabelLg1",
  prefLabelLg2: "prefLabelLg2",
  creators: ["creator"],
  wasGeneratedBy: [{ id: "i", type: "series" }],
};

const NO_FIELD_ERROR = {
  prefLabelLg1: "",
  prefLabelLg2: "",
  creators: "",
  wasGeneratedBy: "",
};

const titleLg1Required = mandatoryPropertyError("Intitulé");
const titleLg2Required = mandatoryPropertyError("Title");
const creatorsRequired = mandatoryPropertyError("Owners");
const generatedByRequired = mandatoryPropertyError("Produced from");

const cases: {
  name: string;
  indicator: Parameters<typeof validate>[0];
  expected: ReturnType<typeof validate>;
}[] = [
  {
    name: "should return an error for prefLabelLg1",
    indicator: { ...validIndicator, prefLabelLg1: "" },
    expected: {
      errorMessage: [titleLg1Required],
      fields: { ...NO_FIELD_ERROR, prefLabelLg1: titleLg1Required },
    },
  },
  {
    name: "should return an error for prefLabelLg2",
    indicator: { ...validIndicator, prefLabelLg2: "" },
    expected: {
      errorMessage: [titleLg2Required],
      fields: { ...NO_FIELD_ERROR, prefLabelLg2: titleLg2Required },
    },
  },
  {
    name: "should return an error for creators",
    indicator: { ...validIndicator, creators: [] },
    expected: {
      errorMessage: [creatorsRequired],
      fields: { ...NO_FIELD_ERROR, creators: creatorsRequired },
    },
  },
  {
    name: "should return an error if creators is an empty array",
    indicator: { ...validIndicator, creators: [] },
    expected: {
      errorMessage: [creatorsRequired],
      fields: { ...NO_FIELD_ERROR, creators: creatorsRequired },
    },
  },
  {
    name: "should return an error if wasGeneratedBy is an empty array",
    indicator: { ...validIndicator, wasGeneratedBy: [] },
    expected: {
      errorMessage: [generatedByRequired],
      fields: { ...NO_FIELD_ERROR, wasGeneratedBy: generatedByRequired },
    },
  },
  {
    name: "should return no error",
    indicator: validIndicator,
    expected: {
      errorMessage: [],
      fields: NO_FIELD_ERROR,
    },
  },
];

describe("validation", function () {
  cases.forEach(({ name, indicator, expected }) => {
    it(name, function () {
      expect(validate(indicator)).toEqual(expected);
    });
  });
});
