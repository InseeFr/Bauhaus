import { buildEmptyWithContributor } from "@utils/build-general-proptypes";

import { CollectionGeneral } from "@model/concepts/collection";

import { collectionGeneralFields } from "./collectionGeneralFields";

export const emptyCollectionGeneralWithContributor = (
  defaultContributor: string | undefined,
): CollectionGeneral =>
  buildEmptyWithContributor(
    collectionGeneralFields,
    defaultContributor,
  ) as unknown as CollectionGeneral;
