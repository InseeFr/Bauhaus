import { render } from "@testing-library/react";

import { OperationsLink } from "@model/operations/operations-link";

import { renderWithRouter } from "../../tests/render";
import { SeeAlso } from "./SeeAlso";

const linkedItems = [{ id: 1, label: "indicators" }] as unknown as OperationsLink[];

const noLinks = {};
const indicatorLinks = { indicator: linkedItems };
const seriesLinks = { series: linkedItems };
const familyLinks = { family: linkedItems };
const operationLinks = { operation: linkedItems };

describe("SeeAlso", () => {
  it("should display one Note if the second lang is not selected", () => {
    const { container } = render(<SeeAlso links={noLinks} />);
    expect(container.querySelector(".note")).toBeDefined();
  });
  it("should display two Note if the second lang is selected", () => {
    const { container } = render(<SeeAlso links={noLinks} secondLang />);
    expect(container.querySelectorAll(".note")).toHaveLength(2);
  });
  it("should display indicators", () => {
    const { container } = renderWithRouter(<SeeAlso links={indicatorLinks} />);
    expect(container.innerHTML).toContain('href="/operations/indicator/1"');
  });
  it("should display series", () => {
    const { container } = renderWithRouter(<SeeAlso links={seriesLinks} />);
    expect(container.innerHTML).toContain('href="/operations/series/1"');
  });
  it("should display families", () => {
    const { container } = renderWithRouter(<SeeAlso links={familyLinks} />);
    expect(container.innerHTML).toContain('href="/operations/family/1"');
  });
  it("should display operations", () => {
    const { container } = renderWithRouter(<SeeAlso links={operationLinks} />);
    expect(container.innerHTML).toContain('href="/operations/operation/1"');
  });
});
