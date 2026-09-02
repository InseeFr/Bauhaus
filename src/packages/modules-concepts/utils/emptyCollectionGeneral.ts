import { CollectionGeneral } from "@model/concepts/collection";

import { buildEmpty } from "@utils/build-general-proptypes";

import { collectionGeneralFields } from "./collectionGeneralFields";

export const emptyCollectionGeneral = (): CollectionGeneral =>
  buildEmpty(collectionGeneralFields) as unknown as CollectionGeneral;
