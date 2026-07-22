import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import { MainMenu } from "@components/menu";

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
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should not render anything if the path is "/"', () => {
    vi.mocked(useLocation).mockReturnValue({ pathname: "/" } as any);

    const { container } = renderWithRouter(<Menu />);

    expect(container.firstChild).toBeNull();
  });

  it("should render the menu with paths, and highlight the active path", () => {
    vi.mocked(useLocation).mockReturnValue({
      pathname: "/classifications/families",
    } as any);

    renderWithRouter(<Menu />);

    expect(MainMenu).toHaveBeenCalledWith(
      {
        paths: [
          {
            path: "/classifications/families",
            pathKey: "classifications/famil",
            className: "active",
            attrs: { "aria-current": "page" },
            label: "Familles",
            order: 0,
          },
          {
            path: "/classifications/series",
            pathKey: "classifications/series",
            className: null,
            attrs: null,
            label: "Séries",
            order: 1,
          },
          {
            path: "/classifications/correspondences",
            pathKey: "classifications/correspondence",
            className: null,
            attrs: null,
            label: "Tables de correspondances",
            order: 3,
          },
          {
            path: "/classifications",
            pathKey: "classification",
            className: null,
            attrs: null,
            label: "Nomenclatures",
            order: 2,
          },
        ],
      },
      {},
    );
  });

  it("should mark the correct path as active based on location.pathname", () => {
    vi.mocked(useLocation).mockReturnValue({
      pathname: "/classifications/series",
    } as any);

    renderWithRouter(<Menu />);

    expect(MainMenu).toHaveBeenCalledWith(
      {
        paths: [
          {
            path: "/classifications/families",
            pathKey: "classifications/famil",
            className: null,
            attrs: null,
            label: "Familles",
            order: 0,
          },
          {
            path: "/classifications/series",
            pathKey: "classifications/series",
            className: "active",
            attrs: { "aria-current": "page" },
            label: "Séries",
            order: 1,
          },
          {
            path: "/classifications/correspondences",
            pathKey: "classifications/correspondence",
            className: null,
            attrs: null,
            label: "Tables de correspondances",
            order: 3,
          },
          {
            path: "/classifications",
            pathKey: "classification",
            className: null,
            attrs: null,
            label: "Nomenclatures",
            order: 2,
          },
        ],
      },
      {},
    );
  });

  it('should apply "active" to the root classification path if no specific path matches', () => {
    vi.mocked(useLocation).mockReturnValue({
      pathname: "/classifications",
    } as any);

    renderWithRouter(<Menu />);

    expect(MainMenu).toHaveBeenCalledWith(
      {
        paths: [
          {
            path: "/classifications/families",
            pathKey: "classifications/famil",
            className: null,
            attrs: null,
            label: "Familles",
            order: 0,
          },
          {
            path: "/classifications/series",
            pathKey: "classifications/series",
            className: null,
            attrs: null,
            label: "Séries",
            order: 1,
          },
          {
            path: "/classifications/correspondences",
            pathKey: "classifications/correspondence",
            className: null,
            attrs: null,
            label: "Tables de correspondances",
            order: 3,
          },
          {
            path: "/classifications",
            pathKey: "classification",
            className: "active",
            attrs: { "aria-current": "page" },
            label: "Nomenclatures",
            order: 2,
          },
        ],
      },
      {},
    );
  });
});
