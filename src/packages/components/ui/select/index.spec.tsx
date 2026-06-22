import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Select } from "./";

vi.mock("primereact/dropdown", () => ({
  Dropdown: ({ value, onChange, placeholder }: any) => (
    <select
      data-testid="dropdown"
      value={value ?? ""}
      onChange={(e) => onChange({ value: e.target.value })}
    >
      <option value="">{placeholder}</option>
      <option value="a">A</option>
      <option value="b">B</option>
    </select>
  ),
}));

vi.mock("primereact/multiselect", () => ({
  MultiSelect: ({ value, onChange, placeholder }: any) => (
    <select
      data-testid="multiselect"
      multiple
      value={value ?? []}
      onChange={(e) =>
        onChange({
          value: Array.from(e.target.selectedOptions).map((o) => (o as HTMLOptionElement).value),
        })
      }
    >
      <option value="">{placeholder}</option>
      <option value="a">A</option>
      <option value="b">B</option>
    </select>
  ),
}));

const baseProps = {
  label: "Creator",
  placeholder: "Select…",
  options: [
    { value: "a", label: "A" },
    { value: "b", label: "B" },
  ],
  value: "a",
  onChange: vi.fn(),
};

describe("Select", () => {
  it("wraps the control inside the label so they are associated", () => {
    render(<Select {...baseProps} />);

    const label = screen.getByText("Creator").closest("label");
    expect(label).not.toBeNull();
    expect(label).toContainElement(screen.getByTestId("dropdown"));
  });

  it("applies w-100 to the label", () => {
    render(<Select {...baseProps} />);

    const label = screen.getByText("Creator").closest("label");
    expect(label).toHaveClass("w-100");
  });

  it("does not mark the label as required by default", () => {
    render(<Select {...baseProps} />);

    const label = screen.getByText("Creator").closest("label");
    expect(label).not.toHaveClass("label-required");
    expect(label?.querySelector(".asterisk")).toBeNull();
  });

  it("marks the label as required and shows an asterisk when required", () => {
    render(<Select {...baseProps} required />);

    const label = screen.getByText("Creator").closest("label");
    expect(label).toHaveClass("label-required");
    expect(label?.querySelector(".asterisk")).not.toBeNull();
  });

  it("renders a Dropdown in single mode", () => {
    render(<Select {...baseProps} />);

    expect(screen.getByTestId("dropdown")).toBeInTheDocument();
    expect(screen.queryByTestId("multiselect")).toBeNull();
  });

  it("renders a MultiSelect in multi mode", () => {
    render(<Select {...baseProps} value={["a"]} multi />);

    expect(screen.getByTestId("multiselect")).toBeInTheDocument();
    expect(screen.queryByTestId("dropdown")).toBeNull();
  });

  it("propagates the selected value via onChange", () => {
    const onChange = vi.fn();
    render(<Select {...baseProps} onChange={onChange} />);

    fireEvent.change(screen.getByTestId("dropdown"), { target: { value: "b" } });
    expect(onChange).toHaveBeenCalledWith("b");
  });
});
