import { ConceptNotes } from "@model/concepts/concept";

import { htmlIsEmpty, htmlLength } from "@utils/html-utils";

export type NoteRawTitle =
  | "conceptsScopeNote"
  | "conceptsDefinition"
  | "conceptsEditorialNote"
  | "conceptsChangeNote";

export interface NoteType {
  rawTitle: NoteRawTitle;
  noteLg1Name: keyof ConceptNotes;
  noteLg2Name: keyof ConceptNotes;
  maxLength?: number;
}

/**
 * `ok` : les deux langues sont renseignées et valides.
 * `missingTranslation` : une seule des deux langues est renseignée.
 * `empty` : aucune des deux, et rien n'est encore reproché à la note.
 * `toFix` : la note dépasse sa longueur maximale, ou la validation a signalé une
 * erreur dessus — ce qui n'arrive qu'une fois la sauvegarde tentée.
 */
export type NoteStatus = "ok" | "empty" | "missingTranslation" | "toFix";

export const noteTypes = (maxLengthScopeNote: number): NoteType[] => [
  {
    rawTitle: "conceptsScopeNote",
    noteLg1Name: "scopeNoteLg1",
    noteLg2Name: "scopeNoteLg2",
    maxLength: maxLengthScopeNote,
  },
  {
    rawTitle: "conceptsDefinition",
    noteLg1Name: "definitionLg1",
    noteLg2Name: "definitionLg2",
  },
  {
    rawTitle: "conceptsEditorialNote",
    noteLg1Name: "editorialNoteLg1",
    noteLg2Name: "editorialNoteLg2",
  },
  {
    rawTitle: "conceptsChangeNote",
    noteLg1Name: "changeNoteLg1",
    noteLg2Name: "changeNoteLg2",
  },
];

export const noteStatus = (
  { noteLg1Name, noteLg2Name, maxLength }: NoteType,
  notes: ConceptNotes,
  /** Champs en erreur remontés par `validate`, absents tant que rien n'a été soumis. */
  errorFields?: Record<string, string>,
): NoteStatus => {
  const noteLg1 = (notes[noteLg1Name] as string) ?? "";
  const noteLg2 = (notes[noteLg2Name] as string) ?? "";

  const limit = maxLength ?? Number.POSITIVE_INFINITY;

  if (htmlLength(noteLg1) > limit || htmlLength(noteLg2) > limit) return "toFix";

  // Le caractère obligatoire d'une note est décrit par `validate` et lui seul :
  // une note vide n'est reprochée qu'à partir du moment où il la signale.
  if (errorFields?.[noteLg1Name] || errorFields?.[noteLg2Name]) return "toFix";

  const emptyLg1 = htmlIsEmpty(noteLg1);
  const emptyLg2 = htmlIsEmpty(noteLg2);

  if (emptyLg1 && emptyLg2) return "empty";

  if (emptyLg1 || emptyLg2) return "missingTranslation";

  return "ok";
};
