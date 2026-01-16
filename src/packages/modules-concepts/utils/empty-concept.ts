import objectFromKeys from "@utils/object-from-keys";

import { emptyWithContributor as emptyGeneral } from "./general";
import { fields as noteFields } from "./notes";

const emptyConcept = (defaultContributor: string) => ({
  general: emptyGeneral(defaultContributor),
  links: [],
  notes: objectFromKeys(noteFields, ""),
});

export default emptyConcept;
