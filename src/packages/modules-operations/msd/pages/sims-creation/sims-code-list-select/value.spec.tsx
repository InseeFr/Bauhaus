import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { SimsCodeListSelect } from "./index";

const selectSpy = vi.fn();

vi.mock("@components/select-rmes", () => ({
  Select: (props: any) => {
    selectSpy(props);
    return <div data-testid="select-stub" />;
  },
}));

const options = [
  { value: "option1", label: "Option 1" },
  { value: "option2", label: "Option 2" },
];

const lastValue = () => selectSpy.mock.calls.at(-1)?.[0].value;

describe("SimsCodeListSelect - value normalisation (multi)", () => {
  it("passes an empty array when currentSection.value is undefined", () => {
    selectSpy.mockClear();
    render(
      <SimsCodeListSelect
        multi
        currentSection={{ value: undefined }}
        options={options}
        onChange={vi.fn()}
      />,
    );
    expect(lastValue()).toEqual([]);
  });

  it("passes an empty array when currentSection.value is null", () => {
    selectSpy.mockClear();
    render(
      <SimsCodeListSelect
        multi
        currentSection={{ value: null }}
        options={options}
        onChange={vi.fn()}
      />,
    );
    expect(lastValue()).toEqual([]);
  });

  it("passes an empty array when currentSection.value is an empty string", () => {
    selectSpy.mockClear();
    render(
      <SimsCodeListSelect
        multi
        currentSection={{ value: "" }}
        options={options}
        onChange={vi.fn()}
      />,
    );
    expect(lastValue()).toEqual([]);
  });

  it("wraps a defined non-array value into an array", () => {
    selectSpy.mockClear();
    render(
      <SimsCodeListSelect
        multi
        currentSection={{ value: "option1" }}
        options={options}
        onChange={vi.fn()}
      />,
    );
    expect(lastValue()).toEqual(["option1"]);
  });

  it("keeps an array value untouched", () => {
    selectSpy.mockClear();
    render(
      <SimsCodeListSelect
        multi
        currentSection={{ value: ["option1", "option2"] }}
        options={options}
        onChange={vi.fn()}
      />,
    );
    expect(lastValue()).toEqual(["option1", "option2"]);
  });
});
