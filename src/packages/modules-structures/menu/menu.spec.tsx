import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import { Menu } from "./menu";

const location = vi.fn();
vi.mock("react-router-dom", async () => ({
  ...(await vi.importActual<typeof import("react-router-dom")>("react-router-dom")),
  useLocation: () => location(),
}));

vi.mock("react-i18next", async () => ({
  ...(await vi.importActual<typeof import("react-i18next")>("react-i18next")),
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("@components/menu", () => ({
  MainMenu: ({ paths }: any) => (
    <ul>
      {paths.map((path: any) => (
        <li key={path.path} className={path.className ?? "inactive"}>
          {path.pathKey}
          {path.attrs?.["aria-current"] ? "|courant" : ""}
        </li>
      ))}
    </ul>
  ),
}));

const renderMenu = (pathname: string) => {
  location.mockReturnValue({ pathname });
  return render(
    <MemoryRouter>
      <Menu />
    </MemoryRouter>,
  );
};

const entry = (key: string) =>
  screen.getAllByRole("listitem").find((item) => item.textContent?.startsWith(key))!;

describe("Structures menu", () => {
  it("ne s'affiche pas sur la page d'accueil de l'application", () => {
    const { container } = renderMenu("/");

    expect(container).toBeEmptyDOMElement();
  });

  it("marque l'entrée Structures sur la liste des structures", () => {
    renderMenu("/structures");

    expect(entry("structures|courant")).toHaveClass("active");
    expect(entry("structures/components")).toHaveClass("inactive");
  });

  it("marque l'entrée la plus spécifique, pas son préfixe", () => {
    renderMenu("/structures/components/c-1");

    expect(entry("structures/components|courant")).toHaveClass("active");
    expect(entry("structures|courant")).toBeUndefined();
  });

  it("marque encore l'entrée Structures sur une structure donnée", () => {
    renderMenu("/structures/str-1");

    expect(entry("structures|courant")).toHaveClass("active");
  });

  it("ne marque rien sur un chemin étranger au module", () => {
    renderMenu("/concepts");

    expect(screen.getAllByRole("listitem").every((item) => item.className === "inactive")).toBe(
      true,
    );
  });
});
