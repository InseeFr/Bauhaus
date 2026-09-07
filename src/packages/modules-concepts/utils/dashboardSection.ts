export type DashboardTab = "concepts" | "collections";
export type DashboardView = "summary" | "creations" | "modifications";

export interface DashboardSectionState {
  tab: DashboardTab;
  view: DashboardView;
}

export const DASHBOARD_TABS: DashboardTab[] = ["concepts", "collections"];
export const DASHBOARD_VIEWS: DashboardView[] = ["summary", "creations", "modifications"];

/** Clé retenue dans l'URL pour une vue précise d'un onglet. */
export const dashboardSectionKey = (tab: DashboardTab, view: DashboardView) => `${tab}-${view}`;

const isTab = (value: string): value is DashboardTab =>
  DASHBOARD_TABS.includes(value as DashboardTab);
const isView = (value: string): value is DashboardView =>
  DASHBOARD_VIEWS.includes(value as DashboardView);

/**
 * Traduit la clé retenue dans l'URL en ce qu'il faut afficher. Une clé peut
 * désigner un onglet entier (`collections`) ou une de ses vues
 * (`collections-modifications`).
 */
export const resolveDashboardSection = (key?: string | null): DashboardSectionState => {
  const defaults: DashboardSectionState = { tab: "concepts", view: "summary" };

  if (!key) return defaults;
  if (isTab(key)) return { ...defaults, tab: key };

  const [tab, view] = key.split("-");
  if (isTab(tab) && isView(view)) return { tab, view };
  return defaults;
};
