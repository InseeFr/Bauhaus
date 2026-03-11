import { useLocation } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import { MainMenu } from "@components/menu";

import { Menu } from "./menu";
import { renderWithRouter } from "../../tests/render";

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useLocation: vi.fn(),
  };
});

vi.mock("@components/menu", () => ({
  MainMenu: vi.fn(() => <div>MainMenu Mock</div>),
}));

describe("Menu", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not render anything if the path is "/"', () => {
    vi.mocked(useLocation).mockReturnValue({ pathname: "/" } as any);

    const { container } = renderWithRouter(<Menu />);

    expect(container.firstChild).toBeNull();
  });

  it("should render the menu with only default paths if user does not have administration privilege", () => {
    vi.mocked(useLocation).mockReturnValue({ pathname: "/codelists" } as any);

    const { getByText } = renderWithRouter(<Menu />);

    expect(MainMenu).toHaveBeenCalledWith(
      {
        paths: [
          {
            path: "/codelists",
            pathKey: "codelists",
            className: "active",
            attrs: { "aria-current": "page" },
            label: "codelists.pluralTitle",
            order: 1,
          },
        ],
      },
      {},
    );
    expect(getByText("MainMenu Mock")).toBeTruthy();
  });

  it('should apply "active" class to the correct path based on location.pathname', () => {
    vi.mocked(useLocation).mockReturnValue({ pathname: "/codelists" } as any);

    renderWithRouter(<Menu />);

    expect(MainMenu).toHaveBeenCalledWith(
      {
        paths: [
          {
            path: "/codelists",
            pathKey: "codelists",
            className: "active",
            attrs: { "aria-current": "page" },
            label: "codelists.pluralTitle",
            order: 1,
          },
        ],
      },
      {},
    );
  });
});
