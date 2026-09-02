import { createDictionary, firstLang, getLang, secondLang } from "@utils/dictionary";

import appD from "./dictionary/app";
import errors from "./dictionary/errors";

const dictionary = {
  ...appD,
  conceptsTitle: { fr: "Concepts", en: "Concepts" },
  classificationsTitle: { fr: "Nomenclatures", en: "Classifications" },
  operationsTitle: { fr: "Opérations", en: "Operations" },
  structuresTitle: { fr: "Structures", en: "Structures" },
  codelistsTitle: { fr: "Listes de codes", en: "Codelists" },
  datasetsTitle: { fr: "Jeux de données", en: "Datasets" },
  ddiTitle: { fr: "Variables", en: "Variables" },
  ...errors,
};

export const D1 = createDictionary(firstLang, dictionary);
export const D2 = createDictionary(secondLang, dictionary);

export default getLang() === firstLang ? D1 : D2;
