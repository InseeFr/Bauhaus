/** Mock du module `i18n` des structures, limité aux traductions fournies (fr par défaut). */
export const structuresI18nWith = (translations: Record<string, Record<string, string>>) => ({
  structuresI18n: {
    t: (key: string, options?: { lng?: string }) => {
      const lng = options?.lng ?? "fr";
      return translations[lng]?.[key] ?? key;
    },
  },
});

export const requiredError = (label: string) =>
  `The property <strong>${label}</strong> is required.`;
