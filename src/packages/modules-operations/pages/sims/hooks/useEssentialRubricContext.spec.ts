import { computeEssentialRubricContext, isEssentialRubricKo } from "./useEssentialRubricContext";

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

describe("isEssentialRubricKo — characterization", () => {
  it("returns true when currentSection is undefined", () => {
    expect(isEssentialRubricKo({ rangeType: "TEXT" }, undefined, false)).toBe(true);
  });

  it("returns true when currentSection is null", () => {
    expect(isEssentialRubricKo({ rangeType: "TEXT" }, null, false)).toBe(true);
  });

  describe("TEXT", () => {
    it("returns true when labelLg1 is empty", () => {
      expect(isEssentialRubricKo({ rangeType: "TEXT" }, { labelLg1: "" }, false)).toBe(true);
    });

    it("returns false when labelLg1 has content", () => {
      expect(isEssentialRubricKo({ rangeType: "TEXT" }, { labelLg1: "hello" }, false)).toBe(false);
    });

    it("returns true when secondLang and labelLg2 is empty", () => {
      expect(isEssentialRubricKo({ rangeType: "TEXT" }, { labelLg2: "" }, true)).toBe(true);
    });

    it("returns false when secondLang and labelLg2 has content", () => {
      expect(isEssentialRubricKo({ rangeType: "TEXT" }, { labelLg2: "hello" }, true)).toBe(false);
    });
  });

  describe("RICH_TEXT", () => {
    it("returns true when labelLg1 is empty", () => {
      expect(isEssentialRubricKo({ rangeType: "RICH_TEXT" }, { labelLg1: "" }, false)).toBe(true);
    });

    it("returns false when labelLg1 has content", () => {
      expect(
        isEssentialRubricKo({ rangeType: "RICH_TEXT" }, { labelLg1: "some text" }, false),
      ).toBe(false);
    });

    it("returns true when secondLang and labelLg2 is empty", () => {
      expect(isEssentialRubricKo({ rangeType: "RICH_TEXT" }, { labelLg2: "" }, true)).toBe(true);
    });

    it("returns false when secondLang and labelLg2 has content", () => {
      expect(isEssentialRubricKo({ rangeType: "RICH_TEXT" }, { labelLg2: "some text" }, true)).toBe(
        false,
      );
    });

    it("returns false when labelLg1 is empty but documentsLg1 contains at least one document", () => {
      expect(
        isEssentialRubricKo(
          { rangeType: "RICH_TEXT" },
          { labelLg1: "", documentsLg1: [{ uri: "http://bauhaus/document/x" }] },
          false,
        ),
      ).toBe(false);
    });

    it("returns false when secondLang and labelLg2 is empty but documentsLg2 contains at least one document", () => {
      expect(
        isEssentialRubricKo(
          { rangeType: "RICH_TEXT" },
          { labelLg2: "", documentsLg2: [{ uri: "http://bauhaus/document/y" }] },
          true,
        ),
      ).toBe(false);
    });

    it("returns false when labelLg1 is empty but documentsLg1 contains only a link", () => {
      expect(
        isEssentialRubricKo(
          { rangeType: "RICH_TEXT" },
          { labelLg1: "", documentsLg1: [{ uri: "http://bauhaus/page/abc" }] },
          false,
        ),
      ).toBe(false);
    });

    it("returns true when labelLg1 is empty and documentsLg1 is an empty array", () => {
      expect(
        isEssentialRubricKo({ rangeType: "RICH_TEXT" }, { labelLg1: "", documentsLg1: [] }, false),
      ).toBe(true);
    });

    it("returns true when secondLang, labelLg2 is empty and documentsLg2 is an empty array", () => {
      expect(
        isEssentialRubricKo({ rangeType: "RICH_TEXT" }, { labelLg2: "", documentsLg2: [] }, true),
      ).toBe(true);
    });
  });

  describe("ORGANIZATION", () => {
    it("returns true when value is falsy", () => {
      expect(isEssentialRubricKo({ rangeType: "ORGANIZATION" }, { value: "" }, false)).toBe(true);
    });

    it("returns false when value is truthy", () => {
      expect(isEssentialRubricKo({ rangeType: "ORGANIZATION" }, { value: "INSEE" }, false)).toBe(
        false,
      );
    });

    it("returns true on secondLang when value is falsy (value is shared across languages)", () => {
      expect(isEssentialRubricKo({ rangeType: "ORGANIZATION" }, { value: "" }, true)).toBe(true);
    });

    it("returns false on secondLang when value is truthy (value is shared across languages)", () => {
      expect(isEssentialRubricKo({ rangeType: "ORGANIZATION" }, { value: "INSEE" }, true)).toBe(
        false,
      );
    });
  });

  describe("DATE", () => {
    it("returns true when value is falsy", () => {
      expect(isEssentialRubricKo({ rangeType: "DATE" }, { value: "" }, false)).toBe(true);
    });

    it("returns false when value is truthy", () => {
      expect(isEssentialRubricKo({ rangeType: "DATE" }, { value: "2024-01-01" }, false)).toBe(
        false,
      );
    });
  });

  describe("GEOGRAPHY", () => {
    it("returns true when uri is falsy", () => {
      expect(isEssentialRubricKo({ rangeType: "GEOGRAPHY" }, { uri: "" }, false)).toBe(true);
    });

    it("returns false when uri is truthy", () => {
      expect(
        isEssentialRubricKo({ rangeType: "GEOGRAPHY" }, { uri: "http://example/fr" }, false),
      ).toBe(false);
    });
  });

  describe("CODE_LIST", () => {
    it("returns true when value is empty array", () => {
      expect(isEssentialRubricKo({ rangeType: "CODE_LIST" }, { value: [] }, false)).toBe(true);
    });

    it("returns true when value is missing", () => {
      expect(isEssentialRubricKo({ rangeType: "CODE_LIST" }, {}, false)).toBe(true);
    });

    it("returns false when value has at least one entry", () => {
      expect(isEssentialRubricKo({ rangeType: "CODE_LIST" }, { value: ["a"] }, false)).toBe(false);
    });
  });
});
