vi.mock("i18next", () => ({
  default: {
    t: (key: string, options?: { lng?: string }) => {
      const translations: Record<string, Record<string, string>> = {
        fr: {
          "distribution.mainTitle": "Intitulé",
        },
        en: {
          "dataset.title": "Dataset",
          "distribution.mainTitle": "Title",
          "distribution.URLerror": "The link is not valid",
        },
      };
      const lng = options?.lng || "en";
      return translations[lng]?.[key] || key;
    },
  },
}));

import { validate } from "./validation";

describe("validation", function () {
  it("should return an error for labelLg1", function () {
    expect(
      validate({
        idDataset: "id",
        labelLg2: "labelLg2",
      }),
    ).toEqual({
      errorMessage: ["The property <strong>Intitulé</strong> is required."],
      fields: {
        idDataset: "",
        labelLg1: "The property <strong>Intitulé</strong> is required.",
        labelLg2: "",
        accessUrl: "",
        url: "",
      },
    });
  });
  it("should return an error for labelLg2", function () {
    expect(
      validate({
        idDataset: "id",
        labelLg1: "labelLg1",
      }),
    ).toEqual({
      errorMessage: ["The property <strong>Title</strong> is required."],
      fields: {
        idDataset: "",
        labelLg1: "",
        labelLg2: "The property <strong>Title</strong> is required.",
        accessUrl: "",
        url: "",
      },
    });
  });
  it("should return an error for idDataset", function () {
    expect(
      validate({
        labelLg1: "labelLg1",
        labelLg2: "labelLg2",
      }),
    ).toEqual({
      errorMessage: ["The property <strong>Dataset</strong> is required."],
      fields: {
        idDataset: "The property <strong>Dataset</strong> is required.",
        labelLg1: "",
        labelLg2: "",
        accessUrl: "",
        url: "",
      },
    });
  });
  it("should return an error for accessUrl and url", function () {
    expect(
      validate({
        idDataset: "id",
        labelLg1: "labelLg1",
        labelLg2: "labelLg2",
        accessUrl: "wrong@url",
        url: "wrong@url",
      }),
    ).toEqual({
      errorMessage: ["The link is not valid", "The link is not valid"],
      fields: {
        idDataset: "",
        labelLg1: "",
        labelLg2: "",
        accessUrl: "The link is not valid",
        url: "The link is not valid",
      },
    });
  });
  it("should return no error", function () {
    expect(
      validate({
        idDataset: "id",
        labelLg1: "labelLg1",
        labelLg2: "labelLg2",
      }),
    ).toEqual({
      errorMessage: [],
      fields: {
        idDataset: "",
        labelLg1: "",
        labelLg2: "",
        accessUrl: "",
        url: "",
      },
    });
  });
});
