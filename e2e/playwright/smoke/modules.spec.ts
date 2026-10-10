import { expect, test } from "@playwright/test";

/**
 * Fumée : depuis la page d'accueil, chaque module s'ouvre, monte son écran
 * d'accueil et charge ses données. C'est le filet qui attrape les régressions
 * de routage, de lazy loading et de contrat d'API — celles qui cassent un
 * module entier sans qu'aucun test unitaire ne bronche.
 */
const MODULES = [
  { tile: "Concepts", url: "/concepts", heading: "Concepts - Search" },
  { tile: "Classifications", url: "/classifications", heading: "Classifications - Search" },
  { tile: "Operations", url: "/operations/series", heading: "Series - Search" },
  { tile: "Data description", url: "/datasets", heading: "Datasets - Search" },
  { tile: "Administration", url: "/codelists", heading: "Codelists - Search" },
];

for (const { tile, url, heading } of MODULES) {
  test(`le module ${tile} s'ouvre depuis l'accueil`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));

    await page.goto("/");
    await page.getByRole("link", { name: tile, exact: true }).click();

    await expect(page).toHaveURL(new RegExp(`${url}$`));
    await expect(page.getByRole("heading", { name: heading })).toBeVisible();
    expect(errors, `erreurs JS non gérées sur ${url}`).toEqual([]);
  });
}

/**
 * Les formulaires de création montent et affichent leur bouton d'enregistrement.
 * Ils partagent des briques transverses (résolution du contributeur par défaut,
 * sélecteurs d'organisations) : une régression sur l'une d'elles les casse tous
 * à la fois.
 */
const CREATION_FORMS = [
  "/operations/series/create",
  "/operations/families/create",
  "/operations/operation/create",
  "/concepts/create",
  "/codelists/create",
  "/codelists/partial/create",
  "/datasets/create",
  "/structures/create",
  "/structures/components/create",
];

for (const url of CREATION_FORMS) {
  test(`le formulaire ${url} s'ouvre`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));

    await page.goto(url);

    await expect(page.getByRole("button", { name: "Save" })).toBeVisible();
    expect(errors, `erreurs JS non gérées sur ${url}`).toEqual([]);
  });
}

/**
 * Les modules regroupés sous une tuile s'atteignent par le menu commun de la tuile.
 */
test("le menu Administration mène aux structures", async ({ page }) => {
  await page.goto("/codelists");
  await page.getByRole("link", { name: "Structures", exact: true }).click();

  await expect(page).toHaveURL(/\/structures$/);
  await expect(page.getByRole("heading", { name: "Structures - Search" })).toBeVisible();
});

/**
 * Le module DDI (Variables) interroge Colectica : sans identifiants, l'API
 * répond 401 et la liste reste vide. On vérifie donc uniquement que le module
 * se monte — le parcours métier DDI demande un environnement Colectica.
 */
test("le menu Description des données mène aux variables (DDI)", async ({ page }) => {
  await page.goto("/datasets");
  await page.getByRole("link", { name: "Variables", exact: true }).click();

  await expect(page).toHaveURL(/\/ddi(\/physical-instances)?$/);
  await expect(page.getByRole("link", { name: "Variables", exact: true })).toHaveAttribute(
    "aria-current",
    "page",
  );
});
