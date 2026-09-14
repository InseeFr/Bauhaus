import { ConceptNotes } from "@model/concepts/concept";

import { versionImpactingNoteFields } from "./conceptNoteFieldGroups";
import { processConceptNoteChanges } from "./processConceptNoteChanges";

export const areNotesImpactingVersionChanged = (oldNotes: ConceptNotes, notes: ConceptNotes) => {
  return processConceptNoteChanges(oldNotes, notes, versionImpactingNoteFields).length > 0;
};
