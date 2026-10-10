type ReactI18next = typeof import("react-i18next");

// Fabriques de mocks de `react-i18next`, partagées entre modules. Les specs les chargent par un
// `await import(...)` dans la fabrique d'un `vi.mock` hissé : ce module ne doit donc importer
// aucun module susceptible d'être lui-même mocké.

/** `useTranslation()` renvoie les clés telles quelles. */
export const translationKeysAsLabels = (actual: object) => ({
  ...actual,
  useTranslation: () => ({ t: (key: string) => key }),
});

/**
 * `useTranslation()` renvoie `translation`, sauf quand une instance i18n est passée
 * explicitement (composants partagés, qui gardent leur propre instance).
 */
export const withMockedTranslation = (actual: ReactI18next, translation: object) => ({
  ...actual,
  useTranslation: (...args: Parameters<ReactI18next["useTranslation"]>) =>
    args[1]?.i18n ? actual.useTranslation(...args) : translation,
});
