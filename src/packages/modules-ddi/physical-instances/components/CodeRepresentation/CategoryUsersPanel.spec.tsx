import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";

import { CategoryUsersPanel } from "./CategoryUsersPanel";
import type { CategoryUsage } from "../../types/api";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const usage = (overrides: Partial<CategoryUsage> = {}): CategoryUsage => ({
  group: { agencyId: "fr.insee", id: "grp-1", label: "Recensement" },
  studyUnit: { agencyId: "fr.insee", id: "su-1", label: "Recensement 2024" },
  physicalInstance: { agencyId: "fr.insee", id: "pi-1", label: "Fichier détail" },
  variable: { agencyId: "fr.insee", id: "var-1", label: "Sexe" },
  codeList: { agencyId: "fr.insee", id: "cl-1", label: "Liste des sexes" },
  ...overrides,
});

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

    expect(screen.queryByRole("link", { name: "Fichier détail" })).not.toBeInTheDocument();

    fireEvent.keyDown(screen.getByRole("button", { name: /Utilisations/ }), { key: "Enter" });

    await waitFor(() => {
      expect(screen.getByRole("link", { name: "Fichier détail" })).toBeInTheDocument();
    });
  });

  it("déplie aussi le panneau à la barre d'espace", async () => {
    renderPanel([usage()]);

    fireEvent.keyDown(screen.getByRole("button", { name: /Utilisations/ }), { key: " " });

    await waitFor(() => {
      expect(screen.getByRole("link", { name: "Fichier détail" })).toBeInTheDocument();
    });
  });

  it("ignore les autres touches", () => {
    renderPanel([usage()]);

    fireEvent.keyDown(screen.getByRole("button", { name: /Utilisations/ }), { key: "a" });

    expect(screen.queryByRole("link", { name: "Fichier détail" })).not.toBeInTheDocument();
  });

  it("déplie toujours le panneau à la souris", async () => {
    renderPanel([usage()]);

    fireEvent.click(screen.getByText("Utilisations"));

    await waitFor(() => {
      expect(screen.getByRole("link", { name: "Fichier détail" })).toBeInTheDocument();
    });
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
