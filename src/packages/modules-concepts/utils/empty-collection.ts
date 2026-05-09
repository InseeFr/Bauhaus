import { emptyWithContributor as emptyGeneral } from "./collection-general";

const emptyCollection = (defaultContributor: string) => ({
  general: emptyGeneral(defaultContributor),
  members: [],
});

export default emptyCollection;
