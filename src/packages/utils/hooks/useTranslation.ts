import i18next from "i18next";
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
  const secondLangCode = i18next.language === "fr" ? "en" : "fr";
  const t2 = i18next.getFixedT(secondLangCode, ns ?? null);
  return { ...result, t2 };
};
