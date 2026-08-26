import { fireEvent, render, screen } from "@testing-library/react";

import { CollectionGeneral, CollectionMember } from "@model/concepts/collection";

import { emptyCollectionGeneral } from "../../../../utils/emptyCollectionGeneral";
import CollectionEditionCreation from "./CollectionEditionCreation";

vi.mock("../menu", () => ({
  Menu: ({
    handleSave,
    redirectCancel,
    errors,
  }: {
    handleSave: () => void;
    redirectCancel: () => string;
    errors?: { errorMessage?: string[] };
  }) => (
    <div>
      <button type="button" onClick={handleSave}>
        save
      </button>
      <span data-testid="cancel-target">{redirectCancel()}</span>
      <span data-testid="error-count">{errors?.errorMessage?.length ?? 0}</span>
    </div>
  ),
}));

vi.mock("./CollectionGeneralEdition", () => ({
  default: ({
    general,
    handleChange,
    creation,
  }: {
    general: CollectionGeneral;
    handleChange: (update: Partial<CollectionGeneral>) => void;
    creation?: boolean;
  }) => (
    <div>
      <span data-testid="general-label">{general.prefLabelLg1}</span>
      <span data-testid="general-creation">{String(creation)}</span>
      <button type="button" onClick={() => handleChange({ prefLabelLg1: "Libellé modifié" })}>
        change-general
      </button>
    </div>
  ),
}));

vi.mock("./CollectionMembersEdition", () => ({
  default: ({
    members,
    handleChange,
  }: {
    members: { id: string; label: string }[];
    handleChange: (members: { id: string; label: string }[]) => void;
  }) => (
    <div>
      <span data-testid="members">
        {members.map(({ id, label }) => `${id}:${label}`).join("|")}
      </span>
      <button type="button" onClick={() => handleChange([{ id: "c3", label: "Concept 3" }])}>
        change-members
      </button>
    </div>
  ),
}));

const aGeneral = (overrides: Partial<CollectionGeneral> = {}): CollectionGeneral => ({
  ...emptyCollectionGeneral(),
  id: "C-1",
  prefLabelLg1: "Ma collection",
  creator: "DG75-L001",
  ...overrides,
});

const members: CollectionMember[] = [
  { id: "c1", prefLabelLg1: "Concept 1", prefLabelLg2: "Concept 1 en" },
  { id: "c2", prefLabelLg1: "Concept 2", prefLabelLg2: null },
];

const renderComponent = (
  props: Partial<React.ComponentProps<typeof CollectionEditionCreation>> = {},
) => {
  const save = vi.fn();
  const setSubmitting = vi.fn();
  render(
    <CollectionEditionCreation
      title="Titre"
      general={aGeneral()}
      members={members}
      collectionList={[]}
      conceptList={[]}
      save={save}
      submitting={false}
      setSubmitting={setSubmitting}
      {...props}
    />,
  );
  return { save, setSubmitting };
};

describe("collection-edition-creation", () => {
  it("affiche le titre et le sous-titre", () => {
    renderComponent({ title: "Modifier une collection", subtitle: "Ma collection" });

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Modifier une collection");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Ma collection");
  });

  it("initialise les membres à partir du libellé principal des props", () => {
    renderComponent();

    expect(screen.getByTestId("members")).toHaveTextContent("c1:Concept 1|c2:Concept 2");
  });

  it("sauvegarde le général et les membres courants", () => {
    const { save } = renderComponent();

    fireEvent.click(screen.getByText("save"));

    expect(save).toHaveBeenCalledWith({
      general: aGeneral(),
      members: [
        { id: "c1", label: "Concept 1" },
        { id: "c2", label: "Concept 2" },
      ],
    });
  });

  it("sauvegarde le général modifié", () => {
    const { save } = renderComponent();

    fireEvent.click(screen.getByText("change-general"));
    fireEvent.click(screen.getByText("save"));

    expect(save).toHaveBeenCalledWith(
      expect.objectContaining({
        general: aGeneral({ prefLabelLg1: "Libellé modifié" }),
      }),
    );
  });

  it("répercute la modification du général sur l'affichage", () => {
    renderComponent();

    fireEvent.click(screen.getByText("change-general"));

    expect(screen.getByTestId("general-label")).toHaveTextContent("Libellé modifié");
  });

  it("signale une soumission en cours quand le général change", () => {
    const { setSubmitting } = renderComponent();

    fireEvent.click(screen.getByText("change-general"));

    expect(setSubmitting).toHaveBeenCalledWith(true);
  });

  it("sauvegarde les membres modifiés", () => {
    const { save } = renderComponent();

    fireEvent.click(screen.getByText("change-members"));
    fireEvent.click(screen.getByText("save"));

    expect(save).toHaveBeenCalledWith(
      expect.objectContaining({ members: [{ id: "c3", label: "Concept 3" }] }),
    );
  });

  it("signale une soumission en cours quand les membres changent", () => {
    const { setSubmitting } = renderComponent();

    fireEvent.click(screen.getByText("change-members"));

    expect(setSubmitting).toHaveBeenCalledWith(true);
  });

  it("ne sauvegarde pas tant que le bouton n'est pas actionné", () => {
    const { save } = renderComponent();

    fireEvent.click(screen.getByText("change-general"));

    expect(save).not.toHaveBeenCalled();
  });

  it("annule vers la liste des collections en création", () => {
    renderComponent({ creation: true });

    expect(screen.getByTestId("cancel-target")).toHaveTextContent("/concepts/collections");
  });

  it("annule vers la collection courante en édition", () => {
    renderComponent({ creation: false });

    expect(screen.getByTestId("cancel-target")).toHaveTextContent("/concepts/collections/C-1");
  });

  it("annule vers la collection d'origine même après renommage de l'identifiant", () => {
    renderComponent({ creation: false, general: aGeneral({ id: "C-1" }) });

    fireEvent.click(screen.getByText("change-general"));

    expect(screen.getByTestId("cancel-target")).toHaveTextContent("/concepts/collections/C-1");
  });

  it("transmet le mode création au formulaire général", () => {
    renderComponent({ creation: true });

    expect(screen.getByTestId("general-creation")).toHaveTextContent("true");
  });

  it("ne remonte aucune erreur pour une collection valide", () => {
    renderComponent();

    expect(screen.getByTestId("error-count")).toHaveTextContent("0");
  });

  it("remonte les erreurs des champs obligatoires vides", () => {
    renderComponent({ general: aGeneral({ id: "", prefLabelLg1: "", creator: "" }) });

    expect(Number(screen.getByTestId("error-count").textContent)).toBeGreaterThan(0);
  });

  it("remonte une erreur quand le libellé est renommé en un libellé déjà pris", () => {
    renderComponent({
      collectionList: [
        { id: "C-2", label: { value: "Libellé modifié", lang: "fr" } },
        { id: "C-1", label: { value: "Ma collection", lang: "fr" } },
      ],
    });
    expect(screen.getByTestId("error-count")).toHaveTextContent("0");

    fireEvent.click(screen.getByText("change-general"));

    expect(Number(screen.getByTestId("error-count").textContent)).toBeGreaterThan(0);
  });

  it("n'interdit pas le libellé initial de la collection éditée", () => {
    renderComponent({
      general: aGeneral(),
      collectionList: [{ id: "C-1", label: { value: "Ma collection", lang: "fr" } }],
    });

    expect(screen.getByTestId("error-count")).toHaveTextContent("0");
  });
});
