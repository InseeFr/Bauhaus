import { CatalogRecord, Dataset } from "@model/Dataset";

import { i18nStub, mandatoryPropertyError } from "@utils/validation.testing";

import { validate } from "./validation";

vi.mock("../../../i18n", () => ({
  datasetsI18n: i18nStub(
    {
      fr: {
        "dataset.globalInformation.mainTitle": "Intitulé",
      },
      en: {
        "dataset.globalInformation.mainTitle": "Title",
        "dataset.internalManagement.creator": "Owner",
        "dataset.internalManagement.contributors": "Contributors",
        "dataset.internalManagement.disseminationStatus": "Dissemination status",
        "dataset.internalManagement.generatedBy": "Produced from",
      },
    },
    "en",
  ),
}));

const catalogRecord = {
  creator: "creator",
  contributor: ["contributor"],
} as CatalogRecord;

/**
 * `validate` ne lit qu'une poignée de champs : les fixtures sont volontairement
 * partielles, et l'une d'elles passe `contributor` à la racine pour couvrir la
 * précédence sur `catalogRecord`. Cette conversion évite de recopier tout le modèle.
 */
const asDataset = (fields: Record<string, unknown>) => fields as unknown as Dataset;

const validDataset = {
  labelLg1: "labelLg2",
  labelLg2: "labelLg2",
  catalogRecord,
  disseminationStatus: "status",
  wasGeneratedIRIs: ["id"],
};

const NO_FIELD_ERROR = {
  labelLg1: "",
  labelLg2: "",
  altIdentifier: "",
  creator: "",
  contributor: "",
  disseminationStatus: "",
  wasGeneratedIRIs: "",
};

const titleLg1Required = mandatoryPropertyError("Intitulé");
const titleLg2Required = mandatoryPropertyError("Title");
const creatorRequired = mandatoryPropertyError("Owner");
const contributorRequired = mandatoryPropertyError("Contributors");
const disseminationStatusRequired = mandatoryPropertyError("Dissemination status");
const generatedByRequired = mandatoryPropertyError("Produced from");

const cases: {
  name: string;
  dataset: Record<string, unknown>;
  expected: ReturnType<typeof validate>;
}[] = [
  {
    name: "should return an error for labelLg1",
    dataset: {
      labelLg2: "labelLg2",
      catalogRecord,
      disseminationStatus: "status",
      wasGeneratedIRIs: ["id"],
    },
    expected: {
      errorMessage: [titleLg1Required],
      fields: { ...NO_FIELD_ERROR, labelLg1: titleLg1Required },
    },
  },
  {
    name: "should return an error for labelLg2",
    dataset: {
      labelLg1: "labelLg1",
      catalogRecord,
      disseminationStatus: "status",
      wasGeneratedIRIs: ["id"],
    },
    expected: {
      errorMessage: [titleLg2Required],
      fields: { ...NO_FIELD_ERROR, labelLg2: titleLg2Required },
    },
  },
  {
    name: "should return an error for creator, contributor, disseminationStatus and wasGeneratedIRIs",
    dataset: {
      labelLg1: "labelLg2",
      labelLg2: "labelLg2",
      contributor: [],
      wasGeneratedIRIs: [],
    },
    expected: {
      errorMessage: [
        creatorRequired,
        contributorRequired,
        disseminationStatusRequired,
        generatedByRequired,
      ],
      fields: {
        ...NO_FIELD_ERROR,
        creator: creatorRequired,
        contributor: contributorRequired,
        disseminationStatus: disseminationStatusRequired,
        wasGeneratedIRIs: generatedByRequired,
      },
    },
  },
  {
    name: "should return an error if wasGeneratedIRIs is an empty array",
    dataset: { ...validDataset, wasGeneratedIRIs: [] },
    expected: {
      errorMessage: [generatedByRequired],
      fields: { ...NO_FIELD_ERROR, wasGeneratedIRIs: generatedByRequired },
    },
  },
  {
    name: "should return no error",
    dataset: { ...validDataset, dataStructure: "http://dataset" },
    expected: {
      errorMessage: [],
      fields: NO_FIELD_ERROR,
    },
  },
  {
    name: "should return no error if datastructure is undefined",
    dataset: validDataset,
    expected: {
      errorMessage: [],
      fields: NO_FIELD_ERROR,
    },
  },
];

describe("validation", function () {
  cases.forEach(({ name, dataset, expected }) => {
    it(name, function () {
      expect(validate(asDataset(dataset))).toEqual(expected);
    });
  });
});
