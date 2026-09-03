import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import fr from "./locales/fr.json";
import { getLang } from "../../utils/dictionnary";

// Chaque module possède sa propre instance : `init()` remplace le store de ressources
// au lieu de le compléter. Partager l'instance par défaut ferait donc perdre ses
// traductions au module chargé en premier dès qu'un autre module est visité.
const i18n = i18next.createInstance();

i18n.use(initReactI18next).init({
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

export default i18n;
