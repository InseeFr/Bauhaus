import { ConceptNotes } from "@model/concepts/concept";

import { versionableNoteFields } from "./conceptNoteFieldGroups";
import { processConceptNoteChanges } from "./processConceptNoteChanges";

export const processVersionableChanges = (oldNotes: ConceptNotes, notes: ConceptNotes) =>
  processConceptNoteChanges(oldNotes, notes, versionableNoteFields);
