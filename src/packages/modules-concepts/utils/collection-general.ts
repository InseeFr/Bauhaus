import { buildEmpty, buildEmptyWithContributor } from "@utils/build-general-proptypes";

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
  "isValidated",
];

export const fieldsWithRequired: string[][] = fieldNames.map((name) => [name, ""]);

export const empty = (): CollectionGeneral =>
  buildEmpty(fieldsWithRequired) as unknown as CollectionGeneral;

export const emptyWithContributor = (defaultContributor: string): CollectionGeneral =>
  buildEmptyWithContributor(fieldsWithRequired, defaultContributor) as unknown as CollectionGeneral;
