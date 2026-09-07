import { fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import { LayoutConfiguration, LayoutWithLateralMenu } from "./LayoutWithLateralMenu";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => (key === "dataset.toFix" ? "À corriger" : key),
  }),
}));

const layoutConfiguration = {
  globalInformation: { title: "Informations générales", hasError: false },
  internalManagement: { title: "Gestion interne", hasError: true },
  notes: { title: "Notes" },
} as unknown as LayoutConfiguration;

const Search = () => <span data-testid="search">{useLocation().search}</span>;

const renderLayout = (url = "/datasets/create") => {
  const children = vi.fn((key: string) => <div>{`Contenu de ${key}`}</div>);
  render(
    <MemoryRouter initialEntries={[url]}>
      <LayoutWithLateralMenu layoutConfiguration={layoutConfiguration}>
        {children}
      </LayoutWithLateralMenu>
      <Search />
    </MemoryRouter>,
  );
  return { children };
};

const nav = () => screen.getByRole("navigation");
const entry = (name: RegExp | string) => within(nav()).getByRole("button", { name });

describe("LayoutWithLateralMenu", () => {
  it("liste les parties du formulaire sur un seul niveau", () => {
    renderLayout();

    expect(
      within(nav())
        .getAllByRole("button")
        .map((button) => button.textContent),
    ).toEqual(["Informations générales", "Gestion interneÀ corriger", "Notes"]);
  });

  it("n'imbrique pas les entrées du sommaire", () => {
    renderLayout();

    expect(within(nav()).queryByRole("list")?.querySelector("ul")).toBeFalsy();
  });

  it("affiche la première partie au départ", () => {
    renderLayout();

    expect(screen.getByText("Contenu de globalInformation")).toBeInTheDocument();
  });

  it("affiche la partie choisie", () => {
    renderLayout();

    fireEvent.click(entry(/Gestion interne/));

    expect(screen.getByText("Contenu de internalManagement")).toBeInTheDocument();
    expect(screen.queryByText("Contenu de globalInformation")).not.toBeInTheDocument();
  });

  it("affiche le titre de la partie courante", () => {
    renderLayout();

    fireEvent.click(entry(/Gestion interne/));

    expect(screen.getByRole("heading", { name: "Gestion interne" })).toBeInTheDocument();
  });

  it("marque la partie affichée", () => {
    renderLayout();

    fireEvent.click(entry(/Gestion interne/));

    expect(entry(/Gestion interne/)).toHaveAttribute("aria-current", "true");
    expect(entry("Informations générales")).not.toHaveAttribute("aria-current");
  });

  it("signale par un badge une partie en erreur", () => {
    renderLayout();

    expect(entry(/Gestion interne/).textContent).toContain("À corriger");
  });

  describe("mémoire de la partie affichée", () => {
    it("ouvre la partie indiquée par l'URL", () => {
      renderLayout("/datasets/create?section=notes");

      expect(screen.getByText("Contenu de notes")).toBeInTheDocument();
    });

    it("écrit dans l'URL la partie choisie", () => {
      renderLayout();

      fireEvent.click(entry(/Gestion interne/));

      expect(screen.getByTestId("search")).toHaveTextContent("section=internalManagement");
    });

    it("ignore une partie inconnue et ouvre la première", () => {
      renderLayout("/datasets/create?section=inexistante");

      expect(screen.getByText("Contenu de globalInformation")).toBeInTheDocument();
    });
  });
});
