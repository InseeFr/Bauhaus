import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { MediaTypeInput } from "./media-type-input";

// vi.mock("../../../../../deprecated-locales/build-dictionary", () => ({
//   default: {
//     mediaTypeTitle: "Media Type",
//   },
// }));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "distribution.mediaType": "Media type",
      };
      return translations[key] || key;
    },
  }),
}));

describe("MediaTypeInput", () => {
  it("should render the component with label", () => {
    const mockOnChange = vi.fn();

    render(<MediaTypeInput value="" onChange={mockOnChange} />);

    expect(screen.getByText("Media type")).not.toBeNull();
  });

  it("should render input with correct id", () => {
    const mockOnChange = vi.fn();

    render(<MediaTypeInput value="" onChange={mockOnChange} />);

    const input = screen.getByLabelText("Media type");
    expect(input).not.toBeNull();
    expect(input.id).toBe("mediaType");
  });

  it("should render datalist with correct options", () => {
    const mockOnChange = vi.fn();

    const { container } = render(<MediaTypeInput value="" onChange={mockOnChange} />);

    const datalist = container.querySelector("#mediaType-list");
    expect(datalist).not.toBeNull();

    const options = datalist?.querySelectorAll("option");
    expect(options?.length).toBe(3);
    expect(options?.[0].value).toBe("CSV");
    expect(options?.[1].value).toBe("PARQUET");
    expect(options?.[2].value).toBe("XSLX");
  });

  it("should display the value", () => {
    const mockOnChange = vi.fn();

    render(<MediaTypeInput value="CSV" onChange={mockOnChange} />);

    const input = screen.getByLabelText("Media type") as HTMLInputElement;
    expect(input.value).toBe("CSV");
  });

  it("should call onChange when value changes", () => {
    const mockOnChange = vi.fn();

    render(<MediaTypeInput value="" onChange={mockOnChange} />);

    const input = screen.getByLabelText("Media type");
    fireEvent.change(input, { target: { value: "PARQUET" } });

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith("PARQUET");
  });

  it("should link input to datalist", () => {
    const mockOnChange = vi.fn();

    render(<MediaTypeInput value="" onChange={mockOnChange} />);

    const input = screen.getByLabelText("Media type") as HTMLInputElement;
    expect(input.getAttribute("list")).toBe("mediaType-list");
  });
});
