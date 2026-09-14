import { CollectionWithMembers } from "@model/concepts/collection";

import { emptyCollectionGeneralWithContributor } from "./emptyCollectionGeneralWithContributor";

export const emptyCollection = (defaultContributor: string | undefined): CollectionWithMembers => ({
  general: emptyCollectionGeneralWithContributor(defaultContributor),
  members: [],
});
