vi.mock("../../../i18n", () => ({
  classificationsI18n: {
    t: (key: string, options?: { lng?: string; length?: number }) => {
      const translations: Record<string, Record<string, string>> = {
        fr: {
          "item.title": "Intitulé",
          "item.altLabelError": `Le titre abrégé (${options?.length}) doit contenir maximum ${options?.length} caractères`,
        },
        en: {
          "item.title": "Title",
          "item.altLabelError": `The short title (${options?.length}) should contain ${options?.length} characters max`,
        },
      };
      const lng = options?.lng ?? "fr";
      return translations[lng]?.[key] ?? key;
    },
  },
}));

import { validate } from "./validation";

describe("validation", function () {
  it("should return an error for prefLabelLg1 and prefLabelLg2", function () {
    expect(
      validate(
        {
          prefLabelLg1: "",
          prefLabelLg2: "",
        },
        "65",
      ),
    ).toEqual({
      errorMessage: [
        "The property <strong>Intitulé</strong> is required.",
        "The property <strong>Title</strong> is required.",
      ],
      fields: {
        prefLabelLg1: "The property <strong>Intitulé</strong> is required.",
        prefLabelLg2: "The property <strong>Title</strong> is required.",
        altLabelsLg1_: "",
        altLabelsLg2_: "",
      },
    });
  });
  it("should return an error if altLabelsLg1_ is too long", function () {
    expect(
      validate(
        {
          prefLabelLg1: "prefLabelLg1",
          prefLabelLg2: "prefLabelLg2",
          altLabelsLg1_:
            "a way way way way way way way way way way way way way way way way too long string",
        },
        "65",
      ),
    ).toEqual({
      errorMessage: ["Le titre abrégé (65) doit contenir maximum 65 caractères"],
      fields: {
        prefLabelLg1: "",
        prefLabelLg2: "",
        altLabelsLg1_: "Le titre abrégé (65) doit contenir maximum 65 caractères",
        altLabelsLg2_: "",
      },
    });
  });
  it("should return no error", function () {
    expect(
      validate(
        {
          prefLabelLg1: "prefLabelLg1",
          prefLabelLg2: "prefLabelLg2",
        },
        "65",
      ),
    ).toEqual({
      errorMessage: [],
      fields: {
        prefLabelLg1: "",
        prefLabelLg2: "",
        altLabelsLg1_: "",
        altLabelsLg2_: "",
      },
    });
  });
});
