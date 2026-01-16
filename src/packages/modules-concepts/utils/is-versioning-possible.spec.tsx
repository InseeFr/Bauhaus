import { ConceptNotes } from "../../model/concepts/concept";
import isVersioningPossible from "./is-versioning-possible";

describe("classification-notes-utils", () => {
  it("should return false because new changeNote is empty", () => {
    expect(
      isVersioningPossible(
        { changeNoteLg1: "" } as ConceptNotes,
        { changeNoteLg1: "" } as ConceptNotes,
      ),
    ).toBeFalsy();
  });
  it("should return false because changeNote doesn't change", () => {
    expect(
      isVersioningPossible(
        { changeNoteLg1: "A" } as ConceptNotes,
        { changeNoteLg1: "A" } as ConceptNotes,
      ),
    ).toBeFalsy();
  });
  it("should return true", () => {
    expect(
      isVersioningPossible(
        { changeNoteLg1: "A" } as ConceptNotes,
        { changeNoteLg1: "AA" } as ConceptNotes,
      ),
    ).toBeTruthy();
  });
});
