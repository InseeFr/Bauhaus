import i18next from "i18next";
import { initReactI18next } from "react-i18next";

import { getLang } from "@utils/dictionnary";

import en from "./locales/en.json";
import fr from "./locales/fr.json";

export const codelistsI18n = i18next.createInstance();

codelistsI18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    fr: { translation: fr },
  },
  lng: getLang(),
  fallbackLng: "fr",
  interpolation: {
    escapeValue: false,
  },
  showSupportNotice: false,
});
