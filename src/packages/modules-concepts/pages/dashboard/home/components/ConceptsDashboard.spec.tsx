import { fireEvent, screen, within } from "@testing-library/react";

import { renderWithRouter } from "../../../../../tests/render";
import { ConceptsDashboard } from "./ConceptsDashboard";

const render = (initialEntries: string[] = ["/"]) =>
  renderWithRouter(<ConceptsDashboard conceptsData={[]} collectionsData={[]} />, initialEntries);

const nav = () => screen.getByRole("navigation", { name: "Concepts dashboard" });
const entries = () => within(nav()).getAllByRole("button");
const entry = (name: string) => within(nav()).getByRole("button", { name });

describe("dashboard-home", () => {
  it("liste les onglets et leurs vues dans un sommaire unique", () => {
    render();

    expect(entries().map((button) => button.textContent)).toEqual([
      "Concepts",
      "Summary",
      "Creation list",
      "Modification list",
      "Collections",
      "Summary",
      "Creation list",
      "Modification list",
    ]);
  });

  it("affiche le récapitulatif des concepts par défaut", () => {
    render();

    expect(screen.getByText(/State of the concepts repository at/)).toBeInTheDocument();
    expect(screen.queryByText(/State of the collections repository at/)).not.toBeInTheDocument();
  });

  it("affiche la vue choisie dans le sommaire", () => {
    render();

    fireEvent.click(entries()[5]);

    expect(screen.getByText(/State of the collections repository at/)).toBeInTheDocument();
    expect(screen.queryByText(/State of the concepts repository at/)).not.toBeInTheDocument();
  });

  it("marque l'onglet et la vue courants", () => {
    render();

    fireEvent.click(entries()[6]);

    expect(entry("Collections")).toHaveAttribute("aria-current", "true");
    expect(entries()[6]).toHaveAttribute("aria-current", "true");
    expect(entry("Concepts")).not.toHaveAttribute("aria-current");
  });

  it("ouvre la vue retenue dans l'URL", () => {
    render(["/?section=collections-creations"]);

    expect(screen.getByRole("columnheader", { name: "Collections" })).toBeInTheDocument();
    expect(entry("Collections")).toHaveAttribute("aria-current", "true");
  });

  it("n'affiche pas de bouton de retour vers la page elle-même", () => {
    render();

    expect(screen.queryByRole("link", { name: "Back" })).not.toBeInTheDocument();
  });

  it("n'imbrique plus d'onglets", () => {
    const { container } = render();

    expect(container.querySelector(".p-tabview")).toBeNull();
    expect(container.querySelector(".p-selectbutton")).toBeNull();
  });
});
