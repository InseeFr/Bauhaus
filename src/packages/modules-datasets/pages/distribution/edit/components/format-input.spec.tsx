import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { FormatInput } from "./format-input";

vi.mock("../../../../../deprecated-locales", () => ({
  D1: {
    formatTitle: "Format",
  },
}));

describe("FormatInput", () => {
  it("should render the component with label", () => {
    const mockOnChange = vi.fn();

    render(<FormatInput value="" onChange={mockOnChange} />);

    expect(screen.getByText("Format")).not.toBeNull();
  });

  it("should render input with correct id", () => {
    const mockOnChange = vi.fn();

    render(<FormatInput value="" onChange={mockOnChange} />);

    const input = screen.getByLabelText("Format");
    expect(input).not.toBeNull();
    expect(input.id).toBe("format");
  });

  it("should render datalist with correct options", () => {
    const mockOnChange = vi.fn();

    const { container } = render(<FormatInput value="" onChange={mockOnChange} />);

    const datalist = container.querySelector("#format-list");
    expect(datalist).not.toBeNull();

    const options = datalist?.querySelectorAll("option");
    expect(options?.length).toBe(2);
    expect(options?.[0].value).toBe("CSV");
    expect(options?.[1].value).toBe("PARQUET");
  });

  it("should display the value", () => {
    const mockOnChange = vi.fn();

    render(<FormatInput value="CSV" onChange={mockOnChange} />);

    const input = screen.getByLabelText("Format") as HTMLInputElement;
    expect(input.value).toBe("CSV");
  });

  it("should call onChange when value changes", () => {
    const mockOnChange = vi.fn();

    render(<FormatInput value="" onChange={mockOnChange} />);

    const input = screen.getByLabelText("Format");
    fireEvent.change(input, { target: { value: "PARQUET" } });

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith("PARQUET");
  });

  it("should link input to datalist", () => {
    const mockOnChange = vi.fn();

    render(<FormatInput value="" onChange={mockOnChange} />);

    const input = screen.getByLabelText("Format") as HTMLInputElement;
    expect(input.getAttribute("list")).toBe("format-list");
  });
});
