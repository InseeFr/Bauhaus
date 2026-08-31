import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import fr from "./locales/fr.json";
import { getLang } from "../../utils/dictionnary";

const codelistsI18n = i18next.createInstance();

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

export default codelistsI18n;
