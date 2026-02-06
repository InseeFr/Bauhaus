import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { CompressFormatInput } from "./compress-format-input";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "distribution.compressFormat": "Compress format",
      };
      return translations[key] || key;
    },
  }),
}));

describe("CompressFormatInput", () => {
  it("should render the component with label", () => {
    const mockOnChange = vi.fn();

    render(<CompressFormatInput value="" onChange={mockOnChange} />);

    expect(screen.getByText("Compress format")).not.toBeNull();
  });

  it("should render input with correct id", () => {
    const mockOnChange = vi.fn();

    render(<CompressFormatInput value="" onChange={mockOnChange} />);

    const input = screen.getByLabelText("Compress format");
    expect(input).not.toBeNull();
    expect(input.id).toBe("compressFormat");
  });

  it("should render datalist with correct options", () => {
    const mockOnChange = vi.fn();

    const { container } = render(<CompressFormatInput value="" onChange={mockOnChange} />);

    const datalist = container.querySelector("#compressFormat-list");
    expect(datalist).not.toBeNull();

    const options = datalist?.querySelectorAll("option");
    expect(options?.length).toBe(3);
    expect(options?.[0].value).toBe("7Z");
    expect(options?.[1].value).toBe("TAR GZ");
    expect(options?.[2].value).toBe("ZIP");
  });

  it("should display the value", () => {
    const mockOnChange = vi.fn();

    render(<CompressFormatInput value="ZIP" onChange={mockOnChange} />);

    const input = screen.getByLabelText("Compress format") as HTMLInputElement;
    expect(input.value).toBe("ZIP");
  });

  it("should call onChange when value changes", () => {
    const mockOnChange = vi.fn();

    render(<CompressFormatInput value="" onChange={mockOnChange} />);

    const input = screen.getByLabelText("Compress format");
    fireEvent.change(input, { target: { value: "7Z" } });

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith("7Z");
  });

  it("should link input to datalist", () => {
    const mockOnChange = vi.fn();

    render(<CompressFormatInput value="" onChange={mockOnChange} />);

    const input = screen.getByLabelText("Compress format") as HTMLInputElement;
    expect(input.getAttribute("list")).toBe("compressFormat-list");
  });
});
