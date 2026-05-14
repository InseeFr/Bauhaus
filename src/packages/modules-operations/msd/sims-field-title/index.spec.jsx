import { render } from "@testing-library/react";

import { SimsFieldTitleIndicatorBridge, isEssentialRubricKo } from "./";

const TEXT = "TEXT";
const RICH_TEXT = "RICH_TEXT";
const ORGANIZATION = "ORGANIZATION";
const DATE = "DATE";
const GEOGRAPHY = "GEOGRAPHY";
const CODE_LIST = "CODE_LIST";

describe("isEssentialRubricKo — characterization", () => {
  it("returns true when currentSection is undefined", () => {
    expect(isEssentialRubricKo({ rangeType: TEXT }, undefined, false)).toBe(true);
  });

  it("returns true when currentSection is null", () => {
    expect(isEssentialRubricKo({ rangeType: TEXT }, null, false)).toBe(true);
  });

  describe("TEXT", () => {
    it("returns true when labelLg1 is empty", () => {
      expect(isEssentialRubricKo({ rangeType: TEXT }, { labelLg1: "" }, false)).toBe(true);
    });

    it("returns false when labelLg1 has content", () => {
      expect(isEssentialRubricKo({ rangeType: TEXT }, { labelLg1: "hello" }, false)).toBe(false);
    });

    it("returns true when secondLang and labelLg2 is empty", () => {
      expect(isEssentialRubricKo({ rangeType: TEXT }, { labelLg2: "" }, true)).toBe(true);
    });

    it("returns false when secondLang and labelLg2 has content", () => {
      expect(isEssentialRubricKo({ rangeType: TEXT }, { labelLg2: "hello" }, true)).toBe(false);
    });
  });

  describe("RICH_TEXT", () => {
    it("returns true when labelLg1 is empty", () => {
      expect(isEssentialRubricKo({ rangeType: RICH_TEXT }, { labelLg1: "" }, false)).toBe(true);
    });

    it("returns false when labelLg1 has content", () => {
      expect(isEssentialRubricKo({ rangeType: RICH_TEXT }, { labelLg1: "some text" }, false)).toBe(
        false,
      );
    });

    it("returns true when secondLang and labelLg2 is empty", () => {
      expect(isEssentialRubricKo({ rangeType: RICH_TEXT }, { labelLg2: "" }, true)).toBe(true);
    });

    it("returns false when secondLang and labelLg2 has content", () => {
      expect(isEssentialRubricKo({ rangeType: RICH_TEXT }, { labelLg2: "some text" }, true)).toBe(
        false,
      );
    });

    it("returns false when labelLg1 is empty but documentsLg1 contains at least one document", () => {
      expect(
        isEssentialRubricKo(
          { rangeType: RICH_TEXT },
          { labelLg1: "", documentsLg1: [{ uri: "http://bauhaus/document/x" }] },
          false,
        ),
      ).toBe(false);
    });

    it("returns false when secondLang and labelLg2 is empty but documentsLg2 contains at least one document", () => {
      expect(
        isEssentialRubricKo(
          { rangeType: RICH_TEXT },
          { labelLg2: "", documentsLg2: [{ uri: "http://bauhaus/document/y" }] },
          true,
        ),
      ).toBe(false);
    });

    it("returns false when labelLg1 is empty but documentsLg1 contains only a link", () => {
      expect(
        isEssentialRubricKo(
          { rangeType: RICH_TEXT },
          { labelLg1: "", documentsLg1: [{ uri: "http://bauhaus/page/abc" }] },
          false,
        ),
      ).toBe(false);
    });

    it("returns true when labelLg1 is empty and documentsLg1 is an empty array", () => {
      expect(
        isEssentialRubricKo({ rangeType: RICH_TEXT }, { labelLg1: "", documentsLg1: [] }, false),
      ).toBe(true);
    });

    it("returns true when secondLang, labelLg2 is empty and documentsLg2 is an empty array", () => {
      expect(
        isEssentialRubricKo({ rangeType: RICH_TEXT }, { labelLg2: "", documentsLg2: [] }, true),
      ).toBe(true);
    });
  });

  describe("ORGANIZATION", () => {
    it("returns true when value is falsy", () => {
      expect(isEssentialRubricKo({ rangeType: ORGANIZATION }, { value: "" }, false)).toBe(true);
    });

    it("returns false when value is truthy", () => {
      expect(isEssentialRubricKo({ rangeType: ORGANIZATION }, { value: "INSEE" }, false)).toBe(
        false,
      );
    });

    it("returns false on secondLang regardless of value (current behavior)", () => {
      expect(isEssentialRubricKo({ rangeType: ORGANIZATION }, { value: "" }, true)).toBe(false);
    });
  });

  describe("DATE", () => {
    it("returns true when value is falsy", () => {
      expect(isEssentialRubricKo({ rangeType: DATE }, { value: "" }, false)).toBe(true);
    });

    it("returns false when value is truthy", () => {
      expect(isEssentialRubricKo({ rangeType: DATE }, { value: "2024-01-01" }, false)).toBe(false);
    });
  });

  describe("GEOGRAPHY", () => {
    it("returns true when uri is falsy", () => {
      expect(isEssentialRubricKo({ rangeType: GEOGRAPHY }, { uri: "" }, false)).toBe(true);
    });

    it("returns false when uri is truthy", () => {
      expect(
        isEssentialRubricKo({ rangeType: GEOGRAPHY }, { uri: "http://example/fr" }, false),
      ).toBe(false);
    });
  });

  describe("CODE_LIST", () => {
    it("returns true when value is empty array", () => {
      expect(isEssentialRubricKo({ rangeType: CODE_LIST }, { value: [] }, false)).toBe(true);
    });

    it("returns true when value is missing", () => {
      expect(isEssentialRubricKo({ rangeType: CODE_LIST }, {}, false)).toBe(true);
    });

    it("returns false when value has at least one entry", () => {
      expect(isEssentialRubricKo({ rangeType: CODE_LIST }, { value: ["a"] }, false)).toBe(false);
    });
  });
});

describe("SimsFieldTitleIndicatorBridge — RICH_TEXT with documents", () => {
  const msd = { rangeType: RICH_TEXT, minOccurs: "1" };

  it("renders ✅ when labelLg1 is empty but documentsLg1 has a document", () => {
    const { container } = render(
      <SimsFieldTitleIndicatorBridge
        msd={msd}
        currentSection={{
          labelLg1: "",
          documentsLg1: [{ uri: "http://bauhaus/document/x" }],
        }}
        secondLang={false}
      />,
    );
    expect(container.textContent).toContain("✅");
  });

  it("renders ⚠️ when labelLg1 is empty and documentsLg1 is empty array", () => {
    const { container } = render(
      <SimsFieldTitleIndicatorBridge
        msd={msd}
        currentSection={{ labelLg1: "", documentsLg1: [] }}
        secondLang={false}
      />,
    );
    expect(container.textContent).toContain("⚠️");
  });

  it("renders ✅ when secondLang, labelLg2 is empty but documentsLg2 has a document", () => {
    const { container } = render(
      <SimsFieldTitleIndicatorBridge
        msd={msd}
        currentSection={{
          labelLg2: "",
          documentsLg2: [{ uri: "http://bauhaus/document/y" }],
        }}
        secondLang={true}
      />,
    );
    expect(container.textContent).toContain("✅");
  });

  it("renders ⚠️ when secondLang, labelLg2 is empty and documentsLg2 is empty array", () => {
    const { container } = render(
      <SimsFieldTitleIndicatorBridge
        msd={msd}
        currentSection={{ labelLg2: "", documentsLg2: [] }}
        secondLang={true}
      />,
    );
    expect(container.textContent).toContain("⚠️");
  });
});
