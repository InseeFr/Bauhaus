import i18next from "i18next";
import { initReactI18next } from "react-i18next";

import { getLang } from "@utils/dictionary";

import en from "./locales/en.json";
import fr from "./locales/fr.json";

export const operationsI18n = i18next.createInstance();

operationsI18n.use(initReactI18next).init({
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
