import { ConceptNotes } from "../../model/concepts/concept";
import { htmlIsEmpty, htmlLength } from "../../utils/html-utils";

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
 * `empty` : aucune des deux, et la note n'est pas obligatoire ici.
 * `toFix` : la note est obligatoire et absente, ou dépasse sa longueur maximale.
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

const isPublic = (disseminationStatus?: string) => !!disseminationStatus?.includes("Public");

export const noteStatus = (
  { rawTitle, noteLg1Name, noteLg2Name, maxLength }: NoteType,
  notes: ConceptNotes,
  disseminationStatus?: string,
): NoteStatus => {
  const noteLg1 = (notes[noteLg1Name] as string) ?? "";
  const noteLg2 = (notes[noteLg2Name] as string) ?? "";

  const limit = maxLength ?? Number.POSITIVE_INFINITY;

  if (htmlLength(noteLg1) > limit || htmlLength(noteLg2) > limit) return "toFix";

  const emptyLg1 = htmlIsEmpty(noteLg1);
  const emptyLg2 = htmlIsEmpty(noteLg2);

  // La définition est toujours obligatoire ; la définition courte ne l'est que
  // pour un concept diffusé publiquement.
  const required =
    rawTitle === "conceptsDefinition" ||
    (rawTitle === "conceptsScopeNote" && isPublic(disseminationStatus));

  if (emptyLg1 && required) return "toFix";

  if (emptyLg1 && emptyLg2) return "empty";

  if (emptyLg1 || emptyLg2) return "missingTranslation";

  return "ok";
};
