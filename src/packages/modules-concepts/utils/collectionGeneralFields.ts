import { CollectionGeneral } from "@model/concepts/collection";

import type { FieldSpec } from "@utils/build-general-proptypes";

const fieldNames: (keyof CollectionGeneral)[] = [
  "id",
  "prefLabelLg1",
  "prefLabelLg2",
  "descriptionLg1",
  "descriptionLg2",
  "created",
  "modified",
  "creator",
  "contributor",
  "validationState",
];

export const collectionGeneralFields: FieldSpec[] = fieldNames.map((name) => [name, false]);
