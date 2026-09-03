import { buildEmptyWithContributor } from "@utils/build-general-proptypes";

import { CollectionGeneral } from "@model/concepts/collection";

import { collectionGeneralFields } from "./collectionGeneralFields";

export const emptyCollectionGeneralWithContributor = (
  defaultContributor: string,
): CollectionGeneral =>
  buildEmptyWithContributor(
    collectionGeneralFields,
    defaultContributor,
  ) as unknown as CollectionGeneral;
