import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import { MainMenu } from "@components/menu";

import { itRendersNothingOnTheHomePage } from "../../tests/menu.testing";
import { Menu } from "./menu";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "family.pluralTitle": "Familles",
        "serie.pluralTitle": "Séries",
        "correspondence.pluralTitle": "Tables de correspondances",
        "classification.pluralTitle": "Nomenclatures",
      };
      return translations[key] ?? key;
    },
  }),
}));

const renderWithRouter = (ui: React.ReactElement, pathname = "/") =>
  render(<MemoryRouter initialEntries={[pathname]}>{ui}</MemoryRouter>);

vi.mock("react-router-dom", async (importOriginal) =>
  (await import("../../tests/react-router.testing")).withMockedUseLocation(await importOriginal()),
);

vi.mock("@components/menu", () => import("../../tests/main-menu.testing"));

const menuPaths = [
  {
    path: "/classifications/families",
    pathKey: "classifications/famil",
    label: "Familles",
    order: 0,
  },
  { path: "/classifications/series", pathKey: "classifications/series", label: "Séries", order: 1 },
  {
    path: "/classifications/correspondences",
    pathKey: "classifications/correspondence",
    label: "Tables de correspondances",
    order: 3,
  },
  { path: "/classifications", pathKey: "classification", label: "Nomenclatures", order: 2 },
];

const expectMenuWithActivePath = (activePath: string) =>
  expect(MainMenu).toHaveBeenCalledWith(
    {
      paths: menuPaths.map((menuPath) => {
        const active = menuPath.path === activePath;
        return {
          ...menuPath,
          className: active ? "active" : null,
          attrs: active ? { "aria-current": "page" } : null,
        };
      }),
    },
    {},
  );

describe("Menu", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  itRendersNothingOnTheHomePage(() => renderWithRouter(<Menu />));

  it("should render the menu with paths, and highlight the active path", () => {
    vi.mocked(useLocation).mockReturnValue({
      pathname: "/classifications/families",
    } as any);

    renderWithRouter(<Menu />);

    expectMenuWithActivePath("/classifications/families");
  });

  it("should mark the correct path as active based on location.pathname", () => {
    vi.mocked(useLocation).mockReturnValue({
      pathname: "/classifications/series",
    } as any);

    renderWithRouter(<Menu />);

    expectMenuWithActivePath("/classifications/series");
  });

  it('should apply "active" to the root classification path if no specific path matches', () => {
    vi.mocked(useLocation).mockReturnValue({
      pathname: "/classifications",
    } as any);

    renderWithRouter(<Menu />);

    expectMenuWithActivePath("/classifications");
  });
});
