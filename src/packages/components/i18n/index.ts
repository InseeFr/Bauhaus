import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import fr from "./locales/fr.json";
import { getLang } from "../../utils/dictionnary";

const componentsI18n = i18n.createInstance();

componentsI18n.use(initReactI18next).init({
  resources: {
    en: { translation: en as any },
    fr: { translation: fr as any },
  },
  lng: getLang(),
  fallbackLng: "fr",
  interpolation: {
    escapeValue: false,
  },
});

export default componentsI18n;
