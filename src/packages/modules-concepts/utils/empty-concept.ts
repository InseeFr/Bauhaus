import objectFromKeys from "@utils/object-from-keys";

import { emptyWithContributor as emptyGeneral } from "./general";
import { fields as noteFields } from "./notes";
import { Concept } from "../types/concept";

const emptyConcept = (defaultContributor: string): Concept => ({
  general: emptyGeneral(defaultContributor),
  links: [],
  notes: objectFromKeys(noteFields, ""),
});

export default emptyConcept;
