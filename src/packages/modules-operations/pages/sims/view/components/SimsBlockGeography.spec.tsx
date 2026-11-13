import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { Rubric } from "@model/Sims";

import { SimsBlockGeography } from "./SimsBlockGeography";

const LABELLED_RUBRIC = {
  labelLg1: "Primary Geography Label",
  labelLg2: "Second Geography Label",
} as Rubric;

const EMPTY_LABELS_RUBRIC = {
  labelLg1: "",
  labelLg2: "",
} as Rubric;

describe("SimsBlockGeography", () => {
  it("should display the labelLg1 when isSecondLang is false", () => {
    const { container } = render(
      <SimsBlockGeography currentSection={LABELLED_RUBRIC} isSecondLang={false} />,
    );

    expect(container.textContent).toBe("Primary Geography Label");
  });

  it("should display the labelLg2 when isSecondLang is true", () => {
    const { container } = render(
      <SimsBlockGeography currentSection={LABELLED_RUBRIC} isSecondLang={true} />,
    );

    expect(container.textContent).toBe("Second Geography Label");
  });

  it("should render nothing if currentSection has no labels", () => {
    const { container } = render(
      <SimsBlockGeography currentSection={EMPTY_LABELS_RUBRIC} isSecondLang={false} />,
    );

    expect(container.textContent).toBe("");
  });
});
