/**
 * Module de remplacement de `react-i18next` traduisant les clés de `translations` (les autres
 * clés sont renvoyées telles quelles).
 *
 * Usage : `vi.mock("react-i18next", async () =>
 *   (await import("<chemin>/translations.testing")).mockTranslations({ "clé": "Texte" }));`
 */
export const mockTranslations = (translations: Record<string, string>) => ({
  useTranslation: () => ({
    t: (key: string) => translations[key] || key,
  }),
});
