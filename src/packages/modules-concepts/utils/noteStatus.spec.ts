import { ConceptNotes } from "@model/concepts/concept";

import { emptyConceptNotes } from "./emptyConceptNotes";
import { noteStatus, noteTypes } from "./noteStatus";

const notes = (overrides: Partial<ConceptNotes> = {}) =>
  ({ ...emptyConceptNotes, ...overrides }) as unknown as ConceptNotes;

const noteType = (rawTitle: string) => {
  const found = noteTypes(350).find((type) => type.rawTitle === rawTitle);
  if (!found) throw new Error(`Type de note inconnu : ${rawTitle}`);
  return found;
};

const scopeNote = noteType("conceptsScopeNote");
const definition = noteType("conceptsDefinition");
const editorialNote = noteType("conceptsEditorialNote");

describe("noteStatus", () => {
  it("décrit les quatre notes d'un concept", () => {
    expect(noteTypes(350).map(({ rawTitle }) => rawTitle)).toEqual([
      "conceptsScopeNote",
      "conceptsDefinition",
      "conceptsEditorialNote",
      "conceptsChangeNote",
    ]);
  });

  it("signale une note vide", () => {
    expect(noteStatus(editorialNote, notes(), "")).toBe("empty");
  });

  it("considère complète une note renseignée dans les deux langues", () => {
    expect(
      noteStatus(
        editorialNote,
        notes({ editorialNoteLg1: "<p>Note</p>", editorialNoteLg2: "<p>Note</p>" }),
        "",
      ),
    ).toBe("ok");
  });

  it("signale la traduction manquante d'une note facultative", () => {
    expect(noteStatus(editorialNote, notes({ editorialNoteLg1: "<p>Note</p>" }), "")).toBe(
      "missingTranslation",
    );
  });

  it("signale une définition absente, qui est obligatoire", () => {
    expect(noteStatus(definition, notes(), "")).toBe("toFix");
  });

  it("signale la traduction manquante d'une définition renseignée", () => {
    expect(noteStatus(definition, notes({ definitionLg1: "<p>Définition</p>" }), "")).toBe(
      "missingTranslation",
    );
  });

  it("signale la définition courte absente quand le concept est public", () => {
    expect(noteStatus(scopeNote, notes(), "Public générique")).toBe("toFix");
  });

  it("tolère la définition courte absente quand le concept n'est pas public", () => {
    expect(noteStatus(scopeNote, notes(), "Privé")).toBe("empty");
  });

  it("signale une définition courte trop longue", () => {
    expect(noteStatus(scopeNote, notes({ scopeNoteLg1: `<p>${"a".repeat(351)}</p>` }), "")).toBe(
      "toFix",
    );
  });

  it("signale une traduction de définition courte trop longue", () => {
    expect(
      noteStatus(
        scopeNote,
        notes({
          scopeNoteLg1: "<p>Courte</p>",
          scopeNoteLg2: `<p>${"a".repeat(351)}</p>`,
        }),
        "",
      ),
    ).toBe("toFix");
  });

  it("ne compte pas le balisage HTML dans la longueur", () => {
    expect(
      noteStatus(
        scopeNote,
        notes({ scopeNoteLg1: `<p><strong>${"a".repeat(350)}</strong></p>`, scopeNoteLg2: "a" }),
        "",
      ),
    ).toBe("ok");
  });
});
