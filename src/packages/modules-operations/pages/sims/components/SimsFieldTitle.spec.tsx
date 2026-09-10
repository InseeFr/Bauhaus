import { render } from "@testing-library/react";

import { SimsFieldTitleIndicatorBridge } from "./SimsFieldTitle";

describe("SimsFieldTitleIndicatorBridge — RICH_TEXT with documents", () => {
  const msd = { rangeType: "RICH_TEXT", minOccurs: "1" };

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
