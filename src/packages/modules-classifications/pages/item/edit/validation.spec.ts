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

const titleLg1Required = mandatoryPropertyError("Intitulé");
const titleLg2Required = mandatoryPropertyError("Title");
const altLabelTooLong = (length: number) =>
  `Le titre abrégé (${length}) doit contenir maximum ${length} caractères`;
const altLabelTooLongLg2 = (length: number) =>
  `The short title (${length}) should contain ${length} characters max`;

const NO_FIELD_ERROR = {
  prefLabelLg1: "",
  prefLabelLg2: "",
};

const titles = { prefLabelLg1: "prefLabelLg1", prefLabelLg2: "prefLabelLg2" };

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
    name: "accepts a short title exactly as long as its maximum length",
    item: {
      ...titles,
      altLabels: [{ length: "10", shortLabelLg1: "a".repeat(10), shortLabelLg2: "b".repeat(10) }],
    },
    expected: {
      errorMessage: [],
      fields: { ...NO_FIELD_ERROR, altLabelsLg1_10: "", altLabelsLg2_10: "" },
    },
  },
  {
    name: "rejects a short title longer than its maximum length, in each language",
    item: {
      ...titles,
      altLabels: [{ length: "10", shortLabelLg1: "a".repeat(11), shortLabelLg2: "b".repeat(11) }],
    },
    expected: {
      errorMessage: [altLabelTooLong(10), altLabelTooLongLg2(10)],
      fields: {
        ...NO_FIELD_ERROR,
        altLabelsLg1_10: altLabelTooLong(10),
        altLabelsLg2_10: altLabelTooLongLg2(10),
      },
    },
  },
  {
    name: "checks each short title against its own maximum length",
    item: {
      ...titles,
      altLabels: [
        { length: "10", shortLabelLg1: "a".repeat(20) },
        { length: "30", shortLabelLg1: "a".repeat(20) },
      ],
    },
    expected: {
      errorMessage: [altLabelTooLong(10)],
      fields: {
        ...NO_FIELD_ERROR,
        altLabelsLg1_10: altLabelTooLong(10),
        altLabelsLg2_10: "",
        altLabelsLg1_30: "",
        altLabelsLg2_30: "",
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
      expect(validate(item)).toEqual(expected);
    });
  });
});
