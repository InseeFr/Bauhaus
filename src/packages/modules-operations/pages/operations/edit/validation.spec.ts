vi.mock("i18next", () => ({
  default: {
    t: (key: string, options?: { lng?: string; propertyName?: string }) => {
      const translations: Record<string, Record<string, string>> = {
        fr: {
          "common.title": "Intitulé",
          "common.year": "Millésime",
        },
        en: {
          "common.title": "Title",
          "common.serieTitle": "Serie",
          "app.numberProperty": "The property <strong>{{propertyName}}</strong> must be an integer.",
        },
      };
      const lng = options?.lng || "en";
      const template = translations[lng]?.[key] || key;
      return options?.propertyName
        ? template.replace("{{propertyName}}", options.propertyName)
        : template;
    },
  },
}));

import { validate } from "./validation";

describe("validation", function () {
  it("should return an error for prefLabelLg1", function () {
    expect(
      validate({
        series: { id: "i" },
        prefLabelLg1: "",
        prefLabelLg2: "prefLabelLg2",
      }),
    ).toEqual({
      errorMessage: ["The property <strong>Intitulé</strong> is required."],
      fields: {
        series: "",
        prefLabelLg1: "The property <strong>Intitulé</strong> is required.",
        prefLabelLg2: "",
        year: "",
      },
    });
  });
  it("should return an error for prefLabelLg2", function () {
    expect(
      validate({
        series: { id: "i" },
        prefLabelLg1: "prefLabelLg1",
        prefLabelLg2: "",
      }),
    ).toEqual({
      errorMessage: ["The property <strong>Title</strong> is required."],
      fields: {
        series: "",
        prefLabelLg1: "",
        prefLabelLg2: "The property <strong>Title</strong> is required.",
        year: "",
      },
    });
  });
  it("should return an error for series", function () {
    expect(
      validate({
        prefLabelLg1: "prefLabelLg1",
        prefLabelLg2: "prefLabelLg2",
      }),
    ).toEqual({
      errorMessage: ["The property <strong>Serie</strong> is required."],
      fields: {
        series: "The property <strong>Serie</strong> is required.",
        prefLabelLg1: "",
        prefLabelLg2: "",
        year: "",
      },
    });
  });
  it("should return an error if the year is not a number", function () {
    expect(
      validate({
        series: { id: "i" },
        prefLabelLg1: "prefLabelLg1",
        prefLabelLg2: "prefLabelLg2",
        year: "aazeaz",
      }),
    ).toEqual({
      errorMessage: ["The property <strong>Millésime</strong> must be an integer."],
      fields: {
        series: "",
        prefLabelLg1: "",
        prefLabelLg2: "",
        year: "The property <strong>Millésime</strong> must be an integer.",
      },
    });
  });

  it("should return an error if the year is not a float", function () {
    expect(
      validate({
        series: { id: "i" },
        prefLabelLg1: "prefLabelLg1",
        prefLabelLg2: "prefLabelLg2",
        year: 5.4,
      }),
    ).toEqual({
      errorMessage: ["The property <strong>Millésime</strong> must be an integer."],
      fields: {
        series: "",
        prefLabelLg1: "",
        prefLabelLg2: "",
        year: "The property <strong>Millésime</strong> must be an integer.",
      },
    });
  });

  it("should return no error", function () {
    expect(
      validate({
        series: { id: "i" },
        prefLabelLg1: "prefLabelLg1",
        prefLabelLg2: "prefLabelLg2",
        year: 2020,
      }),
    ).toEqual({
      errorMessage: [],
      fields: {
        series: "",
        prefLabelLg1: "",
        prefLabelLg2: "",
        year: "",
      },
    });
  });
});
