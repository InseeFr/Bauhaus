import { computeInitialMode, STRUCTURE_MODE, URN_MODE } from "./DataStructure";

describe("computeInitialMode", () => {
  it("returns STRUCTURE_MODE when value matches a known structure", () => {
    const structures = [{ iri: "abc", labelLg1: "L" }];
    expect(computeInitialMode(structures, "abc")).toBe(STRUCTURE_MODE);
  });

  it("returns URN_MODE when value is set but no structure matches", () => {
    const structures = [{ iri: "abc", labelLg1: "L" }];
    expect(computeInitialMode(structures, "urn:something")).toBe(URN_MODE);
  });

  it("returns URN_MODE when structures are not loaded but value is set", () => {
    expect(computeInitialMode(undefined, "urn:x")).toBe(URN_MODE);
  });

  it("returns null when value is empty", () => {
    expect(computeInitialMode([], "")).toBeNull();
  });
});
