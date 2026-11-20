import { fireEvent, screen } from "@testing-library/react";

import { CollectionGeneral } from "@model/concepts/collection";

import { renderWithAppContext } from "../../../../../tests/render";
import { sdkRejection } from "../../../../../tests/sdk-rejection.testing";
import { emptyCollectionGeneral } from "../../../../utils/emptyCollectionGeneral";
import { CollectionEditionCreation } from "./CollectionEditionCreation";

vi.mock(
  "@components/business/creators-input",
  () => import("../../../../testing/form-stubs.testing"),
);
vi.mock(
  "@components/business/contributors-input/contributors-input",
  () => import("../../../../testing/form-stubs.testing"),
);

const validationError = (errors: { field: string; message: string }[]) =>
  sdkRejection.json(400, {
    message: "The submitted data is invalid",
    code: "INVALID_REQUEST_BODY",
    errors,
  });

const aGeneral = () =>
  ({
    ...emptyCollectionGeneral(),
    id: "c1000",
    prefLabelLg1: "Libellé FR",
    creator: "DG75-L201",
  }) as unknown as CollectionGeneral;

const renderForm = (serverSideError: unknown, creation = true) =>
  renderWithAppContext(
    <CollectionEditionCreation
      title="title"
      creation={creation}
      general={aGeneral()}
      members={[]}
      collectionList={[]}
      conceptList={[]}
      save={vi.fn()}
      submitting={false}
      setSubmitting={vi.fn()}
      serverSideError={serverSideError}
    />,
  );

describe("erreurs de validation du serveur sur une collection", () => {
  it("affiche l'erreur de l'identifiant sous sa saisie, comme une erreur client", () => {
    renderForm(validationError([{ field: "id", message: "Identifiant refusé" }]));

    const input = screen.getByDisplayValue("c1000");
    expect(input).toHaveAccessibleDescription("Identifiant refusé");
    expect(input).toHaveAttribute("aria-invalid", "true");
  });

  it("affiche l'erreur du propriétaire sous sa saisie", () => {
    renderForm(validationError([{ field: "creator", message: "Propriétaire refusé" }]));

    expect(screen.getByText("Propriétaire refusé")).toBeInTheDocument();
  });

  it("laisse au bandeau une erreur qui ne vise aucun champ affiché", () => {
    renderForm(validationError([{ field: "conceptsIdentifiers[0]", message: "Concept vide" }]));

    expect(screen.getByText(/conceptsIdentifiers\[0\] : Concept vide/)).toBeInTheDocument();
    expect(screen.getByDisplayValue("c1000")).not.toHaveAttribute("aria-invalid", "true");
  });

  it("laisse au bandeau l'erreur de l'identifiant en modification, où il n'est pas saisi", () => {
    renderForm(validationError([{ field: "id", message: "Identifiant refusé" }]), false);

    expect(screen.getByText(/id : Identifiant refusé/)).toBeInTheDocument();
  });

  it("efface l'erreur d'un champ dès qu'on le modifie", () => {
    renderForm(validationError([{ field: "id", message: "Identifiant refusé" }]));

    fireEvent.change(screen.getByDisplayValue("c1000"), { target: { value: "c1001" } });

    expect(screen.getByDisplayValue("c1001")).not.toHaveAttribute("aria-invalid", "true");
    expect(screen.queryByText("Identifiant refusé")).not.toBeInTheDocument();
  });
});
