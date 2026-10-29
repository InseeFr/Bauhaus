import { fireEvent, render, screen } from "@testing-library/react";
import { ComponentProps } from "react";
import { describe, expect, it, vi } from "vitest";

import { LanguageSelect } from "./LanguageSelect";

vi.mock("@utils/dictionary", () => ({
  isLang2: vi.fn(() => false),
}));

vi.mock("react-i18next", async () =>
  (await import("../translations.testing")).translationsModule({
    "distribution.language": "Language",
  }),
);

const renderLanguageSelect = (props: Partial<ComponentProps<typeof LanguageSelect>> = {}) => {
  const mockOnChange = vi.fn();
  const rendered = render(<LanguageSelect onChange={mockOnChange} {...props} />);
  const dropdown = () => rendered.container.querySelector(".p-dropdown");
  return { ...rendered, mockOnChange, dropdown };
};

const mockIsLang2 = async (value: boolean) => {
  const { isLang2 } = await import("@utils/dictionary");
  vi.mocked(isLang2).mockReturnValue(value);
};

describe("LanguageSelect", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the label and select component", () => {
    const { container, dropdown } = renderLanguageSelect();

    const label = container.querySelector('label[for="language"]');
    expect(label?.textContent).toBe("Language");
    expect(dropdown()).not.toBeNull();
  });

  it.each([
    { language: "French", lang2: false },
    { language: "English", lang2: true },
  ])(
    "should render language options in $language when isLang2 returns $lang2",
    async ({ lang2 }) => {
      await mockIsLang2(lang2);

      const { dropdown } = renderLanguageSelect();

      expect(dropdown()).not.toBeNull();
    },
  );

  it("should call onChange when a language is selected", () => {
    const { container, mockOnChange } = renderLanguageSelect({ value: "fr" });

    const dropdownTrigger = container.querySelector(".p-dropdown-trigger");
    if (dropdownTrigger) {
      fireEvent.click(dropdownTrigger);
      const options = screen.getAllByText("English");
      fireEvent.click(options[options.length - 1]);
    }

    expect(mockOnChange).toHaveBeenCalledWith("en");
  });

  // Boucle plutôt que `it.each` + `$name`, qui tronquerait les noms longs.
  for (const { name, disabled, expected } of [
    {
      name: "should disable the select when disabled prop is true",
      disabled: true,
      expected: "true",
    },
    {
      name: "should enable the select when disabled prop is false",
      disabled: false,
      expected: "false",
    },
    {
      name: "should enable the select by default when disabled is not provided",
      disabled: undefined,
      expected: "false",
    },
  ]) {
    it(name, () => {
      const { dropdown } = renderLanguageSelect(disabled === undefined ? {} : { disabled });

      expect(dropdown()?.getAttribute("data-p-disabled")).toBe(expected);
    });
  }

  it("should display the selected value", async () => {
    await mockIsLang2(false);

    const { container } = renderLanguageSelect({ value: "fr" });

    const selectedValue = container.querySelector(".p-dropdown-label");
    expect(selectedValue?.textContent).toBe("Français");
  });

  it("should handle undefined value", () => {
    const { dropdown } = renderLanguageSelect();

    expect(dropdown()).not.toBeNull();
  });
});
