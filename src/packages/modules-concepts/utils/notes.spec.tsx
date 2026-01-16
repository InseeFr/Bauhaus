import { ConceptNotes } from "../../model/concepts/concept";
import { buildNotes, capitalizeFirst } from "./notes";

describe("concepts-notes-utils", () => {
  it("should return an array", () => {
    const notes = { scopeNoteLg1: "scopeNoteLg1" } as ConceptNotes;
    const result = [
      { lg1: "scopeNoteLg1", lg2: undefined, title: "conceptsScopeNote" },
      { lg1: undefined, lg2: undefined, title: "conceptsDefinition" },
      {
        lg1: undefined,
        lg2: undefined,
        title: "conceptsEditorialNote",
      },
      { lg1: undefined, lg2: undefined, title: "conceptsChangeNote" },
    ];
    expect(buildNotes(notes)).toEqual(result);
  });
  describe("capitalizeFirst", () => {
    it("should return empty string", () => {
      expect(capitalizeFirst("")).toEqual("");
    });
    it("should return the same string", () => {
      expect(capitalizeFirst("String")).toEqual("String");
    });
    it("should return capitalize string", () => {
      expect(capitalizeFirst("string")).toEqual("String");
    });
  });
});
