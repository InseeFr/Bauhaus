import { computeEssentialRubricContext } from "./essential-rubric-context";

const essential = (idMas, rangeType = "TEXT", extra = {}) => ({
  idMas,
  rangeType,
  minOccurs: "1",
  children: {},
  ...extra,
});

const optional = (idMas, rangeType = "TEXT", extra = {}) => ({
  idMas,
  rangeType,
  minOccurs: "0",
  children: {},
  ...extra,
});

describe("computeEssentialRubricContext", () => {
  it("returns an empty object when metadataStructure is empty", () => {
    expect(computeEssentialRubricContext({}, {})).toEqual({});
  });

  it("flags essential rubric as KO when rubrics dictionary is empty", () => {
    const ms = { "I.1": essential("I.1") };
    const result = computeEssentialRubricContext(ms, {});
    expect(result["I.1"].essentialRubricKoLg1).toBe(true);
    expect(result["I.1"].essentialRubricKoLg2).toBe(true);
  });

  it("flags essential rubric as OK when its labelLg1 is filled", () => {
    const ms = { "I.1": essential("I.1", "TEXT") };
    const rubrics = { "I.1": { idAttribute: "I.1", labelLg1: "hello", labelLg2: "" } };
    const result = computeEssentialRubricContext(ms, rubrics);
    expect(result["I.1"].essentialRubricKoLg1).toBe(false);
    expect(result["I.1"].essentialRubricKoLg2).toBe(true);
  });

  it("does not add essentialRubricKoLgX on optional rubrics", () => {
    const ms = { "I.2": optional("I.2") };
    const result = computeEssentialRubricContext(ms, {});
    expect(result["I.2"].essentialRubricKoLg1).toBeUndefined();
    expect(result["I.2"].essentialRubricKoLg2).toBeUndefined();
  });

  it("preserves minOccurs so the RubricEssentialMsg total count still works", () => {
    const ms = {
      "I.1": essential("I.1"),
      "I.2": optional("I.2"),
    };
    const result = computeEssentialRubricContext(ms, {});
    expect(result["I.1"].minOccurs).toBe("1");
    expect(result["I.2"].minOccurs).toBe("0");
  });

  it("recurses into children so nested essential rubrics are counted", () => {
    const ms = {
      S1: {
        ...optional("S1"),
        children: {
          "S.1.1": essential("S.1.1", "TEXT"),
        },
      },
    };
    const rubrics = { "S.1.1": { labelLg1: "ok", labelLg2: "ok2" } };
    const result = computeEssentialRubricContext(ms, rubrics);
    expect(result["S.1.1"].essentialRubricKoLg1).toBe(false);
    expect(result["S.1.1"].essentialRubricKoLg2).toBe(false);
  });

  it("counts RICH_TEXT with only documentsLg1 as OK (issue #1486)", () => {
    const ms = { "I.3": essential("I.3", "RICH_TEXT") };
    const rubrics = {
      "I.3": { labelLg1: "", documentsLg1: [{ uri: "http://x/document/y" }] },
    };
    const result = computeEssentialRubricContext(ms, rubrics);
    expect(result["I.3"].essentialRubricKoLg1).toBe(false);
  });
});
