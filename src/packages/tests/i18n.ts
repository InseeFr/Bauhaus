import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { getLang } from "@utils/dictionnary";

import classificationsEn from "../modules-classifications/i18n/locales/en.json";
import classificationsFr from "../modules-classifications/i18n/locales/fr.json";
import codelistsEn from "../modules-codelists/i18n/locales/en.json";
import codelistsFr from "../modules-codelists/i18n/locales/fr.json";
import conceptsEn from "../modules-concepts/i18n/locales/en.json";
import conceptsFr from "../modules-concepts/i18n/locales/fr.json";
import datasetsEn from "../modules-datasets/i18n/locales/en.json";
import datasetsFr from "../modules-datasets/i18n/locales/fr.json";
import ddiEn from "../modules-ddi/i18n/locales/en.json";
import ddiFr from "../modules-ddi/i18n/locales/fr.json";
import operationsEn from "../modules-operations/i18n/locales/en.json";
import operationsFr from "../modules-operations/i18n/locales/fr.json";
import structuresEn from "../modules-structures/i18n/locales/en.json";
import structuresFr from "../modules-structures/i18n/locales/fr.json";

type TranslationTree = Record<string, unknown>;

// Chaque module a sa propre instance i18n isolée (voir modules-*/i18n/index.ts) :
// ce fichier n'existe que pour les tests, qui rendent des composants de
// n'importe quel module et ont donc besoin de toutes les ressources à la fois,
// fusionnées dans une instance dédiée, elle aussi isolée du singleton global.
const deepMerge = (...trees: TranslationTree[]): TranslationTree =>
  trees.reduce((merged, tree) => {
    for (const [key, value] of Object.entries(tree)) {
      const isPlainObject = (v: unknown): v is TranslationTree =>
        !!v && typeof v === "object" && !Array.isArray(v);
      merged[key] =
        isPlainObject(merged[key]) && isPlainObject(value)
          ? deepMerge(merged[key] as TranslationTree, value)
          : value;
    }
    return merged;
  }, {} as TranslationTree);

const en = deepMerge(
  classificationsEn,
  codelistsEn,
  conceptsEn,
  datasetsEn,
  ddiEn,
  operationsEn,
  structuresEn,
);
const fr = deepMerge(
  classificationsFr,
  codelistsFr,
  conceptsFr,
  datasetsFr,
  ddiFr,
  operationsFr,
  structuresFr,
);

const resources = {
  en: { translation: en },
  fr: { translation: fr },
};

const initOptions = {
  resources,
  lng: getLang(),
  fallbackLng: "fr",
  interpolation: {
    escapeValue: false,
  },
  initImmediate: false,
  showSupportNotice: false,
};

export const testsI18n = i18n.createInstance();
testsI18n.use(initReactI18next).init(initOptions);
