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
        "common.familyTitle": "Family",
        "app.creatorsTitle": "Owners",
      },
    },
    "en",
  ),
}));

const validateSerie = validate(["accrualPeriodicityCode", "typeCode"]);

const validSerie = {
  family: { id: "i" },
  prefLabelLg1: "prefLabelLg1",
  prefLabelLg2: "prefLabelLg2",
  creators: ["creator"],
  accrualPeriodicityCode: "accrualPeriodicityCode",
  typeCode: "typeCode",
};

const NO_FIELD_ERROR = {
  prefLabelLg1: "",
  prefLabelLg2: "",
  creators: "",
  family: "",
  accrualPeriodicityCode: "",
  typeCode: "",
};

const titleLg1Required = mandatoryPropertyError("Intitulé");
const titleLg2Required = mandatoryPropertyError("Title");
const familyRequired = mandatoryPropertyError("Family");
const creatorsRequired = mandatoryPropertyError("Owners");

const cases: {
  name: string;
  serie: Parameters<typeof validateSerie>[0];
  expected: ReturnType<typeof validateSerie>;
}[] = [
  {
    name: "should return an error for prefLabelLg1",
    serie: { ...validSerie, prefLabelLg1: "" },
    expected: {
      errorMessage: [titleLg1Required],
      fields: { ...NO_FIELD_ERROR, prefLabelLg1: titleLg1Required },
    },
  },
  {
    name: "should return an error for prefLabelLg2",
    serie: { ...validSerie, prefLabelLg2: "" },
    expected: {
      errorMessage: [titleLg2Required],
      fields: { ...NO_FIELD_ERROR, prefLabelLg2: titleLg2Required },
    },
  },
  {
    name: "should return an error for prefLabelLg1, prefLabelLg2, family and creators",
    serie: {
      prefLabelLg1: "",
      prefLabelLg2: "",
      accrualPeriodicityCode: "accrualPeriodicityCode",
      typeCode: "typeCode",
      creators: [],
    },
    expected: {
      errorMessage: [familyRequired, titleLg1Required, titleLg2Required, creatorsRequired],
      fields: {
        ...NO_FIELD_ERROR,
        family: familyRequired,
        prefLabelLg1: titleLg1Required,
        prefLabelLg2: titleLg2Required,
        creators: creatorsRequired,
      },
    },
  },
  {
    name: "should return no error",
    serie: validSerie,
    expected: {
      errorMessage: [],
      fields: NO_FIELD_ERROR,
    },
  },
];

describe("validation", function () {
  cases.forEach(({ name, serie, expected }) => {
    it(name, function () {
      expect(validateSerie(serie)).toEqual(expected);
    });
  });
});
