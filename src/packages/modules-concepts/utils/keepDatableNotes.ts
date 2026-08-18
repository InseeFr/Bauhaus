import { ConceptNotes } from "../../model/concepts/concept";
import { datableNoteFields } from "./conceptNoteFieldGroups";
import { extractDatableConceptNotes } from "./extractDatableConceptNotes";

export const keepDatableNotes = (notes: ConceptNotes) =>
  extractDatableConceptNotes(notes, datableNoteFields);
