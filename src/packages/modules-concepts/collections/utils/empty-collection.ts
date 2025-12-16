import { emptyWithContributor as emptyGeneral } from "./general";

const emptyCollection = (defaultContributor: string) => ({
  general: emptyGeneral(defaultContributor),
  members: [],
});

export default emptyCollection;
