import {
  createDictionary,
  firstLang,
  getLang,
  secondLang,
} from "@utils/dictionnary";

import appD from "./dictionary/app";
import classificationsD from "./dictionary/classifications";
import conceptsD from "./dictionary/concepts";
import errors from "./dictionary/errors";
import { dictionary as DDIDictionary } from "./dictionary/ddi";

const dictionary = {
  ...appD,
  ...conceptsD,
  ...classificationsD,
  operationsTitle: { fr: "Opérations", en: "Operations" },
  structuresTitle: { fr: "Structures", en: "Structures" },
  codelistsTitle: { fr: "Listes de codes", en: "Codelists" },
  datasetsTitle: { fr: "Jeux de données", en: "Datasets" },
  ...DDIDictionary,
  ...errors,
};

export const D1 = createDictionary(firstLang, dictionary);
export const D2 = createDictionary(secondLang, dictionary);

export default getLang() === firstLang ? D1 : D2;
