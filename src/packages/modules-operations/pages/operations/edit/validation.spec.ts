import { i18nStub, mandatoryPropertyError } from "@utils/validation.testing";

import { validate } from "./validation";

vi.mock("../../../i18n", () => ({
  operationsI18n: i18nStub(
    {
      fr: {
        "common.title": "Intitulé",
        "common.year": "Millésime",
      },
      en: {
        "common.title": "Title",
        "common.serieTitle": "Serie",
        "app.numberProperty": "The property <strong>{{propertyName}}</strong> must be an integer.",
      },
    },
    "en",
  ),
}));

const validOperation = {
  series: { id: "i" },
  prefLabelLg1: "prefLabelLg1",
  prefLabelLg2: "prefLabelLg2",
};

const NO_FIELD_ERROR = {
  series: "",
  prefLabelLg1: "",
  prefLabelLg2: "",
  year: "",
};

const titleLg1Required = mandatoryPropertyError("Intitulé");
const titleLg2Required = mandatoryPropertyError("Title");
const seriesRequired = mandatoryPropertyError("Serie");
const yearMustBeAnInteger = "The property <strong>Millésime</strong> must be an integer.";

const cases: {
  name: string;
  operation: Parameters<typeof validate>[0];
  expected: ReturnType<typeof validate>;
}[] = [
  {
    name: "should return an error for prefLabelLg1",
    operation: { ...validOperation, prefLabelLg1: "" },
    expected: {
      errorMessage: [titleLg1Required],
      fields: { ...NO_FIELD_ERROR, prefLabelLg1: titleLg1Required },
    },
  },
  {
    name: "should return an error for prefLabelLg2",
    operation: { ...validOperation, prefLabelLg2: "" },
    expected: {
      errorMessage: [titleLg2Required],
      fields: { ...NO_FIELD_ERROR, prefLabelLg2: titleLg2Required },
    },
  },
  {
    name: "should return an error for series",
    operation: {
      prefLabelLg1: "prefLabelLg1",
      prefLabelLg2: "prefLabelLg2",
    },
    expected: {
      errorMessage: [seriesRequired],
      fields: { ...NO_FIELD_ERROR, series: seriesRequired },
    },
  },
  {
    name: "should return an error if the year is not a number",
    operation: { ...validOperation, year: "aazeaz" },
    expected: {
      errorMessage: [yearMustBeAnInteger],
      fields: { ...NO_FIELD_ERROR, year: yearMustBeAnInteger },
    },
  },
  {
    name: "should return an error if the year is not a float",
    operation: { ...validOperation, year: 5.4 },
    expected: {
      errorMessage: [yearMustBeAnInteger],
      fields: { ...NO_FIELD_ERROR, year: yearMustBeAnInteger },
    },
  },
  {
    name: "should return no error",
    operation: { ...validOperation, year: 2020 },
    expected: {
      errorMessage: [],
      fields: NO_FIELD_ERROR,
    },
  },
];

describe("validation", function () {
  cases.forEach(({ name, operation, expected }) => {
    it(name, function () {
      expect(validate(operation)).toEqual(expected);
    });
  });
});
