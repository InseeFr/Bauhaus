import { CatalogRecord } from "@model/Dataset";

vi.mock("i18next", () => ({
  default: {
    t: (key: string, options?: { lng?: string }) => {
      const translations: Record<string, Record<string, string>> = {
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
      };
      const lng = options?.lng || "en";
      return translations[lng]?.[key] || key;
    },
  },
}));

import { validate } from "./validation";

const catalogRecord = {
  creator: "creator",
  contributor: ["contributor"],
} as CatalogRecord;

describe("validation", function () {
  it("should return an error for labelLg1", function () {
    expect(
      validate({
        labelLg2: "labelLg2",
        catalogRecord,
        disseminationStatus: "status",
        wasGeneratedIRIs: ["id"],
      }),
    ).toEqual({
      errorMessage: ["The property <strong>Intitulé</strong> is required."],
      fields: {
        labelLg1: "The property <strong>Intitulé</strong> is required.",
        labelLg2: "",
        altIdentifier: "",
        creator: "",
        contributor: "",
        disseminationStatus: "",
        wasGeneratedIRIs: "",
      },
    });
  });
  it("should return an error for labelLg2", function () {
    expect(
      validate({
        labelLg1: "labelLg1",
        catalogRecord,
        disseminationStatus: "status",
        wasGeneratedIRIs: ["id"],
      }),
    ).toEqual({
      errorMessage: ["The property <strong>Title</strong> is required."],
      fields: {
        labelLg1: "",
        labelLg2: "The property <strong>Title</strong> is required.",
        altIdentifier: "",
        creator: "",
        contributor: "",
        disseminationStatus: "",
        wasGeneratedIRIs: "",
      },
    });
  });
  it("should return an error for creator, contributor, disseminationStatus and wasGeneratedIRIs", function () {
    expect(
      validate({
        labelLg1: "labelLg2",
        labelLg2: "labelLg2",
        contributor: [],
        wasGeneratedIRIs: [],
      }),
    ).toEqual({
      errorMessage: [
        "The property <strong>Owner</strong> is required.",
        "The property <strong>Contributors</strong> is required.",
        "The property <strong>Dissemination status</strong> is required.",
        "The property <strong>Produced from</strong> is required.",
      ],
      fields: {
        labelLg1: "",
        labelLg2: "",
        altIdentifier: "",
        creator: "The property <strong>Owner</strong> is required.",
        contributor: "The property <strong>Contributors</strong> is required.",
        disseminationStatus: "The property <strong>Dissemination status</strong> is required.",
        wasGeneratedIRIs: "The property <strong>Produced from</strong> is required.",
      },
    });
  });
  it("should return an error if wasGeneratedIRIs is an empty array", function () {
    expect(
      validate({
        labelLg1: "labelLg2",
        labelLg2: "labelLg2",
        catalogRecord,
        disseminationStatus: "status",
        wasGeneratedIRIs: [],
      }),
    ).toEqual({
      errorMessage: ["The property <strong>Produced from</strong> is required."],
      fields: {
        labelLg1: "",
        labelLg2: "",
        altIdentifier: "",
        creator: "",
        contributor: "",
        disseminationStatus: "",
        wasGeneratedIRIs: "The property <strong>Produced from</strong> is required.",
      },
    });
  });

  it("should return no error", function () {
    expect(
      validate({
        labelLg1: "labelLg2",
        labelLg2: "labelLg2",
        catalogRecord,
        disseminationStatus: "status",
        wasGeneratedIRIs: ["id"],
        dataStructure: "http://dataset",
      }),
    ).toEqual({
      errorMessage: [],
      fields: {
        labelLg1: "",
        labelLg2: "",
        altIdentifier: "",
        creator: "",
        contributor: "",
        disseminationStatus: "",
        wasGeneratedIRIs: "",
      },
    });
  });
  it("should return no error if datastructure is undefined", function () {
    expect(
      validate({
        labelLg1: "labelLg2",
        labelLg2: "labelLg2",
        catalogRecord,
        disseminationStatus: "status",
        wasGeneratedIRIs: ["id"],
      }),
    ).toEqual({
      errorMessage: [],
      fields: {
        labelLg1: "",
        labelLg2: "",
        altIdentifier: "",
        creator: "",
        contributor: "",
        disseminationStatus: "",
        wasGeneratedIRIs: "",
      },
    });
  });
});
