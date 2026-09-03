import { screen } from "@testing-library/react";
import { renderWithRouter } from "../../../../../tests/render";
import { Controls } from "./Controls";

vi.mock("react-i18next", async () => {
  const actual = await vi.importActual<typeof import("react-i18next")>("react-i18next");
  return {
    ...actual,
    useTranslation: () => ({
      t: (key: string) => {
        const translations: Record<string, string> = {
          "item.returnToCurrentVersion": "Back to current version",
        };
        return translations[key] ?? key;
      },
    }),
  };
});

describe("classification-item-compare-controls", () => {
  it("renders without crashing", () => {
    renderWithRouter(<Controls />);
  });

  it("renders the return button with the custom label", () => {
    renderWithRouter(<Controls />);
    expect(screen.getByText("Back to current version")).toBeInTheDocument();
  });

  it("renders the return button with an SVG icon", () => {
    const { container } = renderWithRouter(<Controls />);
    expect(container.querySelector("svg")).not.toBeNull();
  });
});
