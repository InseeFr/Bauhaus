import type * as ReactI18next from "react-i18next";

type ReactI18nextModule = typeof ReactI18next;

/**
 * Fabrique d'un mock partiel de `react-i18next` : `initReactI18next` reste réel (l'i18n
 * du module est initialisé au chargement de son bootstrap), seul `useTranslation` sans
 * instance explicite traduit à partir du dictionnaire fourni, la clé servant de repli.
 *
 * `vi.mock` étant remonté en tête de fichier, l'utiliser via un import dynamique :
 * `vi.mock("react-i18next", async (importOriginal) =>
 *   (await import("./react-i18next.testing")).mockTranslations(importOriginal, {...}))`
 */
export const mockTranslations = async (
  importOriginal: <T>() => Promise<T>,
  translations: Record<string, string>,
) => {
  const actual = await importOriginal<ReactI18nextModule>();
  return {
    ...actual,
    useTranslation: (ns?: string, options?: any) => {
      if (options?.i18n) {
        return actual.useTranslation(ns, options);
      }
      return { t: (key: string) => translations[key] ?? key };
    },
  };
};
