import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";

import type { CategoryUsage, CodeListUsage } from "../../types/api";
import { OverrideDialog } from "./OverrideDialog";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    // Les clés avec interpolation renvoient `clé|{options}` pour pouvoir vérifier les valeurs.
    t: (key: string, options?: Record<string, unknown>) =>
      options ? `${key}|${JSON.stringify(options)}` : key,
  }),
}));

const listUsage = (variableId: string, variableLabel: string): CodeListUsage => ({
  studyUnitAgencyId: "fr.insee",
  studyUnitId: "su-1",
  studyUnitLabel: "Recensement",
  physicalInstanceAgencyId: "fr.insee",
  physicalInstanceId: "pi-1",
  physicalInstanceLabel: "Fichier détail",
  variableAgencyId: "fr.insee",
  variableId,
  variableLabel,
});

const categoryUsage = (codeListId: string): CategoryUsage => ({
  group: { agencyId: "fr.insee", id: "grp-1", label: "Groupe démographie" },
  studyUnit: { agencyId: "fr.insee", id: "su-1", label: "Recensement" },
  physicalInstance: { agencyId: "fr.insee", id: "pi-1", label: "Fichier détail" },
  variable: { agencyId: "fr.insee", id: "other-variable", label: "Autre variable" },
  codeList: { agencyId: "fr.insee", id: codeListId, label: `Liste ${codeListId}` },
});

const OTHER_VARIABLE = listUsage("other-variable", "Autre variable");
const CURRENT_VARIABLE = listUsage("current-variable", "Client");

const renderDialog = (props: Partial<Parameters<typeof OverrideDialog>[0]> = {}) => {
  const handlers = { onCancel: vi.fn(), onVariant: vi.fn(), onConfirm: vi.fn() };
  render(
    <MemoryRouter>
      <OverrideDialog
        dialogCase="list"
        listUsages={[OTHER_VARIABLE]}
        categoryUsages={[]}
        codeListLabel="Liste de codes test"
        currentVariableId="current-variable"
        currentVariableName="Client"
        currentCodeListId="codelist-1"
        {...handlers}
        {...props}
      />
    </MemoryRouter>,
  );
  return handlers;
};

const choices = () => within(screen.getByRole("list")).getAllByRole("button");

describe("OverrideDialog", () => {
  it("renders nothing when no edition awaits confirmation", () => {
    renderDialog({ dialogCase: null });

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("counts only the other variables, never the one being edited", () => {
    // Régression : le compte reprenait toutes les lignes d'usage, y compris celle de la variable
    // courante, et annonçait donc une variable impactée de trop.
    renderDialog({ listUsages: [CURRENT_VARIABLE, OTHER_VARIABLE] });

    expect(
      screen.getByText(
        'physicalInstance.view.code.overrideShared.message|{"label":"Liste de codes test","count":1,"firstOther":"Autre variable"}',
      ),
    ).toBeInTheDocument();
  });

  it("enumerates the impacted variables when there are several", () => {
    renderDialog({
      listUsages: [OTHER_VARIABLE, listUsage("third-variable", "Âge")],
    });

    expect(screen.getByText("Autre variable, Âge")).toBeInTheDocument();
  });

  it("offers the two outcomes as clickable choices, the safe one first", () => {
    renderDialog();

    const [first, second] = choices();
    // Créer une variante n'a aucune conséquence pour les autres : c'est l'issue proposée d'abord.
    expect(first).toHaveTextContent("physicalInstance.view.code.overrideShared.variantLabel");
    expect(first.className).toContain("override-dialog-choice-variant");
    // Modifier le partagé reste accessible, sans être l'action la plus facile à cliquer.
    expect(second).toHaveTextContent("physicalInstance.view.code.overrideShared.overwriteLabel");
    expect(second.className).toContain("override-dialog-choice-overwrite");
  });

  it("labels each choice so that it is understandable without reading the body", () => {
    renderDialog();

    // « Créer » seul ne dirait pas quoi : l'intitulé nomme l'objet, la description la conséquence.
    expect(
      screen.getByText("physicalInstance.view.code.overrideShared.variantLabel"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'physicalInstance.view.code.overrideShared.variantDescription|{"variable":"Client"}',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'physicalInstance.view.code.overrideShared.overwriteDescription|{"label":"Liste de codes test","count":1,"firstOther":"Autre variable"}',
      ),
    ).toBeInTheDocument();
  });

  it("wires each choice and the cancel action", () => {
    const { onVariant, onConfirm } = renderDialog();

    const [variant, overwrite] = choices();
    fireEvent.click(variant);
    fireEvent.click(overwrite);

    expect(onVariant).toHaveBeenCalledTimes(1);
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("cancels from the footer", () => {
    const { onCancel } = renderDialog();

    fireEvent.click(screen.getByText("physicalInstance.view.code.override.cancel"));

    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("describes the dialog by its context banner for screen readers", () => {
    renderDialog();

    const describedBy = screen.getByRole("dialog").getAttribute("aria-describedby");
    expect(describedBy).toBeTruthy();
    expect(document.getElementById(describedBy!)).toHaveTextContent(
      "physicalInstance.view.code.overrideShared.message",
    );
  });

  it("shows the list users panel collapsed, and only it, for a shared list (case 1)", async () => {
    renderDialog();

    expect(screen.getByText("physicalInstance.view.code.usersPanel.title")).toBeInTheDocument();
    // Pas de panneau de catégorie : aucune catégorie n'est en jeu.
    expect(
      screen.queryByText("physicalInstance.view.code.categoryUsersPanel.title"),
    ).not.toBeInTheDocument();
    // Replié par défaut : les utilisations n'apparaissent qu'après dépliage.
    expect(screen.queryByRole("link", { name: "Autre variable" })).not.toBeInTheDocument();

    fireEvent.click(screen.getByText("physicalInstance.view.code.usersPanel.title"));

    await waitFor(() =>
      expect(screen.getByRole("link", { name: "Autre variable" })).toBeInTheDocument(),
    );
  });

  it("shows both panels and counts only the other code lists when both are shared (case 2)", () => {
    // Trois lignes, dont la liste courante : une seule AUTRE liste est impactée.
    renderDialog({
      dialogCase: "listAndCategory",
      categoryLabel: "Oui",
      categoryUsages: [categoryUsage("codelist-1"), categoryUsage("cl-2"), categoryUsage("cl-2")],
    });

    expect(
      screen.getByText(
        'physicalInstance.view.code.overrideSharedCategory.categoryMessage|{"label":"Oui","count":1,"firstOther":"Liste cl-2"}',
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("physicalInstance.view.code.usersPanel.title")).toBeInTheDocument();
    expect(
      screen.getByText("physicalInstance.view.code.categoryUsersPanel.title"),
    ).toBeInTheDocument();
  });

  it("omits the list users panel when only the category is shared (case 3)", () => {
    renderDialog({
      dialogCase: "category",
      categoryLabel: "Oui",
      categoryUsages: [categoryUsage("cl-1"), categoryUsage("cl-2")],
    });

    // La liste est propre à la variable : montrer « utilisée par » n'aurait pas de sens.
    expect(
      screen.queryByText("physicalInstance.view.code.usersPanel.title"),
    ).not.toBeInTheDocument();
    expect(
      screen.getByText("physicalInstance.view.code.categoryUsersPanel.title"),
    ).toBeInTheDocument();
  });

  it("falls back to a generic variable wording when the variable has no name yet", () => {
    // Création de variable : le nom n'est pas encore saisi.
    renderDialog({ currentVariableName: "" });

    expect(
      screen.getByText(
        'physicalInstance.view.code.overrideShared.variantDescription|{"variable":"physicalInstance.view.code.override.editedVariable"}',
      ),
    ).toBeInTheDocument();
  });
});
