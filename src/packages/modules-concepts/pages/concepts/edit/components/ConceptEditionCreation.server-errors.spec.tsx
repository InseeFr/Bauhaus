import { fireEvent, screen, within } from "@testing-library/react";

import { ConceptGeneral, ConceptNotes } from "@model/concepts/concept";

import { renderWithAppContext } from "../../../../../tests/render";
import { sdkRejection } from "../../../../../tests/sdk-rejection.testing";
import { emptyConceptGeneral } from "../../../../utils/emptyConceptGeneral";
import { ConceptEditionCreation } from "./ConceptEditionCreation";

vi.mock(
  "@components/business/creators-input",
  () => import("../../../../testing/form-stubs.testing"),
);
vi.mock(
  "@components/business/contributors-input/contributors-input",
  () => import("../../../../testing/form-stubs.testing"),
);
vi.mock("@components/dissemination-status/disseminationStatus", () => ({
  DisseminationStatusInput: () => <></>,
}));

vi.mock("../../../../hooks/useCollections", () => ({
  useCollections: () => ({ data: [] }),
}));

const validationError = (errors: { field: string; message: string }[]) =>
  sdkRejection.json(400, {
    message: "The submitted data is invalid",
    code: "INVALID_REQUEST_BODY",
    errors,
  });

const renderForm = (serverSideError: unknown, section?: string) =>
  renderWithAppContext(
    <ConceptEditionCreation
      id="c1"
      creation={false}
      title="title"
      general={
        {
          ...emptyConceptGeneral(),
          contributor: "DG75-L201",
          prefLabelLg1: "Libellé FR",
          prefLabelLg2: "Libellé EN",
        } as unknown as ConceptGeneral
      }
      notes={{} as ConceptNotes}
      conceptsWithLinks={[]}
      save={vi.fn()}
      setSubmitting={vi.fn()}
      submitting={false}
      maxLengthScopeNote={1000}
      serverSideError={serverSideError}
      section={section}
    />,
  );

describe("erreurs de validation du serveur sur les informations générales", () => {
  it.each([
    ["prefLabelLg1", "Libellé FR"],
    ["prefLabelLg2", "Libellé EN"],
  ])("affiche l'erreur de %s sous sa saisie, comme une erreur client", (field, value) => {
    renderForm(validationError([{ field, message: "Libellé refusé" }]));

    const input = screen.getByDisplayValue(value);
    expect(input).toHaveAccessibleDescription("Libellé refusé");
    expect(input).toHaveAttribute("aria-invalid", "true");
  });

  it("laisse au bandeau une erreur qui ne vise aucun champ affiché", () => {
    renderForm(validationError([{ field: "links[0].typeOfLink", message: "Type absent" }]));

    expect(screen.getByText(/Type absent/)).toBeInTheDocument();
    expect(screen.getByDisplayValue("Libellé FR")).not.toHaveAttribute("aria-invalid", "true");
  });

  it("efface l'erreur d'un champ dès qu'on le modifie", () => {
    renderForm(validationError([{ field: "prefLabelLg2", message: "Libellé refusé" }]));

    fireEvent.change(screen.getByDisplayValue("Libellé EN"), { target: { value: "Corrigé" } });

    const input = screen.getByDisplayValue("Corrigé");
    expect(input).not.toHaveAttribute("aria-invalid", "true");
    expect(screen.queryByText("Libellé refusé")).not.toBeInTheDocument();
  });
});

describe("onglet qui porte une erreur de validation du serveur", () => {
  const summaryEntry = (name: RegExp) =>
    within(screen.getByRole("navigation")).getByRole("button", { name });

  it("signale les liens à corriger quand l'onglet affiché est un autre", () => {
    renderForm(validationError([{ field: "links[0].typeOfLink", message: "Type absent" }]));

    expect(summaryEntry(/^Links/).textContent).toContain("To fix");
    expect(screen.getByText(/Type absent/)).toBeInTheDocument();
  });

  it("signale les informations générales à corriger quand l'onglet affiché est un autre", () => {
    renderForm(validationError([{ field: "prefLabelLg1", message: "Libellé refusé" }]), "links");

    expect(summaryEntry(/^General information/).textContent).toContain("To fix");
  });

  it("ne signale pas les liens pour une erreur qui ne les vise pas", () => {
    renderForm(validationError([{ field: "prefLabelLg1", message: "Libellé refusé" }]));

    expect(summaryEntry(/^Links/).textContent).not.toContain("To fix");
  });
});
