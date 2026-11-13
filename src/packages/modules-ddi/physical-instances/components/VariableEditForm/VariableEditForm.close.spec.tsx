import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { usePrivileges, useUserStamps } from "@utils/hooks/users";

import { ddiPrivileges } from "../../../privileges.testing";
import { VariableEditForm } from "./VariableEditForm";
import { typeOptions } from "./variableForm.testing";

// Le vrai Button / Tooltip de PrimeReact : c'est lui qui affiche l'infobulle au focus.

vi.mock(
  "react-router",
  async () => (await import("./variableForm.testing")).searchParamsRouterModule,
);

vi.mock("react-i18next", async () =>
  (await import("../representation.testing")).mockTranslations({
    "physicalInstance.view.closeVariablePanel": "Fermer ce formulaire",
  }),
);

vi.mock("@utils/hooks/users", async (importOriginal) =>
  (await import("../../../privileges.testing")).mockUsersHooks(importOriginal),
);

vi.mock("./VariableInformationTab", () => ({
  VariableInformationTab: () => <div>contenu informations</div>,
}));
vi.mock("./VariableRepresentationTab", () => ({
  VariableRepresentationTab: () => <div>contenu représentation</div>,
}));
vi.mock("./DdiPreview", () => ({ DdiPreview: () => <div>contenu aperçu</div> }));

const renderForm = () =>
  render(
    <VariableEditForm
      variable={{ id: "var-1", label: "Variable", name: "VAR", type: "numeric" }}
      typeOptions={typeOptions}
      onSave={vi.fn()}
      onClose={vi.fn()}
    />,
  );

describe("VariableEditForm, bouton de fermeture", () => {
  beforeEach(() => {
    vi.mocked(usePrivileges).mockReturnValue(ddiPrivileges("UPDATE", "ALL") as any);
    vi.mocked(useUserStamps).mockReturnValue({ data: [{ stamp: "STAMP1" }] } as any);
  });

  it("affiche l'infobulle « Fermer ce formulaire » quand le bouton reçoit le focus clavier", async () => {
    renderForm();
    const closeButton = screen.getByRole("button", { name: "Fermer ce formulaire" });

    for (let i = 0; i < 20 && document.activeElement !== closeButton; i++) {
      await userEvent.tab();
    }
    expect(closeButton).toHaveFocus();

    // happy-dom tient l’infobulle pour cachée (styles de transition PrimeReact) : { hidden: true }.
    const tooltip = await screen.findByRole("tooltip", { hidden: true });
    expect(tooltip).toHaveTextContent("Fermer ce formulaire");
  });
});
