import { buildNotes } from "./notes";

describe("classification-notes-utils", () => {
  it("should return an array", () => {
    const notes = { scopeNoteLg1: "scopeNoteLg1" };
    const result = [
      {
        lg1: undefined,
        lg2: undefined,
        title: "classificationsDefinition",
      },
      {
        lg1: "scopeNoteLg1",
        lg2: undefined,
        title: "classificationsScopeNote",
      },
      {
        lg1: undefined,
        lg2: undefined,
        title: "classificationsCoreContentNote",
      },
      {
        lg1: undefined,
        lg2: undefined,
        title: "classificationsAdditionalContentNote",
      },
      {
        lg1: undefined,
        lg2: undefined,
        title: "classificationsExclusionNote",
      },
      {
        lg1: undefined,
        lg2: undefined,
        title: "classificationsChangeNote",
      },
    ];
    expect(buildNotes(notes)).toEqual(result);
  });
});
