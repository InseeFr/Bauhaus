import { buildEmptyWithContributor } from "../../utils/build-general-proptypes";

import { conceptGeneralFieldsConfig } from "./conceptGeneralFieldsConfig";

export const emptyConceptGeneralWithContributor = (defaultContributor: string) =>
  buildEmptyWithContributor(conceptGeneralFieldsConfig, defaultContributor);
