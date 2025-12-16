import { buildEmptyNotes } from "./build-empty-notes";

describe("buildEmptyNotes", () => {
  it("should return an object with the given fields as keys and empty strings as values", () => {
    const fields = ["title", "description", "content"];
    const expectedOutput = {
      title: "",
      description: "",
      content: "",
    };

    expect(buildEmptyNotes(fields)).toEqual(expectedOutput);
  });

  it("should return an empty object when given an empty array", () => {
    const fields: string[] = [];
    const expectedOutput = {};

    expect(buildEmptyNotes(fields)).toEqual(expectedOutput);
  });

  it("should handle fields with duplicate names", () => {
    const fields = ["title", "title", "content"];
    const expectedOutput = {
      title: "",
      content: "",
    };

    expect(buildEmptyNotes(fields)).toEqual(expectedOutput);
  });
});
