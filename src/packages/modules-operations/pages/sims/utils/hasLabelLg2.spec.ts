import { Rubric } from "@model/Sims";

import { rangeType } from "../../../constants/rangeType";
import { hasLabelLg2 } from "./hasLabelLg2";

const { RICH_TEXT, TEXT, REPORTED_ATTRIBUTE } = rangeType;

describe("hasLabelLg2", () => {
  it("should return true if the section is a TEXT", () => {
    const input = { rangeType: TEXT } as unknown as Rubric;
    expect(hasLabelLg2(input)).toBeTruthy();
  });
  it("should return true if the section is a RICH_TEXT", () => {
    const input = { rangeType: RICH_TEXT } as unknown as Rubric;
    expect(hasLabelLg2(input)).toBeTruthy();
  });
  it("should return false if the section is a REPORTED_ATTRIBUTE", () => {
    const input = { rangeType: REPORTED_ATTRIBUTE } as unknown as Rubric;
    expect(hasLabelLg2(input)).toBeFalsy();
  });
});
