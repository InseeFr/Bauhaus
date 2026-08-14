import { expect, test } from '@playwright/test';

import { uniqueLabel } from '../helpers/data';
import { selectFirstMany, selectFirstOne, selectOne } from '../helpers/prime';

/**
 * Parcours critique n°4 : créer un jeu de données. Le formulaire est découpé
 * en sections navigables et la validation porte sur des champs répartis dans
 * deux d'entre elles — un cas que seuls les tests de bout en bout couvrent.
 */
test('crée un jeu de données et le retrouve dans la liste', async ({ page }) => {
	const labelLg1 = uniqueLabel('Jeu de donnees');
	const labelLg2 = `${labelLg1} EN`;

	await page.goto('/datasets');
	await page.getByRole('link', { name: 'New' }).click();
	await expect(page.getByRole('heading', { name: 'Create a new dataset' })).toBeVisible();

	// Section « Informations générales »
	await page.getByLabel('Intitulé*').fill(labelLg1);
	await page.getByLabel('Title*').fill(labelLg2);

	// Section « Gestion interne »
	await page.getByRole('button', { name: 'Internal management' }).click();
	await selectFirstOne(page, 'Owner');
	await selectFirstMany(page, 'Contributors');
	await selectOne(page, 'Dissemination status', 'Privé');
	await selectFirstMany(page, 'Produced from');

	await page.getByRole('button', { name: 'Save' }).click();

	// Le jeu de données est créé et l'application redirige vers sa fiche.
	await expect(page).toHaveURL(/\/datasets\/[0-9a-f-]{36}$/);
	await expect(page.getByRole('heading', { name: labelLg1 })).toBeVisible();

	// Il est retrouvable depuis la liste.
	await page.goto('/datasets');
	await page.getByRole('textbox', { name: 'Search...' }).fill(labelLg1);
	await expect(page.getByRole('link', { name: labelLg1 })).toBeVisible();
});
