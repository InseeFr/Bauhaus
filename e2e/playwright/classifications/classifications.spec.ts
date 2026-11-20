import { expect, test } from "@playwright/test";

/**
 * La nomenclature vient de `playwright/db/classifications.trig` (chargé par
 * `playwright/db/init.sh`) : une section `A` et une division `01` sous elle.
 */
const CLASSIFICATION = "Nomenclature d'activités (e2e)";
const SECTION = "Agriculture, sylviculture et pêche (e2e)";
const DIVISION = "Culture et production animale (e2e)";

/**
 * Parcours n°7 (consultation) : de la liste des nomenclatures à un poste
 * individuel, en passant par la liste des postes. Chaque étape interroge un
 * endpoint différent ; c'est le module le plus volumineux en lecture et le
 * seul dont la navigation est purement hiérarchique.
 */
test("navigue de la liste des nomenclatures jusqu’à un poste", async ({ page }) => {
  await page.goto("/classifications");
  await expect(page.getByRole("heading", { name: "Classifications - Search" })).toBeVisible();

  await page.getByRole("link", { name: CLASSIFICATION }).click();
  await expect(page).toHaveURL(/\/classifications\/classification\/nafe2e$/);
  await expect(page.getByText("Publication status : Published")).toBeVisible();

  await page.getByRole("link", { name: "All items" }).click();
  await expect(page).toHaveURL(/\/classifications\/classification\/nafe2e\/items$/);

  await page.getByRole("textbox", { name: "Search..." }).fill("Agriculture");
  const item = page.getByRole("link", { name: `A - ${SECTION}` });
  await expect(item).toBeVisible();

  await item.click();
  await expect(page).toHaveURL(/\/classifications\/classification\/nafe2e\/item\/A$/);
  await expect(page.getByRole("heading", { name: SECTION })).toBeVisible();
});

/** L'arbre est une vue distincte, qui reconstruit la hiérarchie des postes. */
test("affiche l’arbre d’une nomenclature", async ({ page }) => {
  await page.goto("/classifications/classification/nafe2e");
  await page.getByRole("link", { name: "View tree" }).click();

  await expect(page).toHaveURL(/\/classifications\/classification\/nafe2e\/tree$/);
  await expect(page.getByText(SECTION)).toBeVisible();

  // La division n'apparaît qu'une fois sa section dépliée : l'arbre doit donc
  // bien la rattacher à `A`, et pas la poser à la racine. Le chevron du nœud
  // est le seul bouton de la ligne — PrimeReact ne lui donne pas de nom.
  await expect(page.getByText(DIVISION)).toBeHidden();
  await page.getByRole("treeitem", { name: SECTION }).getByRole("button").click();
  await expect(page.getByText(DIVISION)).toBeVisible();
});

/**
 * Pilote TQ0d : la fiche d'une famille suspend sur ses lectures. En allant d'une
 * famille à l'autre, l'indicateur de chargement remplace la fiche précédente
 * sous le menu du module, au lieu de la laisser affichée le temps du chargement.
 * Les familles viennent de `playwright/db/classifications.trig`.
 */
test("affiche le chargement en passant d’une famille à l’autre", async ({ page }) => {
  await page.goto("/classifications/families");
  await page.getByRole("link", { name: "Famille d'activités (e2e)" }).click();
  await expect(page.getByRole("heading", { name: "Famille d'activités (e2e)" })).toBeVisible();

  // La seconde famille répond tard : le temps de voir ce qu'affiche l'écran pendant l'attente.
  let release: () => void = () => undefined;
  const answered = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route("**/classifications/family/fame2e2", async (route) => {
    await answered;
    await route.continue();
  });

  await page.goBack();
  await page.getByRole("link", { name: "Famille de produits (e2e)" }).click();

  await expect(page.getByRole("status")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Famille d'activités (e2e)" })).toBeHidden();
  await expect(page.getByRole("navigation").first()).toBeVisible();

  release();
  await expect(page.getByRole("heading", { name: "Famille de produits (e2e)" })).toBeVisible();
});
