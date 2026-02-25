import NewDictionary from "../../i18n";
import D, { D1, D2 } from "../i18n/build-dictionary";
import { validateCode } from "./validateCode";

describe("validateCode", () => {
  it("should return errors for missing mandatory fields", () => {
    const code = {};
    const codes = [];
    const updateMode = false;

    const result = validateCode(code, codes, updateMode);

    expect(result.errorMessage).toContain(NewDictionary.errors.mandatoryProperty(D.idTitle));
    expect(result.errorMessage).toContain(NewDictionary.errors.mandatoryProperty(D1.labelTitle));
    expect(result.errorMessage).toContain(NewDictionary.errors.mandatoryProperty(D2.labelTitle));

    expect(result.fields.code).toBe(NewDictionary.errors.mandatoryProperty(D.idTitle));
    expect(result.fields.labelLg1).toBe(NewDictionary.errors.mandatoryProperty(D1.labelTitle));
    expect(result.fields.labelLg2).toBe(NewDictionary.errors.mandatoryProperty(D2.labelTitle));
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

    expect(result.errorMessage).toContain(D.ErrorDoubleCode);
    expect(result.fields.code).toBe(D.ErrorDoubleCode);
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
