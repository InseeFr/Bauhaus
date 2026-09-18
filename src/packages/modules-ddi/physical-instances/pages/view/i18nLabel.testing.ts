/**
 * Remplacement de `react-i18next` pour les specs de l'en-tête de PI : la clé est renvoyée
 * telle quelle, suffixée de `:<label>` quand l'option `label` est fournie.
 *
 * Usage : `vi.mock("react-i18next", () => import("./i18nLabel.testing"));`
 */
const t = (key: string, opts?: Record<string, unknown>) =>
  opts?.label ? `${key}:${opts.label}` : key;

export const useTranslation = () => ({ t });
