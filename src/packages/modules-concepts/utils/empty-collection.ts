import { CollectionWithMembers } from "@model/concepts/collection";

import { emptyWithContributor as emptyGeneral } from "./collection-general";

const emptyCollection = (defaultContributor: string): CollectionWithMembers => ({
  general: emptyGeneral(defaultContributor),
  members: [],
});

export default emptyCollection;
