import { render } from "@testing-library/react";

import { Code, Codelist } from "@model/Codelist";

import { CodeDisplay } from "./";

const CODELIST: Codelist = {
  codes: [
    { iri: "code1", labelLg1: "Label 1" },
    { iri: "code2", labelLg1: "Label 2" },
  ],
} as Codelist;

const EMPTY_CODELIST: Codelist = {
  codes: [] as Code[],
} as Codelist;

describe("CodeDisplay Component", () => {
  it("renders the correct label when a matching code is found", () => {
    const value = "code1";
    const { getByText } = render(<CodeDisplay codelist={CODELIST} value={value} />);

    getByText("Label 1");
  });

  it("renders nothing when no matching code is found", () => {
    const value = "code3";
    const { container } = render(<CodeDisplay codelist={CODELIST} value={value} />);

    expect(container.innerHTML).toBe("");
  });

  it("renders nothing when codelist is undefined", () => {
    const value = "code1";
    const { container } = render(<CodeDisplay codelist={undefined as any} value={value} />);
    expect(container.innerHTML).toBe("");
  });

  it("renders nothing when codelist is empty", () => {
    const value = "code1";
    const { container } = render(<CodeDisplay codelist={EMPTY_CODELIST} value={value} />);

    expect(container.innerHTML).toBe("");
  });
});
