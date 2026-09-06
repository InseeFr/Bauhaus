import { expect, test } from '@playwright/test';

/**
 * La nomenclature vient de `playwright/db/classifications.trig` (chargé par
 * `playwright/db/init.sh`) : une section `A` et une division `01` sous elle.
 */
const CLASSIFICATION = "Nomenclature d'activités (e2e)";
const SECTION = 'Agriculture, sylviculture et pêche (e2e)';
const DIVISION = 'Culture et production animale (e2e)';

/**
 * Parcours n°7 (consultation) : de la liste des nomenclatures à un poste
 * individuel, en passant par la liste des postes. Chaque étape interroge un
 * endpoint différent ; c'est le module le plus volumineux en lecture et le
 * seul dont la navigation est purement hiérarchique.
 */
test('navigue de la liste des nomenclatures jusqu’à un poste', async ({ page }) => {
	await page.goto('/classifications');
	await expect(page.getByRole('heading', { name: 'Classifications - Search' })).toBeVisible();

	await page.getByRole('link', { name: CLASSIFICATION }).click();
	await expect(page).toHaveURL(/\/classifications\/classification\/nafe2e$/);
	await expect(page.getByText('Publication status : Published')).toBeVisible();

	await page.getByRole('link', { name: 'All items' }).click();
	await expect(page).toHaveURL(/\/classifications\/classification\/nafe2e\/items$/);

	await page.getByRole('textbox', { name: 'Search...' }).fill('Agriculture');
	const item = page.getByRole('link', { name: `A - ${SECTION}` });
	await expect(item).toBeVisible();

	await item.click();
	await expect(page).toHaveURL(/\/classifications\/classification\/nafe2e\/item\/A$/);
	await expect(page.getByRole('heading', { name: SECTION })).toBeVisible();
});

/** L'arbre est une vue distincte, qui reconstruit la hiérarchie des postes. */
test('affiche l’arbre d’une nomenclature', async ({ page }) => {
	await page.goto('/classifications/classification/nafe2e');
	await page.getByRole('link', { name: 'View tree' }).click();

	await expect(page).toHaveURL(/\/classifications\/classification\/nafe2e\/tree$/);
	await expect(page.getByText(SECTION)).toBeVisible();

	// La division n'apparaît qu'une fois sa section dépliée : l'arbre doit donc
	// bien la rattacher à `A`, et pas la poser à la racine. Le chevron du nœud
	// est le seul bouton de la ligne — PrimeReact ne lui donne pas de nom.
	await expect(page.getByText(DIVISION)).toBeHidden();
	await page.getByRole('treeitem', { name: SECTION }).getByRole('button').click();
	await expect(page.getByText(DIVISION)).toBeVisible();
});
