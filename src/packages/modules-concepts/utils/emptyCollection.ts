import { CollectionWithMembers } from "@model/concepts/collection";

import { emptyCollectionGeneralWithContributor } from "./emptyCollectionGeneralWithContributor";

export const emptyCollection = (defaultContributor: string): CollectionWithMembers => ({
  general: emptyCollectionGeneralWithContributor(defaultContributor),
  members: [],
});
