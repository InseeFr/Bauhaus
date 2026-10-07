import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Route, Routes } from "react-router";
import { vi } from "vitest";

import { StructureApi } from "@sdk/index";

import { createStructuresWrapper } from "../../../../render.testing";
import { EditionForm } from "./EditionForm";

vi.mock("@sdk/index", () => ({
  StructureApi: {
    postStructure: vi.fn(),
    putStructure: vi.fn(),
    getMutualizedComponents: vi.fn().mockResolvedValue([]),
  },
  ConceptsApi: { getConceptList: vi.fn().mockResolvedValue([]) },
  CodelistsApi: {
    getCodelists: vi.fn().mockResolvedValue([]),
    getCodelistsPartial: vi.fn().mockResolvedValue([]),
  },
  StampsApi: { getStamps: vi.fn().mockResolvedValue([]) },
}));

vi.mock("@components/business/creators-input", () => ({
  CreatorsInput: () => <div />,
}));
vi.mock("@components/business/contributors-input/contributors-input", () => ({
  ContributorsInput: () => <div />,
}));
vi.mock("./StructureComponents", () => ({
  StructureComponents: () => <div />,
}));

vi.mock("@utils/hooks/users", async (importOriginal) =>
  (await import("../../../../mocks.testing")).usersHookWithCreatePrivilege(
    await importOriginal(),
    "STRUCTURE_STRUCTURE",
  ),
);

const Wrapper = createStructuresWrapper({
  initialEntries: ["/structures/edit"],
  routes: (children) => (
    <Routes>
      <Route path="/structures/edit" element={children} />
      <Route path="/structures/:id" element={<span>Fiche de la structure</span>} />
    </Routes>
  ),
});

const structure = {
  id: "dsd1",
  identifiant: "DSD1",
  labelLg1: "Structure 1",
  labelLg2: "Structure 1 EN",
};

const renderForm = (props: Record<string, unknown> = {}) =>
  render(<EditionForm creation={false} initialStructure={structure} {...props} />, {
    wrapper: Wrapper,
  });

const saveButton = () => screen.getByRole("button", { name: /save|sauvegarder/i });

describe("EditionForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("affiche la structure à modifier, notation verrouillée", () => {
    renderForm();

    expect(screen.getByDisplayValue("Structure 1")).toBeInTheDocument();
    expect(screen.getByDisplayValue("DSD1")).toBeDisabled();
  });

  it("nomme la saisie du libellé anglais par son propre libellé", () => {
    renderForm();

    expect(screen.getByDisplayValue("Structure 1 EN")).toHaveAccessibleName(/label/i);
  });

  it("laisse saisir la notation à la création", () => {
    renderForm({ creation: true, initialStructure: {} });

    const notation = screen.getByLabelText(/notation/i);
    expect(notation).toBeEnabled();

    fireEvent.change(notation, { target: { value: "DSD2" } });

    expect(screen.getByDisplayValue("DSD2")).toBeInTheDocument();
  });

  it("reporte la saisie des libellés et descriptions", () => {
    renderForm();

    fireEvent.change(screen.getByDisplayValue("Structure 1"), {
      target: { value: "Structure renommée" },
    });

    expect(screen.getByDisplayValue("Structure renommée")).toBeInTheDocument();
  });

  it("enregistre la structure modifiée puis ouvre sa fiche", async () => {
    vi.mocked(StructureApi.putStructure).mockResolvedValue("dsd1");
    renderForm();

    fireEvent.click(saveButton());

    expect(await screen.findByText("Fiche de la structure")).toBeInTheDocument();
    expect(StructureApi.putStructure).toHaveBeenCalledWith(
      expect.objectContaining({ identifiant: "DSD1" }),
    );
  });

  it("crée la structure quand le formulaire est en création", async () => {
    vi.mocked(StructureApi.postStructure).mockResolvedValue("dsd2");
    renderForm({ creation: true, initialStructure: structure });

    fireEvent.click(saveButton());

    await waitFor(() => expect(StructureApi.postStructure).toHaveBeenCalled());
    expect(StructureApi.putStructure).not.toHaveBeenCalled();
  });

  it("affiche les erreurs de saisie et n'appelle pas le serveur", async () => {
    renderForm({ creation: true, initialStructure: { identifiant: "", labelLg1: "" } });

    fireEvent.click(saveButton());

    expect(await screen.findByRole("alert")).toBeInTheDocument();
    expect(StructureApi.postStructure).not.toHaveBeenCalled();
  });

  it("affiche l'erreur renvoyée par le serveur", async () => {
    vi.mocked(StructureApi.putStructure).mockRejectedValue("Erreur serveur");
    renderForm();

    fireEvent.click(saveButton());

    expect(await screen.findByText("Erreur serveur")).toBeInTheDocument();
  });

  it("affiche une erreur de validation du serveur sous le champ concerné", async () => {
    vi.mocked(StructureApi.putStructure).mockRejectedValue({
      status: 400,
      errors: [{ field: "labelLg2", message: "labelLg2 is required" }],
    });
    renderForm();

    fireEvent.click(saveButton());

    const input = await screen.findByDisplayValue("Structure 1 EN");
    await waitFor(() => expect(input).toHaveAccessibleDescription("labelLg2 is required"));
    expect(input).toHaveAttribute("aria-invalid", "true");
  });

  it("n'affiche pas d'erreur générique quand toutes les erreurs du serveur sont sous leur champ", async () => {
    vi.mocked(StructureApi.putStructure).mockRejectedValue({
      status: 400,
      errors: [{ field: "labelLg2", message: "labelLg2 is required" }],
    });
    renderForm();

    fireEvent.click(saveButton());

    const input = await screen.findByDisplayValue("Structure 1 EN");
    await waitFor(() => expect(input).toHaveAccessibleDescription("labelLg2 is required"));
    expect(screen.queryByText(/An error has occurred|Une erreur s'est produite/)).toBeNull();
  });

  it("efface l'erreur du serveur sous le champ au rejet suivant", async () => {
    vi.mocked(StructureApi.putStructure)
      .mockRejectedValueOnce({
        status: 400,
        errors: [{ field: "labelLg2", message: "labelLg2 is required" }],
      })
      .mockRejectedValueOnce("Erreur serveur");
    renderForm();

    fireEvent.click(saveButton());
    const input = await screen.findByDisplayValue("Structure 1 EN");
    await waitFor(() => expect(input).toHaveAccessibleDescription("labelLg2 is required"));

    fireEvent.change(input, { target: { value: "Structure 1 renamed" } });
    fireEvent.click(saveButton());

    expect(await screen.findByText("Erreur serveur")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Structure 1 renamed")).not.toHaveAccessibleDescription();
  });

  it("affiche dans le bandeau une erreur du serveur sur un champ absent du formulaire", async () => {
    vi.mocked(StructureApi.putStructure).mockRejectedValue({
      status: 400,
      errors: [{ field: "componentDefinitions[0].component", message: "is required" }],
    });
    renderForm();

    fireEvent.click(saveButton());

    expect(
      await screen.findByText("componentDefinitions[0].component : is required"),
    ).toBeInTheDocument();
  });
});
