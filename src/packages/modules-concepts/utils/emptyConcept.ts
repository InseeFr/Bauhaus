import { objectFromKeys } from "@utils/object-from-keys";

import { Concept, ConceptGeneral, ConceptNotes } from "@model/concepts/concept";
import { conceptNoteFields } from "./conceptNoteFields";
import { emptyConceptGeneralWithContributor } from "./emptyConceptGeneralWithContributor";

export const emptyConcept = (defaultContributor: string): Concept => ({
  general: emptyConceptGeneralWithContributor(defaultContributor) as unknown as ConceptGeneral,
  links: [],
  notes: objectFromKeys(conceptNoteFields, "") as unknown as ConceptNotes,
});
