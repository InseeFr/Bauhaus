import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { usePrivileges, useUserStamps } from "@utils/hooks/users";

import { ddiPrivileges } from "../../../privileges.testing";
import { VariableEditForm } from "./VariableEditForm";
import { typeOptions } from "./variableForm.testing";

// Le vrai TabView de PrimeReact : c'est lui qui pose les rôles et la navigation clavier.

vi.mock(
  "react-router",
  async () => (await import("./variableForm.testing")).searchParamsRouterModule,
);

vi.mock("react-i18next", async () =>
  (await import("../representation.testing")).mockTranslations({
    "physicalInstance.view.tabs.information": "Informations",
    "physicalInstance.view.tabs.representation": "Représentation",
    "physicalInstance.view.tabs.ddiPreview": "Aperçu DDI",
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
    />,
  );

describe("VariableEditForm, onglets", () => {
  beforeEach(() => {
    vi.mocked(usePrivileges).mockReturnValue(ddiPrivileges("UPDATE", "ALL") as any);
    vi.mocked(useUserStamps).mockReturnValue({ data: [{ stamp: "STAMP1" }] } as any);
  });

  it("expose trois onglets nommés", () => {
    renderForm();

    expect(screen.getAllByRole("tab")).toEqual([
      screen.getByRole("tab", { name: "Informations" }),
      screen.getByRole("tab", { name: "Représentation" }),
      screen.getByRole("tab", { name: "Aperçu DDI" }),
    ]);
  });

  it("change d'onglet au clavier", async () => {
    renderForm();

    screen.getByRole("tab", { name: "Informations" }).focus();

    await userEvent.keyboard("{ArrowRight}{Enter}");

    expect(screen.getByRole("tab", { name: "Représentation" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByText("contenu représentation")).toBeVisible();
  });
});
