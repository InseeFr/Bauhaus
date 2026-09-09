import { CollectionGeneral } from "@model/concepts/collection";

import { buildEmptyWithContributor } from "@utils/build-general-proptypes";

import { collectionGeneralFields } from "./collectionGeneralFields";

export const emptyCollectionGeneralWithContributor = (
  defaultContributor: string | undefined,
): CollectionGeneral =>
  buildEmptyWithContributor(
    collectionGeneralFields,
    defaultContributor,
  ) as unknown as CollectionGeneral;
