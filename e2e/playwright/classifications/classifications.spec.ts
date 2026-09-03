import { expect, test } from '@playwright/test';

/**
 * Parcours n°7 (consultation) : de la liste des nomenclatures à un poste
 * individuel, en passant par la liste des postes. Chaque étape interroge un
 * endpoint différent ; c'est le module le plus volumineux en lecture et le
 * seul dont la navigation est purement hiérarchique.
 */
test('navigue de la liste des nomenclatures jusqu’à un poste', async ({ page }) => {
	await page.goto('/classifications');
	await expect(page.getByRole('heading', { name: 'Classifications - Search' })).toBeVisible();

	await page
		.getByRole('link', { name: "Nomenclature d'activités française - Edition 2025" })
		.click();
	await expect(page).toHaveURL(/\/classifications\/classification\/naf2025$/);
	await expect(page.getByText('Publication status : Published')).toBeVisible();

	await page.getByRole('link', { name: 'All items' }).click();
	await expect(page).toHaveURL(/\/classifications\/classification\/naf2025\/items$/);

	await page.getByRole('textbox', { name: 'Search...' }).fill('AGRICULTURE');
	const item = page.getByRole('link', { name: 'A - AGRICULTURE, SYLVICULTURE ET PÊCHE' });
	await expect(item).toBeVisible();

	await item.click();
	await expect(page).toHaveURL(/\/classifications\/classification\/naf2025\/item\/A$/);
	await expect(
		page.getByRole('heading', { name: 'AGRICULTURE, SYLVICULTURE ET PÊCHE' }),
	).toBeVisible();
});

/** L'arbre est une vue distincte, alimentée par un autre endpoint. */
test('affiche l’arbre d’une nomenclature', async ({ page }) => {
	await page.goto('/classifications/classification/naf2025');
	await page.getByRole('link', { name: 'View tree' }).click();

	await expect(page).toHaveURL(/\/classifications\/classification\/naf2025\/tree$/);
	await expect(page.getByText('AGRICULTURE, SYLVICULTURE ET PÊCHE')).toBeVisible();
});
