import objectFromKeys from "@utils/object-from-keys";

import { Concept } from "../types/concept";
import { conceptNoteFields } from "./conceptNoteFields";
import { emptyConceptGeneralWithContributor } from "./emptyConceptGeneralWithContributor";

export const emptyConcept = (defaultContributor: string): Concept => ({
  general: emptyConceptGeneralWithContributor(defaultContributor),
  links: [],
  notes: objectFromKeys(conceptNoteFields, ""),
});
