import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";

import { DatePicker } from "./index";

vi.mock("primereact/calendar", () => ({
  Calendar: ({ value, onChange }: any) => {
    return (
      <input
        data-testid="mock-calendar"
        type="date"
        value={value ? value.toISOString().substring(0, 10) : ""}
        onChange={(e) => {
          const inputValue = e.target.value;
          if (!inputValue) {
            onChange?.({ value: null });
            return;
          }
          const date = new Date(inputValue);
          onChange?.({ value: date });
        }}
      />
    );
  },
}));

describe("DatePicker", () => {
  let onChange: Mock<(value?: string) => void>;

  beforeEach(() => {
    onChange = vi.fn<(value?: string) => void>();
  });

  it("should display the initial date value correctly", () => {
    render(<DatePicker value="2025-04-03T00:00:00.000Z" onChange={onChange} />);
    const input = screen.getByTestId("mock-calendar");
    expect(input).toHaveValue("2025-04-03");
  });

  it("should call onChange with UTC ISO string when a new date is selected", async () => {
    render(<DatePicker value="" onChange={onChange} />);
    const input = screen.getByTestId("mock-calendar");

    await userEvent.clear(input);
    await userEvent.type(input, "2025-04-01");
    await userEvent.tab(); // Triggers blur

    expect(onChange).toHaveBeenCalledWith("2025-04-01T00:00:00.000Z");
  });

  it("should call onChange with undefined when the input is cleared", async () => {
    render(<DatePicker value="2025-04-03T00:00:00.000Z" onChange={onChange} />);
    const input = screen.getByTestId("mock-calendar");

    await userEvent.clear(input);
    await userEvent.tab();

    expect(onChange).toHaveBeenCalledWith();
  });
});
