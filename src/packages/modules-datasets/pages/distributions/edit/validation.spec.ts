import { i18nStub, mandatoryPropertyError } from "@utils/validation.testing";

import { validate } from "./validation";

vi.mock("../../../i18n", () => ({
  datasetsI18n: i18nStub(
    {
      fr: {
        "distribution.mainTitle": "Intitulé",
      },
      en: {
        "dataset.title": "Dataset",
        "distribution.mainTitle": "Title",
        "distribution.URLerror": "The link is not valid",
      },
    },
    "en",
  ),
}));

const validDistribution = {
  idDataset: "id",
  labelLg1: "labelLg1",
  labelLg2: "labelLg2",
};

const NO_FIELD_ERROR = {
  idDataset: "",
  labelLg1: "",
  labelLg2: "",
  accessUrl: "",
  url: "",
};

const titleLg1Required = mandatoryPropertyError("Intitulé");
const titleLg2Required = mandatoryPropertyError("Title");
const datasetRequired = mandatoryPropertyError("Dataset");
const invalidLink = "The link is not valid";

const cases: {
  name: string;
  distribution: Parameters<typeof validate>[0];
  expected: ReturnType<typeof validate>;
}[] = [
  {
    name: "should return an error for labelLg1",
    distribution: {
      idDataset: "id",
      labelLg2: "labelLg2",
    },
    expected: {
      errorMessage: [titleLg1Required],
      fields: { ...NO_FIELD_ERROR, labelLg1: titleLg1Required },
    },
  },
  {
    name: "should return an error for labelLg2",
    distribution: {
      idDataset: "id",
      labelLg1: "labelLg1",
    },
    expected: {
      errorMessage: [titleLg2Required],
      fields: { ...NO_FIELD_ERROR, labelLg2: titleLg2Required },
    },
  },
  {
    name: "should return an error for idDataset",
    distribution: {
      labelLg1: "labelLg1",
      labelLg2: "labelLg2",
    },
    expected: {
      errorMessage: [datasetRequired],
      fields: { ...NO_FIELD_ERROR, idDataset: datasetRequired },
    },
  },
  {
    name: "should return an error for accessUrl and url",
    distribution: { ...validDistribution, accessUrl: "wrong@url", url: "wrong@url" },
    expected: {
      errorMessage: [invalidLink, invalidLink],
      fields: { ...NO_FIELD_ERROR, accessUrl: invalidLink, url: invalidLink },
    },
  },
  {
    name: "should return no error",
    distribution: validDistribution,
    expected: {
      errorMessage: [],
      fields: NO_FIELD_ERROR,
    },
  },
  {
    name: "should accept empty strings for accessUrl and url",
    distribution: { ...validDistribution, accessUrl: "", url: "" },
    expected: {
      errorMessage: [],
      fields: NO_FIELD_ERROR,
    },
  },
  {
    name: "should accept valid URLs for accessUrl and url",
    distribution: {
      ...validDistribution,
      accessUrl: "https://example.com/access",
      url: "https://example.com/data",
    },
    expected: {
      errorMessage: [],
      fields: NO_FIELD_ERROR,
    },
  },
];

describe("validation", function () {
  cases.forEach(({ name, distribution, expected }) => {
    it(name, function () {
      expect(validate(distribution)).toEqual(expected);
    });
  });
});
