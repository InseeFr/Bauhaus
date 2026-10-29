import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { describe, it, expect, vi } from "vitest";

import type { CategoryUsage } from "../../types/api";
import { CategoryUsersPanel } from "./CategoryUsersPanel";
import { categoryUsage as usage } from "./usages.testing";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const renderPanel = (usages: CategoryUsage[], defaultOpened = false) =>
  render(
    <MemoryRouter>
      <CategoryUsersPanel
        usages={usages}
        title="Utilisations"
        help="Les listes qui utilisent cette catégorie"
        tooltipTargetId="cat-users-help-fr.insee-cat-1"
        defaultOpened={defaultOpened}
      />
    </MemoryRouter>,
  );

describe("CategoryUsersPanel", () => {
  it("déplie le panneau au clavier, sans souris", async () => {
    renderPanel([usage()]);
    screen.getByRole("button", { name: "Utilisations" }).focus();

    expect(screen.queryByRole("link", { name: "Fichier détail" })).not.toBeInTheDocument();

    await userEvent.keyboard("{Enter}");

    await waitFor(() => {
      expect(screen.getByRole("link", { name: "Fichier détail" })).toBeInTheDocument();
    });
  });

  it("déplie aussi le panneau à la barre d'espace", async () => {
    renderPanel([usage()]);
    screen.getByRole("button", { name: "Utilisations" }).focus();

    await userEvent.keyboard(" ");

    await waitFor(() => {
      expect(screen.getByRole("link", { name: "Fichier détail" })).toBeInTheDocument();
    });
  });

  it("ignore les autres touches", async () => {
    renderPanel([usage()]);
    screen.getByRole("button", { name: "Utilisations" }).focus();

    await userEvent.keyboard("a");

    expect(screen.queryByRole("link", { name: "Fichier détail" })).not.toBeInTheDocument();
  });

  it("déplie toujours le panneau à la souris", async () => {
    renderPanel([usage()]);

    fireEvent.click(screen.getByText("Utilisations"));

    await waitFor(() => {
      expect(screen.getByRole("link", { name: "Fichier détail" })).toBeInTheDocument();
    });
  });

  it("annonce l'état replié puis déplié du panneau", async () => {
    renderPanel([usage()]);

    const toggler = screen.getByRole("button", { name: "Utilisations" });
    expect(toggler).toHaveAttribute("aria-expanded", "false");

    await userEvent.click(toggler);

    expect(toggler).toHaveAttribute("aria-expanded", "true");
  });

  it("rend la PhysicalInstance et la variable en liens vers la page de la PI", async () => {
    renderPanel([usage()], true);

    await waitFor(() => {
      expect(screen.getByRole("link", { name: "Fichier détail" })).toHaveAttribute(
        "href",
        "/ddi/physical-instances/fr.insee/pi-1",
      );
    });
    expect(screen.getByRole("link", { name: "Sexe" })).toHaveAttribute(
      "href",
      "/ddi/physical-instances/fr.insee/pi-1?variableId=var-1",
    );
  });

  it("ne rend rien quand la catégorie n'est utilisée nulle part", () => {
    renderPanel([]);

    expect(screen.queryByText("Utilisations")).not.toBeInTheDocument();
  });
});
