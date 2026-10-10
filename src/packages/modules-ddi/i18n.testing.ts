/**
 * Module de remplacement de `react-i18next` pour les specs du module DDI : la clé est
 * renvoyée telle quelle, suivie des options sérialisées quand il y en a.
 *
 * Usage : `vi.mock("react-i18next", () => import("<chemin>/i18n.testing"));`
 */
const t = (key: string, options?: Record<string, unknown>) =>
  options ? `${key}|${JSON.stringify(options)}` : key;

export const useTranslation = () => ({ t });
