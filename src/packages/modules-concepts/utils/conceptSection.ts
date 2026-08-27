import { LINK_TYPES } from "./linkTypes";
import { NoteRawTitle, noteTypes } from "./noteStatus";

export type ConceptSection = "general" | "notes" | "links";

export interface ConceptSectionState {
  section: ConceptSection;
  note: NoteRawTitle;
  linkType: string;
}

// La liste des notes ne dépend pas de la longueur maximale : n'importe quelle
// valeur donne le même ordre.
const NOTES = noteTypes(0).map(({ rawTitle }) => rawTitle);
const FIRST_NOTE = NOTES[0];
const FIRST_LINK_TYPE = LINK_TYPES[0].memberType;

/**
 * Traduit la clé retenue dans l'URL en ce qu'il faut afficher. Une clé peut
 * désigner une section entière (`notes`), une note précise
 * (`conceptsEditorialNote`) ou un type de lien (`broader`).
 */
export const resolveConceptSection = (key?: string | null): ConceptSectionState => {
  const defaults = {
    section: "general" as ConceptSection,
    note: FIRST_NOTE,
    linkType: FIRST_LINK_TYPE,
  };

  if (!key) return defaults;
  if (key === "general" || key === "notes" || key === "links") return { ...defaults, section: key };
  if (NOTES.includes(key as NoteRawTitle)) {
    return { ...defaults, section: "notes", note: key as NoteRawTitle };
  }
  if (LINK_TYPES.some(({ memberType }) => memberType === key)) {
    return { ...defaults, section: "links", linkType: key };
  }
  return defaults;
};
