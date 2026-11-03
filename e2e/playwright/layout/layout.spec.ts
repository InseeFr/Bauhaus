import { expect, Page, test } from "@playwright/test";

/**
 * Captures de référence de la mise en page : un écran par type (accueil, fiche,
 * formulaire, recherche) et par module, à deux largeurs, de part et d'autre de la
 * bascule de la grille (992px).
 *
 * Elles ne vérifient pas un parcours : elles signalent tout changement de mise en
 * page, voulu ou non. Après un changement voulu, régénérer les références :
 *     pnpm --dir e2e test layout --update-snapshots
 *
 * Elles ne lisent que des données de test fixes (fixtures de `pnpm e2e:stack`) :
 * à lancer avant tout test qui écrit, ou sur une base fraîchement rechargée.
 */
const SCREENS = [
  { name: "accueil", url: "/" },
  { name: "concepts-accueil", url: "/concepts" },
  { name: "concepts-fiche", url: "/concepts/c2000" },
  { name: "concepts-edition", url: "/concepts/c2000/modify" },
  { name: "concepts-recherche", url: "/concepts/search" },
  { name: "nomenclatures-accueil", url: "/classifications" },
  { name: "nomenclatures-fiche", url: "/classifications/classification/nafe2e" },
  { name: "nomenclatures-poste", url: "/classifications/classification/nafe2e/item/A" },
  { name: "nomenclatures-poste-edition", url: "/classifications/classification/nafe2e/item/A/modify" },
  { name: "series-accueil", url: "/operations/series" },
  { name: "series-fiche", url: "/operations/series/s1181" },
  { name: "series-edition", url: "/operations/series/s1181/modify" },
  { name: "series-recherche", url: "/operations/series/search" },
  { name: "familles-fiche", url: "/operations/family/s82" },
  { name: "familles-edition", url: "/operations/family/s82/modify" },
  { name: "operations-fiche", url: "/operations/operation/s1528" },
  { name: "operations-edition", url: "/operations/operation/s1528/modify" },
  { name: "indicateurs-fiche", url: "/operations/indicator/p1665" },
  { name: "indicateurs-edition", url: "/operations/indicator/p1665/modify" },
  { name: "documents-fiche", url: "/operations/document/709" },
  { name: "documents-edition", url: "/operations/document/709/modify" },
  { name: "sims-fiche", url: "/operations/sims/1518" },
  { name: "sims-edition", url: "/operations/sims/1518/modify" },
  { name: "arbre-operations", url: "/operations/tree" },
  { name: "listes-accueil", url: "/codelists" },
  { name: "listes-fiche", url: "/codelists/CL_SOURCE_CATEGORY" },
  { name: "listes-edition", url: "/codelists/CL_SOURCE_CATEGORY/modify" },
  { name: "listes-partielles-creation", url: "/codelists/partial/create" },
  { name: "structures-accueil", url: "/structures" },
  { name: "structures-fiche", url: "/structures/dsd1000" },
  { name: "structures-edition", url: "/structures/dsd1000/modify" },
  { name: "composantes-creation", url: "/structures/components/create" },
  { name: "jeux-accueil", url: "/datasets" },
  { name: "jeux-fiche", url: "/datasets/jeuDeDonneesThemesValides" },
  { name: "jeux-edition", url: "/datasets/jeuDeDonneesThemesValides/modify" },
  { name: "distributions-creation", url: "/datasets/distributions/create" },
];

const WIDTHS = [1280, 800];

/** Attend la fin des chargements visibles, puis fige ce qui bouge encore. */
const settle = async (page: Page) => {
  await page.waitForLoadState("networkidle");
  await expect(page.locator(".p-progress-spinner, [aria-busy='true']")).toHaveCount(0, {
    timeout: 20_000,
  });
  await page.evaluate(() => document.fonts.ready);
};

for (const width of WIDTHS) {
  test.describe(`${width}px`, () => {
    test.use({ viewport: { width, height: 900 } });

    for (const { name, url } of SCREENS) {
      test(name, async ({ page }) => {
        await page.goto(url);
        await settle(page);

        await expect(page).toHaveScreenshot(`${name}-${width}.png`, {
          fullPage: true,
          animations: "disabled",
          caret: "hide",
          // Dates et versions affichées changent d'un jour à l'autre.
          mask: [page.locator("#bauhausVersion"), page.locator("time")],
          maxDiffPixelRatio: 0.002,
        });
      });
    }
  });
}
