import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { ByteSizeInput } from "./byte-size-input";

describe("ByteSizeInput", () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the label and input with correct initial value", () => {
    render(<ByteSizeInput value="1024" onChange={mockOnChange} />);

    expect(screen.getByLabelText("Size")).not.toBeNull();
    expect(screen.getByDisplayValue("1024")).not.toBeNull();
  });

  it("should call onChange with updated byteSize when input changes", () => {
    render(<ByteSizeInput value="1024" onChange={mockOnChange} />);

    const input = screen.getByLabelText("Size");
    fireEvent.change(input, { target: { value: "2048" } });

    expect(mockOnChange).toHaveBeenCalledWith("2048");
  });

  it("should update input value when value prop changes", () => {
    const { rerender } = render(<ByteSizeInput value="1024" onChange={mockOnChange} />);

    expect(screen.getByDisplayValue("1024")).not.toBeNull();

    rerender(<ByteSizeInput value="4096" onChange={mockOnChange} />);

    expect(screen.getByDisplayValue("4096")).not.toBeNull();
  });
});
