import NewDictionary from "../../../../i18n";
import D, { D1, D2 } from "../../../i18n/build-dictionary";
import MainDictionary from "./../../../../deprecated-locales/build-dictionary";
import { validate } from "./validation";

describe("validate", () => {
  it("should return errors for missing mandatory fields", () => {
    const codelist = {};

    const result = validate(codelist);

    expect(result.errorMessage).toContain(
      NewDictionary.errors.mandatoryProperty(D.lastListUriSegmentTitleShort),
    );
    expect(result.errorMessage).toContain(
      NewDictionary.errors.mandatoryProperty(D.lastCodeUriSegmentTitleShort),
    );
    expect(result.errorMessage).toContain(
      NewDictionary.errors.mandatoryProperty(D.lastClassUriSegmentTitleShort),
    );
    expect(result.errorMessage).toContain(NewDictionary.errors.mandatoryProperty(D.idTitle));
    expect(result.errorMessage).toContain(NewDictionary.errors.mandatoryProperty(D1.labelTitle));
    expect(result.errorMessage).toContain(NewDictionary.errors.mandatoryProperty(D2.labelTitle));
    expect(result.errorMessage).toContain(NewDictionary.errors.mandatoryProperty(D2.creator));
    expect(result.errorMessage).toContain(
      NewDictionary.errors.mandatoryProperty(MainDictionary.disseminationStatusTitle),
    );

    expect(result.fields.lastListUriSegment).toBe(
      NewDictionary.errors.mandatoryProperty(D.lastListUriSegmentTitleShort),
    );
    expect(result.fields.lastCodeUriSegment).toBe(
      NewDictionary.errors.mandatoryProperty(D.lastCodeUriSegmentTitleShort),
    );
    expect(result.fields.lastClassUriSegment).toBe(
      NewDictionary.errors.mandatoryProperty(D.lastClassUriSegmentTitleShort),
    );
    expect(result.fields.id).toBe(NewDictionary.errors.mandatoryProperty(D.idTitle));
    expect(result.fields.labelLg1).toBe(NewDictionary.errors.mandatoryProperty(D1.labelTitle));
    expect(result.fields.labelLg2).toBe(NewDictionary.errors.mandatoryProperty(D2.labelTitle));
    expect(result.fields.creator).toBe(NewDictionary.errors.mandatoryProperty(D.creator));
    expect(result.fields.disseminationStatus).toBe(
      NewDictionary.errors.mandatoryProperty(MainDictionary.disseminationStatusTitle),
    );
  });

  it("should pass validation for valid codelist", () => {
    const codelist = {
      lastListUriSegment: "segment1",
      lastCodeUriSegment: "segment2",
      lastClassUriSegment: "segment3",
      id: "valid_id_123",
      labelLg1: "labelLg1",
      labelLg2: "labelLg2",
      creator: "creator",
      disseminationStatus: "status",
    };

    const result = validate(codelist);

    expect(result.errorMessage).toHaveLength(0);
    expect(result.fields).toEqual({
      creator: "",
      disseminationStatus: "",
      id: "",
      labelLg1: "",
      labelLg2: "",
      lastClassUriSegment: "",
      lastCodeUriSegment: "",
      lastListUriSegment: "",
    });
  });
});
