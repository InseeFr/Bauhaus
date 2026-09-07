import { dashboardSectionKey, resolveDashboardSection } from "./dashboardSection";

describe("resolveDashboardSection", () => {
  it("ouvre le récapitulatif des concepts sans clé", () => {
    expect(resolveDashboardSection()).toEqual({ tab: "concepts", view: "summary" });
  });

  it("ouvre le récapitulatif d'un onglet désigné sans vue", () => {
    expect(resolveDashboardSection("collections")).toEqual({
      tab: "collections",
      view: "summary",
    });
  });

  it("ouvre la vue désignée par une clé complète", () => {
    expect(resolveDashboardSection("collections-modifications")).toEqual({
      tab: "collections",
      view: "modifications",
    });
    expect(resolveDashboardSection("concepts-creations")).toEqual({
      tab: "concepts",
      view: "creations",
    });
  });

  it("retombe sur le défaut pour une clé inconnue", () => {
    expect(resolveDashboardSection("concepts-inconnue")).toEqual({
      tab: "concepts",
      view: "summary",
    });
    expect(resolveDashboardSection("nimporte-quoi")).toEqual({ tab: "concepts", view: "summary" });
  });
});

describe("dashboardSectionKey", () => {
  it("compose la clé retenue dans l'URL", () => {
    expect(dashboardSectionKey("collections", "creations")).toBe("collections-creations");
  });
});
