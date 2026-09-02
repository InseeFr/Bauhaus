import {
  useTranslation as useI18nextTranslation,
  type UseTranslationOptions,
  type UseTranslationResponse,
} from "react-i18next";

type UseTranslationResult = UseTranslationResponse<string, undefined> & {
  t2: UseTranslationResponse<string, undefined>["t"];
};

export const useTranslation = (
  ns?: string,
  options?: UseTranslationOptions<undefined>,
): UseTranslationResult => {
  const result = useI18nextTranslation(ns, options);
  // L'instance vient du `I18nextProvider` du module courant : chaque module a la
  // sienne, l'instance par défaut d'i18next n'est jamais initialisée.
  const { i18n } = result;
  const secondLangCode = i18n.language === "fr" ? "en" : "fr";
  const t2 = i18n.getFixedT(secondLangCode, ns ?? null);
  // `UseTranslationResponse` est à la fois un tuple et un objet : le diffuser
  // ({...result}) perdrait les index numériques. On enrichit donc l'objet en place.
  return Object.assign(result, { t2 });
};
