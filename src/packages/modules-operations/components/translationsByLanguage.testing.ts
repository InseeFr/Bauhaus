type TranslationsByLanguage = Record<string, Record<string, string>>;

/**
 * Fabrique de mock partiel de `react-i18next` dont `t` résout la clé dans la langue
 * demandée par l'option `lng` (anglais par défaut), et renvoie la clé sinon.
 *
 * Usage (les fabriques de `vi.mock` sont hissées : on importe ce module dans la fabrique) :
 * `vi.mock("react-i18next", async (importOriginal) =>
 *   (await import("./translationsByLanguage.testing")).mockTranslationsByLanguage(importOriginal, {...}))`
 */
export const mockTranslationsByLanguage = async (
  importOriginal: <T>() => Promise<T>,
  translations: TranslationsByLanguage,
) => {
  const actual = await importOriginal<typeof import("react-i18next")>();
  return {
    ...actual,
    useTranslation: () => ({
      t: (key: string, options?: { lng?: string }) => {
        const lng = options?.lng || "en";
        return translations[lng]?.[key] || key;
      },
    }),
  };
};
