import { useLocation } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import { MainMenu } from "@components/menu";

import { itRendersNothingOnTheHomePage } from "../../tests/menu.testing";
import { renderWithRouter } from "../../tests/render";
import { Menu } from "./menu";

vi.mock("react-router-dom", async (importOriginal) =>
  (await import("../../tests/react-router.testing")).withMockedUseLocation(await importOriginal()),
);

vi.mock("@components/menu", () => import("../../tests/main-menu.testing"));

const activeCodelistsPaths = {
  paths: [
    {
      path: "/codelists",
      pathKey: "codelists",
      className: "active",
      attrs: { "aria-current": "page" },
      label: "Codelists",
      order: 1,
    },
  ],
};

describe("Menu", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  itRendersNothingOnTheHomePage(() => renderWithRouter(<Menu />));

  it("should render the menu with only default paths if user does not have administration privilege", () => {
    vi.mocked(useLocation).mockReturnValue({ pathname: "/codelists" } as any);

    const { getByText } = renderWithRouter(<Menu />);

    expect(MainMenu).toHaveBeenCalledWith(activeCodelistsPaths, {});
    expect(getByText("MainMenu Mock")).toBeTruthy();
  });

  it('should apply "active" class to the correct path based on location.pathname', () => {
    vi.mocked(useLocation).mockReturnValue({ pathname: "/codelists" } as any);

    renderWithRouter(<Menu />);

    expect(MainMenu).toHaveBeenCalledWith(activeCodelistsPaths, {});
  });
});
