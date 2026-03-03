import { useLocation } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import { MainMenu } from "@components/menu";

import { Menu } from "./menu";
import { useAuthorizationGuard } from "../../auth/components/auth";
import { renderWithRouter } from "../../tests/render";
import D from "../i18n/build-dictionary";

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useLocation: vi.fn(),
  };
});

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "codelists.pluralTitle": "Listes de codes",
        "partial-codelists.pluralTitle": "Listes de codes partielles",
      };
      return translations[key] || key;
    },
  }),
}));

vi.mock("../../auth/components/auth", async () => {
  const actual = await vi.importActual("../../auth/components/auth");
  return {
    ...actual,
    useAuthorizationGuard: vi.fn(),
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
    vi.mocked(useAuthorizationGuard).mockReturnValue(false);

    const { container } = renderWithRouter(<Menu />);

    expect(container.firstChild).toBeNull();
  });

  it("should render the menu with only default paths if user does not have administration privilege", () => {
    vi.mocked(useLocation).mockReturnValue({ pathname: "/codelists" } as any);
    vi.mocked(useAuthorizationGuard).mockReturnValue(false);

    const { getByText } = renderWithRouter(<Menu />);

    expect(MainMenu).toHaveBeenCalledWith(
      {
        paths: [
          {
            path: "/codelists",
            pathKey: "codelists",
            className: "active",
            attrs: { "aria-current": "page" },
            label: "Listes de codes",
            order: 1,
          },
        ],
      },
      {},
    );
    expect(getByText("MainMenu Mock")).toBeTruthy();
    expect(useAuthorizationGuard).toHaveBeenCalledWith({
      module: "CODESLIST_CODESLIST",
      privilege: "READ",
    });
  });

  it("should render the menu with additional paths if user has administration privilege", () => {
    vi.mocked(useLocation).mockReturnValue({
      pathname: "/codelists/partial",
    } as any);
    vi.mocked(useAuthorizationGuard).mockReturnValue(true);

    const { getByText } = renderWithRouter(<Menu />);

    expect(MainMenu).toHaveBeenCalledWith(
      {
        paths: [
          {
            path: "/codelists/partial",
            pathKey: "partial",
            className: "active",
            attrs: { "aria-current": "page" },
            label: "Listes de codes partielles",
            order: 2,
          },
          {
            path: "/codelists",
            pathKey: "codelists",
            className: null,
            attrs: null,
            label: "Listes de codes",
            order: 1,
          },
        ],
      },
      {},
    );
    expect(getByText("MainMenu Mock")).toBeTruthy();
    expect(useAuthorizationGuard).toHaveBeenCalledWith({
      module: "CODESLIST_CODESLIST",
      privilege: "READ",
    });
  });

  it('should apply "active" class to the correct path based on location.pathname', () => {
    vi.mocked(useLocation).mockReturnValue({ pathname: "/codelists" } as any);
    vi.mocked(useAuthorizationGuard).mockReturnValue(true);

    renderWithRouter(<Menu />);

    expect(MainMenu).toHaveBeenCalledWith(
      {
        paths: [
          {
            path: "/codelists/partial",
            pathKey: "partial",
            className: null,
            attrs: null,
            label: "Listes de codes partielles",
            order: 2,
          },
          {
            path: "/codelists",
            pathKey: "codelists",
            className: "active",
            attrs: { "aria-current": "page" },
            label: "Listes de codes",
            order: 1,
          },
        ],
      },
      {},
    );
    expect(useAuthorizationGuard).toHaveBeenCalledWith({
      module: "CODESLIST_CODESLIST",
      privilege: "READ",
    });
  });
});
