import { expect, test } from '@playwright/test';

import { uniqueId, uniqueLabel } from '../helpers/data';
import { selectFirstOne, selectOne } from '../helpers/prime';

/**
 * Parcours critique n°3 (consultation) : depuis la liste des listes de codes,
 * ouvrir une liste et filtrer ses codes. Le tableau des codes est alimenté par
 * un endpoint paginé distinct de celui de la liste : c'est le seul endroit où
 * l'enchaînement des deux appels est vérifié.
 */
test('ouvre une liste de codes et filtre ses codes', async ({ page }) => {
	await page.goto('/codelists');
	await expect(page.getByRole('heading', { name: 'Codelists - Search' })).toBeVisible();

	await page.getByRole('link', { name: 'Catégorie de source' }).click();

	await expect(page).toHaveURL(/\/codelists\/CL_SOURCE_CATEGORY$/);
	await expect(page.getByRole('heading', { name: 'Catégorie de source' })).toBeVisible();
	await expect(page.getByRole('row', { name: 'A Données administratives' })).toBeVisible();

	await page.getByLabel('Search on codes :').fill('A');
	await expect(page.getByRole('row', { name: 'A Données administratives' })).toBeVisible();
	await expect(page.getByRole('row', { name: 'C Synthèse' })).toBeHidden();
});

/**
 * Parcours critique n°3 (écriture) : créer une liste de codes. La création
 * écrit trois URI (liste, codes, concept lié) qu'aucun test unitaire ne
 * confronte au back.
 */
test('crée une liste de codes et lui ajoute un code', async ({ page }) => {
	const id = uniqueId('CL');
	const labelLg1 = uniqueLabel('Liste de codes');

	await page.goto('/codelists');
	await page.getByRole('link', { name: 'New' }).click();
	await expect(page).toHaveURL(/\/codelists\/create$/);

	await page.getByLabel('URI wished for the codelist*').fill(id.toLowerCase());
	await page.getByLabel("Model wished for the codes' URIs*").fill(`${id.toLowerCase()}-code`);
	await page.getByLabel('URI of the linked concept*').fill(`${id.toLowerCase()}-concept`);
	await page.getByLabel('Identifier*').fill(id);
	await page.getByLabel('Libellé*').fill(labelLg1);
	await page.getByLabel('Label*', { exact: true }).fill(`${labelLg1} EN`);
	await selectFirstOne(page, 'Owner');
	await selectOne(page, 'Dissemination status', 'Privé');

	await page.getByRole('button', { name: 'Save' }).click();

	await expect(page).toHaveURL(new RegExp(`/codelists/${id}$`));
	await expect(page.getByRole('heading', { name: labelLg1 })).toBeVisible();

	// Ajout d'un code : le panneau des codes n'est éditable que depuis la
	// page de modification.
	const codeLabel = uniqueLabel('Code');
	await page.getByRole('link', { name: 'Update' }).click();
	await page.locator('#add-code').click();

	// Le formulaire du code vit dans un panneau latéral qui duplique les ids
	// du formulaire principal : on s'y limite explicitement.
	const codePanel = page.locator('.sliding-panel-container');
	await codePanel.locator('#code').fill('001');
	await codePanel.locator('#labelLg1').fill(codeLabel);
	await codePanel.locator('#labelLg2').fill(`${codeLabel} EN`);
	await codePanel.getByRole('button', { name: 'Save' }).click();

	await expect(page.getByRole('row', { name: `001 ${codeLabel}` })).toBeVisible();
});
