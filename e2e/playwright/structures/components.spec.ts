import { expect, test } from '@playwright/test';

import { uniqueId, uniqueLabel } from '../helpers/data';
import { selectFirstOne, selectOne } from '../helpers/prime';

/**
 * Parcours n°8 : créer une composante mutualisée, brique de base des
 * structures de données (DSD).
 *
 * Non-régression : le formulaire est enregistré tel qu'il est proposé, sans
 * toucher au champ « Contributeurs ». Ce champ a longtemps été pré-rempli avec
 * un timbre (`DG75-H250`), refusé par le back qui écrit `dc:contributor` avec
 * l'IRI d'une organisation — la création était donc impossible sans modifier
 * le champ.
 */
test('crée une composante mutualisée et la retrouve dans la liste', async ({ page }) => {
	const notation = uniqueId('COMP');
	const labelLg1 = uniqueLabel('Composante');

	await page.goto('/structures/components');
	await expect(page.getByRole('heading', { name: 'Components - Search' })).toBeVisible();
	await page.getByRole('link', { name: 'New' }).click();

	await page.getByLabel('Notation*').fill(notation);
	await page.getByLabel('Libellé*').fill(labelLg1);
	await page.getByLabel('Label*', { exact: true }).fill(`${labelLg1} EN`);
	await selectOne(page, 'Type', 'Attribute');
	await selectFirstOne(page, 'Owner');

	await page.getByRole('button', { name: 'Save' }).click();

	await expect(page).toHaveURL(/\/structures\/components\/[^/]+$/);
	await expect(page.getByRole('heading', { name: labelLg1 })).toBeVisible();

	await page.goto('/structures/components');
	await page.getByRole('textbox', { name: 'Search...' }).fill(labelLg1);
	await expect(page.getByRole('link', { name: labelLg1 })).toBeVisible();
});
