import { getClassification } from "./";

describe("getClassification", () => {
  it("should return undefined if the general is undefined", () => {
    const state = { classificationGeneral: {} };
    const id = "1";
    expect(getClassification(state, id)).toBeUndefined();
  });

  it("should return undefined if the levels are undefined", () => {
    const state = {
      classificationGeneral: { 1: { results: "results" } },
      classificationLevels: {},
    };
    const id = "1";
    expect(getClassification(state, id)).toBeUndefined();
  });

  it("should return an object with the general and levels", () => {
    const state = {
      classificationGeneral: { 1: { results: "results" } },
      classificationLevels: { 1: { results: "results" } },
    };
    const id = "1";
    expect(getClassification(state, id)).toEqual({
      general: "results",
      levels: "results",
    });
  });
});
