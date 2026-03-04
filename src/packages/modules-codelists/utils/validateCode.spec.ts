import NewDictionary from "../../i18n";
import { validateCode } from "./validateCode";

vi.mock("i18next", () => ({
  default: {
    t: (key: string, options?: { lng?: string }) => {
      const translations: Record<string, Record<string, string>> = {
        fr: {
          "codes.title": "Code",
          "codes.label": "Libellé",
          "codes.duplicateError": "Le code créé existe déjà",
        },
        en: {
          "codes.label": "Label",
        },
      };
      const lng = options?.lng || "fr";
      return translations[lng]?.[key] || key;
    },
  },
}));

describe("validateCode", () => {
  it("should return errors for missing mandatory fields", () => {
    const code = {};
    const codes = [];
    const updateMode = false;

    const result = validateCode(code, codes, updateMode);

    expect(result.errorMessage).toContain(NewDictionary.errors.mandatoryProperty("Code"));
    expect(result.errorMessage).toContain(NewDictionary.errors.mandatoryProperty("Libellé"));
    expect(result.errorMessage).toContain(NewDictionary.errors.mandatoryProperty("Label"));

    expect(result.fields.code).toBe(NewDictionary.errors.mandatoryProperty("Code"));
    expect(result.fields.labelLg1).toBe(NewDictionary.errors.mandatoryProperty("Libellé"));
    expect(result.fields.labelLg2).toBe(NewDictionary.errors.mandatoryProperty("Label"));
  });

  it("should return error for duplicate code when not in update mode", () => {
    const code = {
      code: "duplicateCode",
      labelLg1: "labelLg1",
      labelLg2: "labelLg2",
    };
    const codes = [{ code: "duplicateCode" }];
    const updateMode = false;

    const result = validateCode(code, codes, updateMode);

    expect(result.errorMessage).toContain("Le code créé existe déjà");
    expect(result.fields.code).toBe("Le code créé existe déjà");
  });

  it("should pass validation for valid code and no duplicate", () => {
    const code = {
      code: "uniqueCode",
      labelLg1: "labelLg1",
      labelLg2: "labelLg2",
    };
    const codes = [{ code: "anotherCode" }];
    const updateMode = false;

    const result = validateCode(code, codes, updateMode);

    expect(result.errorMessage).toHaveLength(0);
    expect(result.fields).toEqual({
      code: "",
      labelLg1: "",
      labelLg2: "",
    });
  });

  it("should pass validation for valid code in update mode", () => {
    const code = {
      code: "duplicateCode",
      labelLg1: "labelLg1",
      labelLg2: "labelLg2",
    };
    const codes = [{ code: "duplicateCode" }];
    const updateMode = true;

    const result = validateCode(code, codes, updateMode);

    expect(result.errorMessage).toHaveLength(0);
    expect(result.fields).toEqual({
      code: "",
      labelLg1: "",
      labelLg2: "",
    });
  });
});
