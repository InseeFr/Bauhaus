import { fireEvent, screen, within } from "@testing-library/react";

import { ConceptGeneral, ConceptNotes } from "@model/concepts/concept";
import { UNPUBLISHED, VALIDATED } from "@model/ValidationState";

import { BROADER, NARROWER, NONE, NO_VERSIONING } from "@sdk/constants";

import { renderWithAppContext } from "../../../../../tests/render";
import { emptyConceptGeneral } from "../../../../utils/emptyConceptGeneral";
import { emptyConceptNotes } from "../../../../utils/emptyConceptNotes";
import { ConceptEditionCreation, onGeneralInformationChange } from "./ConceptEditionCreation";

vi.mock("./ConceptGeneralEdition");

type ConceptEditionCreationProps = React.ComponentProps<typeof ConceptEditionCreation>;

/** Entrée du sommaire du formulaire. */
const summaryEntry = (name: string | RegExp) =>
  within(screen.getByRole("navigation")).getByRole("button", { name });

const chooseInSummary = (name: string | RegExp) => fireEvent.click(summaryEntry(name));

const clickSave = () => fireEvent.click(screen.getByRole("button", { name: /Sauvegarder|Save/ }));

describe("concept-edition-creation", () => {
  it("should update general informations", () => {
    const initialState = {
      id: undefined,
      showModal: false,
      saveAttempted: false,
      activeSection: "general" as const,
      activeNote: "conceptsScopeNote" as const,
      activeLinkType: NARROWER,
      data: {
        general: {
          general1: "general1",
          general2: "general2",
        } as unknown as ConceptGeneral,
        notes: {} as ConceptNotes,
        conceptsWithLinks: [],
        equivalentLinks: [],
      },
    };
    const result = onGeneralInformationChange(initialState, {
      general2: "general21",
      general3: "general3",
    } as unknown as Partial<ConceptGeneral>);
    expect(result.data.general).toEqual({
      general1: "general1",
      general2: "general21",
      general3: "general3",
    });
  });

  const buildBaseProps = () => ({
    id: "id",
    creation: true,
    title: "title",
    general: {
      ...emptyConceptGeneral(),
      contributor: "DG75-L201",
    } as unknown as ConceptGeneral,
    notes: {} as ConceptNotes,
    conceptsWithLinks: [],
    save: vi.fn(),
    setSubmitting: vi.fn(),
    submitting: false,
    maxLengthScopeNote: 1000,
  });

  const renderForm = (props: Partial<ConceptEditionCreationProps> = {}) =>
    renderWithAppContext(<ConceptEditionCreation {...buildBaseProps()} {...props} />);

  it("renders without crashing", () => {
    renderForm();
  });

  describe("navigation dans le formulaire", () => {
    it("n'imbrique plus le formulaire dans des onglets", () => {
      renderForm();

      expect(screen.queryAllByRole("tab")).toHaveLength(0);
    });

    it("n'affiche qu'une section à la fois, les informations générales d'abord", () => {
      renderForm();

      expect(
        screen.getByRole("heading", { name: "General information", level: 3 }),
      ).toBeInTheDocument();
      expect(screen.queryByRole("heading", { name: "Notes", level: 3 })).not.toBeInTheDocument();
      expect(screen.queryByRole("heading", { name: "Links", level: 3 })).not.toBeInTheDocument();
    });

    it("affiche la section choisie dans le sommaire", () => {
      renderForm();

      chooseInSummary(/Links/);

      expect(screen.getByRole("heading", { name: "Links", level: 3 })).toBeInTheDocument();
      expect(
        screen.queryByRole("heading", {
          name: "General information",
          level: 3,
        }),
      ).not.toBeInTheDocument();
    });

    it("affiche la note choisie dans le sommaire", () => {
      renderForm();

      chooseInSummary(/Note éditoriale/);

      expect(screen.getByRole("heading", { name: "Notes", level: 3 })).toBeInTheDocument();
      expect(screen.getByRole("region", { name: "Note éditoriale" })).toBeInTheDocument();
      expect(screen.queryByRole("region", { name: "Définition courte" })).not.toBeInTheDocument();
    });

    it("affiche la première note quand on choisit la section entière", () => {
      renderForm();

      chooseInSummary("Notes");

      expect(screen.getByRole("region", { name: "Définition courte" })).toBeInTheDocument();
    });

    it("signale dans le sommaire la section à corriger après une tentative de sauvegarde", () => {
      renderForm();

      expect(summaryEntry(/General information/).textContent).toBe("General information");

      clickSave();

      expect(summaryEntry(/General information/).textContent).toContain("To fix");
    });

    it("n'affiche pas la note précédente quand le sommaire en demande une autre", () => {
      renderForm({
        notes: {
          ...emptyConceptNotes,
          scopeNoteLg1: "<p>Courte</p>",
        } as unknown as ConceptNotes,
        section: "conceptsScopeNote",
      });
      expect(screen.getByRole("region", { name: "Définition courte" })).toHaveTextContent("Courte");

      chooseInSummary(/^Définition(?! courte)/);

      expect(screen.getByRole("region", { name: "Définition" })).not.toHaveTextContent("Courte");
    });

    it("affiche le type de lien choisi dans le sommaire", () => {
      renderForm();

      chooseInSummary(/A pour parent/);

      expect(screen.getByRole("heading", { name: "Links", level: 3 })).toBeInTheDocument();
      expect(screen.getByText("A pour parent (0)")).toBeInTheDocument();
    });

    it("affiche le premier type de lien quand on choisit la section entière", () => {
      renderForm();

      chooseInSummary(/Links/);

      expect(screen.getByText("A pour enfant (0)")).toBeInTheDocument();
    });

    it("ouvre la partie indiquée au chargement", () => {
      renderForm({ section: "conceptsEditorialNote" });

      expect(screen.getByRole("region", { name: "Note éditoriale" })).toBeInTheDocument();
    });

    it("remonte la partie choisie pour qu'elle soit retenue", () => {
      const onSectionChange = vi.fn();
      renderForm({ onSectionChange });

      chooseInSummary(/A pour parent/);

      expect(onSectionChange).toHaveBeenCalledWith(BROADER);
    });

    it("remonte aussi le choix d'une section entière", () => {
      const onSectionChange = vi.fn();
      renderForm({ onSectionChange });

      chooseInSummary("Notes");

      expect(onSectionChange).toHaveBeenCalledWith("notes");
    });

    it("affiche le sommaire du concept", () => {
      renderForm();

      expect(screen.getByRole("navigation")).toBeInTheDocument();
    });
  });

  describe("global error message display (#1479)", () => {
    it("does not show the global error message on initial render of an empty creation form", () => {
      renderForm();
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });

    it("shows the global error message only after a save attempt on an invalid form", () => {
      renderForm({ save: vi.fn() });
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();

      clickSave();

      expect(screen.getByRole("alert")).toBeInTheDocument();
    });

    it("does not call save when the user clicks save on an invalid form", () => {
      const save = vi.fn();
      renderForm({ save });

      clickSave();

      expect(save).not.toHaveBeenCalled();
    });
  });
  describe("sauvegarde", () => {
    // Le minimum que `validate` exige : sans cela `handleSave` s'arrête avant
    // d'appeler `save`, et aucun parcours de sauvegarde n'est joué.
    const buildValidProps = (overrides: Record<string, unknown> = {}) => ({
      ...buildBaseProps(),
      general: {
        ...emptyConceptGeneral(),
        contributor: "DG75-L201",
        prefLabelLg1: "Concept valide",
        creator: "DG75-L201",
        // Un statut non public dispense de la définition courte.
        disseminationStatus: "http://id.insee.fr/codes/base/statutDiffusion/Prive",
        validationState: UNPUBLISHED,
      } as unknown as ConceptGeneral,
      notes: {
        ...emptyConceptNotes,
        definitionLg1: "<p>Définition</p>",
      } as unknown as ConceptNotes,
      ...overrides,
    });

    const expectNoVersioningQuestion = () =>
      expect(screen.queryByText("Please select versioning type")).not.toBeInTheDocument();

    it("sauvegarde le concept en création avec les seules données saisies", () => {
      const save = vi.fn();
      renderWithAppContext(<ConceptEditionCreation {...buildValidProps({ save })} />);

      clickSave();

      expect(save).toHaveBeenCalledTimes(1);
      expect(save.mock.calls[0]).toHaveLength(1);
      expect(save.mock.calls[0][0].general.prefLabelLg1).toBe("Concept valide");
    });

    it("sauvegarde sans rien demander un concept qui n'a jamais été publié", () => {
      const save = vi.fn();
      renderWithAppContext(
        <ConceptEditionCreation {...buildValidProps({ save, creation: false })} />,
      );

      clickSave();

      expectNoVersioningQuestion();
      expect(save).toHaveBeenCalledWith(
        "id",
        NO_VERSIONING,
        expect.objectContaining({
          general: expect.objectContaining({ prefLabelLg1: "Concept valide" }),
        }),
        expect.objectContaining({
          general: expect.objectContaining({ prefLabelLg1: "Concept valide" }),
        }),
      );
    });

    const buildPublishedProps = (overrides: Record<string, unknown> = {}) => {
      const props = buildValidProps({ creation: false, ...overrides });
      return {
        ...props,
        general: { ...props.general, validationState: VALIDATED } as unknown as ConceptGeneral,
      };
    };

    it("sauvegarde sans rien demander un concept publié dont aucune note n'a changé", () => {
      const save = vi.fn();
      renderWithAppContext(<ConceptEditionCreation {...buildPublishedProps({ save })} />);

      clickSave();

      expectNoVersioningQuestion();
      expect(save).toHaveBeenCalledWith("id", NO_VERSIONING, expect.anything(), expect.anything());
    });

    // Vider la note éditoriale la fait changer sans rendre le formulaire invalide,
    // contrairement à la définition, qui est obligatoire.
    const emptyEditorialNote = () => {
      chooseInSummary(/Note éditoriale/);
      const note = screen.getByRole("region", { name: "Note éditoriale" });
      fireEvent.click(within(note).getAllByTitle("Delete")[0]);
    };

    const buildPublishedWithNote = (save: ReturnType<typeof vi.fn>) => {
      const props = buildPublishedProps({ save });
      return {
        ...props,
        notes: {
          ...props.notes,
          editorialNoteLg1: "<p>Note éditoriale</p>",
        } as unknown as ConceptNotes,
      };
    };

    /** Rend un concept publié, vide sa note éditoriale puis tente de sauvegarder. */
    const saveChangedPublishedConcept = (save: ReturnType<typeof vi.fn>) => {
      renderWithAppContext(<ConceptEditionCreation {...buildPublishedWithNote(save)} />);

      emptyEditorialNote();
      clickSave();
    };

    it("demande quoi faire de la version quand une note impactante a changé", () => {
      const save = vi.fn();
      saveChangedPublishedConcept(save);

      expect(screen.getByText("Please select versioning type")).toBeInTheDocument();
      expect(save).not.toHaveBeenCalled();
    });

    it("écrase la version en place quand l'utilisateur le demande", () => {
      const save = vi.fn();
      saveChangedPublishedConcept(save);
      fireEvent.click(screen.getByRole("button", { name: "Overwrite version" }));

      expectNoVersioningQuestion();
      expect(save).toHaveBeenCalledWith("id", NO_VERSIONING, expect.anything(), expect.anything());
    });

    const dismissals = [
      { name: "referme la fenêtre sans sauvegarder quand l'utilisateur renonce", button: "Cancel" },
      {
        name: "referme la fenêtre sans sauvegarder quand l'utilisateur la ferme",
        button: /Close|Fermer/,
      },
    ];
    for (const { name, button } of dismissals) {
      it(name, () => {
        const save = vi.fn();
        saveChangedPublishedConcept(save);
        const modal = screen.getByRole("dialog");
        fireEvent.click(within(modal).getByRole("button", { name: button }));

        expectNoVersioningQuestion();
        expect(save).not.toHaveBeenCalled();
      });
    }

    it("interdit la version majeure tant que la note de changement n'a pas été reprise", () => {
      saveChangedPublishedConcept(vi.fn());

      expect(screen.getByRole("button", { name: "New version" })).toBeDisabled();
    });
  });
  describe("liens", () => {
    it("retient le lien d'équivalence ajouté", () => {
      renderForm();

      chooseInSummary(/Correspond à/);
      fireEvent.change(screen.getByPlaceholderText("New link"), {
        target: { value: "https://stats.oecd.org/glossary/detail.asp?ID=2288" },
      });
      fireEvent.click(screen.getByRole("button", { name: "Add" }));

      expect(
        screen.getByText("https://stats.oecd.org/glossary/detail.asp?ID=2288"),
      ).toBeInTheDocument();
    });

    it("retient le concept relié au type de lien affiché", () => {
      renderForm({ conceptsWithLinks: [{ id: "c2", label: "Autre concept", typeOfLink: NONE }] });

      chooseInSummary(/A pour enfant/);
      fireEvent.click(screen.getByText("Autre concept"));
      fireEvent.click(screen.getByLabelText("Move to Target"));

      expect(summaryEntry(/A pour enfant/).textContent).toContain("1");
    });
  });
});
