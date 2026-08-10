import objectFromKeys from "@utils/object-from-keys";

import { emptyWithContributor as emptyGeneral } from "./general";
import { fields as noteFields } from "./notes";
import { Concept, ConceptGeneral, ConceptNotes } from "@model/concepts/concept";

const emptyConcept = (defaultContributor: string): Concept => ({
  general: emptyGeneral(defaultContributor) as unknown as ConceptGeneral,
  links: [],
  notes: objectFromKeys(noteFields, "") as unknown as ConceptNotes,
});

export default emptyConcept;
