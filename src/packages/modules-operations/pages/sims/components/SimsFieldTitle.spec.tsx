import { render } from "@testing-library/react";

import { SimsFieldTitleIndicatorBridge } from "./SimsFieldTitle";

const RICH_TEXT_MSD = { rangeType: "RICH_TEXT", minOccurs: "1" };

const renderIndicator = (currentSection: Record<string, unknown>, secondLang: boolean) =>
  render(
    <SimsFieldTitleIndicatorBridge
      msd={RICH_TEXT_MSD}
      currentSection={currentSection}
      secondLang={secondLang}
    />,
  );

describe("SimsFieldTitleIndicatorBridge — RICH_TEXT with documents", () => {
  it("renders ✅ when labelLg1 is empty but documentsLg1 has a document", () => {
    const { container } = renderIndicator(
      {
        labelLg1: "",
        documentsLg1: [{ uri: "http://bauhaus/document/x" }],
      },
      false,
    );
    expect(container.textContent).toContain("✅");
  });

  it("renders ⚠️ when labelLg1 is empty and documentsLg1 is empty array", () => {
    const { container } = renderIndicator({ labelLg1: "", documentsLg1: [] }, false);
    expect(container.textContent).toContain("⚠️");
  });

  it("renders ✅ when secondLang, labelLg2 is empty but documentsLg2 has a document", () => {
    const { container } = renderIndicator(
      {
        labelLg2: "",
        documentsLg2: [{ uri: "http://bauhaus/document/y" }],
      },
      true,
    );
    expect(container.textContent).toContain("✅");
  });

  it("renders ⚠️ when secondLang, labelLg2 is empty and documentsLg2 is empty array", () => {
    const { container } = renderIndicator({ labelLg2: "", documentsLg2: [] }, true);
    expect(container.textContent).toContain("⚠️");
  });
});
