vi.mock("i18next", () => ({
  default: {
    t: (key: string, options?: { lng?: string }) => {
      const translations: Record<string, Record<string, string>> = {
        fr: {
          "common.title": "Intitulé",
        },
        en: {
          "common.title": "Title",
          "app.creatorsTitle": "Owners",
          "common.generatedBy": "Produced from",
        },
      };
      const lng = options?.lng || "en";
      return translations[lng]?.[key] || key;
    },
  },
}));

import { validate } from "./validation";

describe("validation", function () {
  it("should return an error for prefLabelLg1", function () {
    expect(
      validate({
        prefLabelLg1: "",
        prefLabelLg2: "prefLabelLg2",
        creators: ["creator"],
        wasGeneratedBy: [{ id: "i", type: "series" }],
      }),
    ).toEqual({
      errorMessage: ["The property <strong>Intitulé</strong> is required."],
      fields: {
        prefLabelLg1: "The property <strong>Intitulé</strong> is required.",
        prefLabelLg2: "",
        creators: "",
        wasGeneratedBy: "",
      },
    });
  });
  it("should return an error for prefLabelLg2", function () {
    expect(
      validate({
        prefLabelLg1: "prefLabelLg1",
        prefLabelLg2: "",
        creators: ["creator"],
        wasGeneratedBy: [{ id: "i", type: "series" }],
      }),
    ).toEqual({
      errorMessage: ["The property <strong>Title</strong> is required."],
      fields: {
        prefLabelLg1: "",
        prefLabelLg2: "The property <strong>Title</strong> is required.",
        creators: "",
        wasGeneratedBy: "",
      },
    });
  });
  it("should return an error for creators", function () {
    expect(
      validate({
        prefLabelLg1: "prefLabelLg1",
        prefLabelLg2: "prefLabelLg2",
        wasGeneratedBy: [{ id: "i", type: "series" }],
        creators: [],
      }),
    ).toEqual({
      errorMessage: ["The property <strong>Owners</strong> is required."],
      fields: {
        prefLabelLg1: "",
        prefLabelLg2: "",
        creators: "The property <strong>Owners</strong> is required.",
        wasGeneratedBy: "",
      },
    });
  });
  it("should return an error if creators is an empty array", function () {
    expect(
      validate({
        prefLabelLg1: "prefLabelLg1",
        prefLabelLg2: "prefLabelLg2",
        creators: [],
        wasGeneratedBy: [{ id: "i", type: "series" }],
      }),
    ).toEqual({
      errorMessage: ["The property <strong>Owners</strong> is required."],
      fields: {
        prefLabelLg1: "",
        prefLabelLg2: "",
        creators: "The property <strong>Owners</strong> is required.",
        wasGeneratedBy: "",
      },
    });
  });
  it("should return an error if wasGeneratedBy is an empty array", function () {
    expect(
      validate({
        prefLabelLg1: "prefLabelLg1",
        prefLabelLg2: "prefLabelLg2",
        creators: ["creator"],
        wasGeneratedBy: [],
      }),
    ).toEqual({
      errorMessage: ["The property <strong>Produced from</strong> is required."],
      fields: {
        prefLabelLg1: "",
        prefLabelLg2: "",
        creators: "",
        wasGeneratedBy: "The property <strong>Produced from</strong> is required.",
      },
    });
  });
  it("should return no error", function () {
    expect(
      validate({
        prefLabelLg1: "prefLabelLg1",
        prefLabelLg2: "prefLabelLg2",
        creators: ["creator"],
        wasGeneratedBy: [{ id: "i", type: "series" }],
      }),
    ).toEqual({
      errorMessage: [],
      fields: {
        prefLabelLg1: "",
        prefLabelLg2: "",
        creators: "",
        wasGeneratedBy: "",
      },
    });
  });
});
