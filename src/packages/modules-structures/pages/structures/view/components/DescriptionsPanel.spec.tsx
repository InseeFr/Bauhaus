import { render, screen } from "@testing-library/react";
import { Mock, vi } from "vitest";

import { useSecondLang } from "@utils/hooks/second-lang";

import { DescriptionsPanel } from "./DescriptionsPanel";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "structure.description": "Description",
      };
      return translations[key] ?? key;
    },
  }),
}));

vi.mock("@utils/hooks/second-lang", () => ({
  useSecondLang: vi.fn(),
}));

describe("DescriptionsPanel", () => {
  const mockDescriptionLg1 = "Description in first language";
  const mockDescriptionLg2 = "Description in second language";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should display the first language description when secondLang is false", () => {
    (useSecondLang as Mock).mockReturnValue([false]);

    render(
      <DescriptionsPanel descriptionLg1={mockDescriptionLg1} descriptionLg2={mockDescriptionLg2} />,
    );

    const titleLg1 = screen.getByText("Description");
    const descriptionLg1 = screen.getByText(mockDescriptionLg1);

    expect(titleLg1.innerHTML).toContain("Description");
    expect(descriptionLg1.innerHTML).toContain(mockDescriptionLg1);

    expect(screen.queryByText(mockDescriptionLg2)).toBeNull();
  });

  it("should display both descriptions when secondLang is true", () => {
    (useSecondLang as Mock).mockReturnValue([true]);

    render(
      <DescriptionsPanel descriptionLg1={mockDescriptionLg1} descriptionLg2={mockDescriptionLg2} />,
    );

    screen.getByText(mockDescriptionLg1);
    screen.getByText(mockDescriptionLg2);
  });
});
