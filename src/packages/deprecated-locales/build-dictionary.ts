import { createDictionary, firstLang, getLang, secondLang } from "@utils/dictionnary";

import appD from "./dictionary/app";
import classificationsD from "./dictionary/classifications";
import codelistsD from "./dictionary/codelists";
import conceptsD from "./dictionary/concepts";
import DSDsD from "./dictionary/dsds";
import errors from "./dictionary/errors";
import operationsD from "./dictionary/operations";
import { dictionary as DDIDictionary } from "./dictionary/ddi";

const dictionary = {
  ...appD,
  ...conceptsD,
  ...classificationsD,
  ...operationsD,
  ...DSDsD,
  ...codelistsD,
  ...errors,
  datasetsTitle: { fr: "Jeux de données", en: "Datasets" },
  ...DDIDictionary,
};

export const D1 = createDictionary(firstLang, dictionary);
export const D2 = createDictionary(secondLang, dictionary);

export default getLang() === firstLang ? D1 : D2;
