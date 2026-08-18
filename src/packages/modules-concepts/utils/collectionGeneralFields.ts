import { CollectionGeneral } from "@model/concepts/collection";

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

export const collectionGeneralFields: string[][] = fieldNames.map((name) => [name, ""]);
