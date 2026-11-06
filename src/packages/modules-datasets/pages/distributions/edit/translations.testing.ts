/**
 * Module `react-i18next` simulé : `t` rend la traduction connue, sinon la clé.
 * À appeler depuis la factory d'un `vi.mock`, via un import dynamique.
 */
export const translationsModule = (translations: Record<string, string>) => ({
  useTranslation: () => ({
    t: (key: string) => translations[key] || key,
  }),
});
