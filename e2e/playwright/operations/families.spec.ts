import { expect, test } from '@playwright/test';

import { uniqueLabel } from '../helpers/data';

/**
 * Parcours n°5 : créer une famille d'opérations, vérifier son affichage dans
 * les deux langues, puis la retrouver dans la liste.
 */
test('crée une famille et la retrouve dans la liste', async ({ page }) => {
	const prefLabelLg1 = uniqueLabel('Famille');
	const prefLabelLg2 = `${prefLabelLg1} EN`;

	await page.goto('/operations/families');
	await expect(page.getByRole('heading', { name: 'Families - Search' })).toBeVisible();
	await page.getByRole('link', { name: 'New' }).click();

	await page.getByLabel('Intitulé*').fill(prefLabelLg1);
	await page.getByLabel('Title*').fill(prefLabelLg2);
	await page.getByRole('button', { name: 'Save' }).click();

	await expect(page).toHaveURL(/\/operations\/family\/[^/]+$/);
	await expect(page.getByRole('heading', { name: prefLabelLg1 })).toBeVisible();

	await page.getByText('Display second language').click();
	await expect(page.getByRole('heading', { name: prefLabelLg2 })).toBeVisible();

	await page.getByRole('link', { name: 'Families' }).click();
	await page.getByRole('textbox', { name: 'Search...' }).fill(prefLabelLg1);
	await expect(page.getByRole('link', { name: prefLabelLg1 })).toBeVisible();
});
