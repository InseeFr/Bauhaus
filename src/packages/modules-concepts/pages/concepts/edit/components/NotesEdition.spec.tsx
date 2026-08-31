import { screen, within } from "@testing-library/react";

import { ConceptNotes as ConceptNotesType } from "../../../../../model/concepts/concept";
import { renderWithAppContext } from "../../../../../tests/render";
import { emptyConceptNotes } from "../../../../utils/emptyConceptNotes";
import { NotesEdition as ConceptNotes } from "./NotesEdition";

const renderNotes = (
  notes: Partial<ConceptNotesType> = {},
  props: Partial<React.ComponentProps<typeof ConceptNotes>> = {},
) =>
  renderWithAppContext(
    <ConceptNotes
      notes={{ ...emptyConceptNotes, ...notes } as unknown as ConceptNotesType}
      disseminationStatus=""
      handleChange={vi.fn()}
      maxLengthScopeNote={350}
      activeNote="conceptsScopeNote"
      {...props}
    />,
  );

describe("concept-edition-creation-notes", () => {
  it("n'imbrique plus la saisie des notes dans des onglets", () => {
    renderNotes();

    expect(screen.queryAllByRole("tab")).toHaveLength(0);
  });

  it("n'affiche que la note demandée", () => {
    renderNotes();

    expect(screen.getByRole("region", { name: "Définition courte" })).toBeInTheDocument();
    expect(screen.queryByRole("region", { name: "Définition" })).not.toBeInTheDocument();
    expect(screen.queryByRole("region", { name: "Note éditoriale" })).not.toBeInTheDocument();
  });

  it("change de note quand le sommaire en demande une autre", () => {
    renderNotes({}, { activeNote: "conceptsEditorialNote" });

    expect(screen.getByRole("region", { name: "Note éditoriale" })).toBeInTheDocument();
    expect(screen.queryByRole("region", { name: "Définition courte" })).not.toBeInTheDocument();
  });

  it("ouvre les deux langues de la note, sans rien demander de plus", () => {
    renderNotes({}, { activeNote: "conceptsEditorialNote" });

    expect(screen.getAllByRole("textbox")).toHaveLength(2);
    expect(screen.queryByRole("button", { name: "Write" })).not.toBeInTheDocument();
  });

  it("nomme la langue de chaque éditeur", () => {
    renderNotes();

    const block = screen.getByRole("region", { name: "Définition courte" });

    expect(within(block).getByText("French")).toBeInTheDocument();
    expect(within(block).getByText("lg2")).toBeInTheDocument();
  });

  it("rappelle la longueur maximale de la définition courte", () => {
    renderNotes();

    expect(screen.getByText("350 characters maximum")).toBeInTheDocument();
  });

  it("ne rappelle aucune longueur maximale sur une note qui n'en a pas", () => {
    renderNotes({}, { activeNote: "conceptsEditorialNote" });

    expect(screen.queryByText(/characters maximum/)).not.toBeInTheDocument();
  });
});
