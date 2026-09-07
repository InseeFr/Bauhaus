import { fireEvent, render, screen, within } from "@testing-library/react";

import { SummaryEntry, SummaryNav } from "./";

const entries: SummaryEntry[] = [
  { key: "general", label: "Informations générales" },
  {
    key: "notes",
    label: "Notes",
    items: [
      { key: "scope", label: "Définition courte", badge: { label: "Vide" } },
      { key: "definition", label: "Définition", badge: { label: "À corriger", tone: "danger" } },
    ],
  },
  { key: "links", label: "Liens", badge: { label: "2" } },
];

const renderNav = (props: Partial<React.ComponentProps<typeof SummaryNav>> = {}) => {
  const onSelect = vi.fn();
  render(<SummaryNav label="Sommaire" entries={entries} onSelect={onSelect} {...props} />);
  return { onSelect };
};

const nav = () => screen.getByRole("navigation", { name: "Sommaire" });
const entry = (name: RegExp | string) => within(nav()).getByRole("button", { name });

describe("summary-nav", () => {
  it("liste les entrées et leurs sous-entrées dans l'ordre", () => {
    renderNav();

    expect(
      within(nav())
        .getAllByRole("button")
        .map((button) => button.textContent),
    ).toEqual([
      "Informations générales",
      "Notes",
      "Définition courteVide",
      "DéfinitionÀ corriger",
      "Liens2",
    ]);
  });

  it("remonte l'entrée choisie", () => {
    const { onSelect } = renderNav();

    fireEvent.click(entry(/Définition courte/));

    expect(onSelect).toHaveBeenCalledWith("scope");
  });

  it("remonte aussi une entrée de premier niveau", () => {
    const { onSelect } = renderNav();

    fireEvent.click(entry("Notes"));

    expect(onSelect).toHaveBeenCalledWith("notes");
  });

  it("marque les entrées actives, de chaque niveau", () => {
    renderNav({ activeKeys: ["notes", "definition"] });

    expect(entry("Notes")).toHaveAttribute("aria-current", "true");
    expect(entry("Définition À corriger")).toHaveAttribute("aria-current", "true");
    expect(entry("Définition courte Vide")).not.toHaveAttribute("aria-current");
    expect(entry("Informations générales")).not.toHaveAttribute("aria-current");
  });

  it("ne marque rien quand aucune entrée n'est active", () => {
    renderNav();

    expect(within(nav()).queryByRole("button", { current: true })).not.toBeInTheDocument();
  });

  it("distingue les niveaux de gravité d'un badge", () => {
    renderNav();

    expect(screen.getByText("À corriger").className).toContain("danger");
    expect(screen.getByText("Vide").className).not.toContain("danger");
  });
});
