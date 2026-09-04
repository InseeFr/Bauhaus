import { ConceptNotes } from "@model/concepts/concept";

import { buildNotes } from "./buildNotes";

describe("buildNotes", () => {
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
});
