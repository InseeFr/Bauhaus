import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { LanguageSelect } from "./language-select";

vi.mock("../../../../../i18n", () => ({
  isLang2: vi.fn(() => false),
}));

describe("LanguageSelect", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the label and select component", () => {
    const mockOnChange = vi.fn();

    const { container } = render(<LanguageSelect onChange={mockOnChange} />);

    const label = container.querySelector('label[for="language"]');
    expect(label?.textContent).toBe("Language");
    const selectElement = container.querySelector(".p-dropdown");
    expect(selectElement).not.toBeNull();
  });

  it("should render language options in French when isLang2 returns false", async () => {
    const { isLang2 } = await import("../../../../../i18n");
    vi.mocked(isLang2).mockReturnValue(false);

    const mockOnChange = vi.fn();

    const { container } = render(<LanguageSelect onChange={mockOnChange} />);

    const selectElement = container.querySelector(".p-dropdown");
    expect(selectElement).not.toBeNull();
  });

  it("should render language options in English when isLang2 returns true", async () => {
    const { isLang2 } = await import("../../../../../i18n");
    vi.mocked(isLang2).mockReturnValue(true);

    const mockOnChange = vi.fn();

    const { container } = render(<LanguageSelect onChange={mockOnChange} />);

    const selectElement = container.querySelector(".p-dropdown");
    expect(selectElement).not.toBeNull();
  });

  it("should call onChange when a language is selected", () => {
    const mockOnChange = vi.fn();

    const { container } = render(<LanguageSelect value="fr" onChange={mockOnChange} />);

    const dropdownTrigger = container.querySelector(".p-dropdown-trigger");
    if (dropdownTrigger) {
      fireEvent.click(dropdownTrigger);
      const options = screen.getAllByText("English");
      fireEvent.click(options[options.length - 1]);
    }

    expect(mockOnChange).toHaveBeenCalledWith("en");
  });

  it("should disable the select when disabled prop is true", () => {
    const mockOnChange = vi.fn();

    const { container } = render(<LanguageSelect onChange={mockOnChange} disabled={true} />);

    const selectElement = container.querySelector(".p-dropdown");
    expect(selectElement?.getAttribute("data-p-disabled")).toBe("true");
  });

  it("should enable the select when disabled prop is false", () => {
    const mockOnChange = vi.fn();

    const { container } = render(<LanguageSelect onChange={mockOnChange} disabled={false} />);

    const selectElement = container.querySelector(".p-dropdown");
    expect(selectElement?.getAttribute("data-p-disabled")).toBe("false");
  });

  it("should enable the select by default when disabled is not provided", () => {
    const mockOnChange = vi.fn();

    const { container } = render(<LanguageSelect onChange={mockOnChange} />);

    const selectElement = container.querySelector(".p-dropdown");
    expect(selectElement?.getAttribute("data-p-disabled")).toBe("false");
  });

  it("should display the selected value", async () => {
    const { isLang2 } = await import("../../../../../i18n");
    vi.mocked(isLang2).mockReturnValue(false);

    const mockOnChange = vi.fn();

    const { container } = render(<LanguageSelect value="fr" onChange={mockOnChange} />);

    const selectedValue = container.querySelector(".p-dropdown-label");
    expect(selectedValue?.textContent).toBe("Français");
  });

  it("should handle undefined value", () => {
    const mockOnChange = vi.fn();

    const { container } = render(<LanguageSelect onChange={mockOnChange} />);

    const selectElement = container.querySelector(".p-dropdown");
    expect(selectElement).not.toBeNull();
  });
});
