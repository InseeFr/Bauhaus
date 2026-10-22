import { CodeFormValues, validateCode } from "./validateCode";

vi.mock("../i18n", () => ({
  codelistsI18n: {
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

const filledCode = (code: string) => ({
  code,
  labelLg1: "labelLg1",
  labelLg2: "labelLg2",
});

const expectNoError = (result: ReturnType<typeof validateCode>) => {
  expect(result.errorMessage).toHaveLength(0);
  expect(result.fields).toEqual({
    code: "",
    labelLg1: "",
    labelLg2: "",
  });
};

describe("validateCode", () => {
  it("should return errors for missing mandatory fields", () => {
    const code = {};
    const codes: CodeFormValues[] = [];
    const updateMode = false;

    const result = validateCode(code, codes, updateMode);

    expect(result.errorMessage).toContain("The property <strong>Code</strong> is required.");
    expect(result.errorMessage).toContain("The property <strong>Libellé</strong> is required.");
    expect(result.errorMessage).toContain("The property <strong>Label</strong> is required.");

    expect(result.fields.code).toBe("The property <strong>Code</strong> is required.");
    expect(result.fields.labelLg1).toBe("The property <strong>Libellé</strong> is required.");
    expect(result.fields.labelLg2).toBe("The property <strong>Label</strong> is required.");
  });

  it("should return error for duplicate code when not in update mode", () => {
    const result = validateCode(filledCode("duplicateCode"), [{ code: "duplicateCode" }], false);

    expect(result.errorMessage).toContain("Le code créé existe déjà");
    expect(result.fields.code).toBe("Le code créé existe déjà");
  });

  it("should pass validation for valid code and no duplicate", () => {
    expectNoError(validateCode(filledCode("uniqueCode"), [{ code: "anotherCode" }], false));
  });

  it("should pass validation for valid code in update mode", () => {
    expectNoError(validateCode(filledCode("duplicateCode"), [{ code: "duplicateCode" }], true));
  });
});
