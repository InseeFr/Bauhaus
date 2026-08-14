import { expect, test } from '@playwright/test';

import { uniqueLabel } from '../helpers/data';
import { selectFirstOne } from '../helpers/prime';

/**
 * Parcours critique n°6 : créer une opération rattachée à une série, la
 * publier, puis initialiser son rapport qualité (SIMS). C'est la chaîne
 * série → opération → documentation, celle qui porte la valeur métier du
 * module Operations.
 */
test('crée une opération, la publie et initialise son rapport qualité', async ({ page }) => {
	const prefLabelLg1 = uniqueLabel('Operation');
	const prefLabelLg2 = `${prefLabelLg1} EN`;

	await page.goto('/operations/operations');
	await expect(page.getByRole('heading', { name: 'Operations - Search' })).toBeVisible();
	await page.getByRole('link', { name: 'New' }).click();

	await selectFirstOne(page, 'Series');
	await page.getByLabel('Intitulé*').fill(prefLabelLg1);
	await page.getByLabel('Title*').fill(prefLabelLg2);
	await page.getByLabel('Year').fill('2026');
	await page.getByRole('button', { name: 'Save' }).click();

	// L'opération est créée et l'application redirige vers sa fiche.
	await expect(page).toHaveURL(/\/operations\/operation\/[^/]+$/);
	await expect(page.getByRole('heading', { name: prefLabelLg1 })).toBeVisible();
	await expect(page.getByText('Year : 2026')).toBeVisible();

	// Publication.
	await page.getByRole('button', { name: 'Publish' }).click();
	await expect(page.getByText('Published')).toBeVisible();

	// Initialisation du rapport qualité (SIMS).
	await page.getByRole('link', { name: 'Create the report' }).click();
	await expect(
		page.getByRole('heading', { name: `Rapport qualité : ${prefLabelLg1}` }),
	).toBeVisible();
});
