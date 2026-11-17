import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { Rubric } from "@model/Sims";

import { SimsBlockText } from "./SimsBlockText";

const LABELLED_RUBRIC = {
  labelLg1: "Primary Language Label",
  labelLg2: "Second Language Label",
} as Rubric;

const EMPTY_LABELS_RUBRIC = {
  labelLg1: "",
  labelLg2: "",
} as Rubric;

const EMPTY_RUBRIC = {} as Rubric;

describe("SimsBlockText", () => {
  it("should display the labelLg1 when isSecondLang is false", () => {
    const { container } = render(
      <SimsBlockText currentSection={LABELLED_RUBRIC} isSecondLang={false} />,
    );

    expect(container.textContent).toBe("Primary Language Label");
  });

  it("should display the labelLg2 when isSecondLang is true", () => {
    const { container } = render(
      <SimsBlockText currentSection={LABELLED_RUBRIC} isSecondLang={true} />,
    );

    expect(container.textContent).toBe("Second Language Label");
  });

  it("should display an empty string if the selected label is not present", () => {
    const { container } = render(
      <SimsBlockText currentSection={EMPTY_LABELS_RUBRIC} isSecondLang={false} />,
    );

    expect(container.textContent).toBe("");
  });

  it("should not break if the currentSection is an empty object", () => {
    const { container } = render(
      <SimsBlockText currentSection={EMPTY_RUBRIC} isSecondLang={false} />,
    );

    expect(container.textContent).toBe("");
  });
});
