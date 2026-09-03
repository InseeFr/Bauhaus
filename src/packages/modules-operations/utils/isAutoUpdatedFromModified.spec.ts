import { DCTERMS_MODIFIED, isAutoUpdatedFromModified } from "./isAutoUpdatedFromModified";

describe("isAutoUpdatedFromModified", () => {
  it("returns true when subPropertyOf points to dcterms:modified", () => {
    expect(isAutoUpdatedFromModified({ subPropertyOf: DCTERMS_MODIFIED })).toBe(true);
  });

  it("returns false for any other subPropertyOf value", () => {
    expect(isAutoUpdatedFromModified({ subPropertyOf: "http://purl.org/dc/terms/created" })).toBe(
      false,
    );
  });

  it("returns false when subPropertyOf is missing", () => {
    expect(isAutoUpdatedFromModified({})).toBe(false);
    expect(isAutoUpdatedFromModified(undefined)).toBe(false);
  });
});
