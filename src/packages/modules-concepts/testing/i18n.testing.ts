export { withMockedTranslation } from "../../tests/react-i18next.testing";

/**
 * Module de remplacement minimal de `react-i18next` traduisant via le dictionnaire
 * renvoyé par `getTranslations` (lu à l'appel, pour rester compatible avec le hoisting de `vi.mock`).
 */
export const translatingWith = (getTranslations: () => Record<string, string>) => ({
  useTranslation: () => ({
    t: (key: string) => getTranslations()[key] ?? key,
  }),
});
