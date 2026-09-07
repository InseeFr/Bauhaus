import { expect, test } from '@playwright/test';

import { uniqueLabel } from '../helpers/data';
import { selectFirstOne, selectOne } from '../helpers/prime';

/**
 * Parcours critique n°2 : créer un concept (formulaire à onglets, éditeurs
 * riches), le retrouver dans la liste, puis le publier.
 */
test('crée un concept, le retrouve dans la liste et le publie', async ({ page }) => {
	const labelLg1 = uniqueLabel('Concept');
	const labelLg2 = `${labelLg1} EN`;

	await page.goto('/concepts');
	await page.getByRole('link', { name: 'New' }).click();
	await expect(page.getByRole('heading', { name: 'Create concept' })).toBeVisible();

	// Onglet « Informations générales »
	await page.getByLabel('Label (fr)*').fill(labelLg1);
	await page.getByLabel('Label (en)*').fill(labelLg2);
	await selectFirstOne(page, 'Owner');
	await selectOne(page, 'Dissemination status', 'Privé');

	// Section « Notes » : la définition en langue 1 est obligatoire. Le sommaire
	// a remplacé les onglets — chaque entrée est un bouton dont le nom accessible
	// porte aussi l'état de la note (« Empty » tant qu'elle est vide), et
	// l'ancrage de fin distingue « Définition » de « Définition courte ».
	const summary = page.getByRole('navigation', { name: 'General information' });
	await summary.getByRole('button', { name: 'Notes', exact: true }).click();
	await summary.getByRole('button', { name: /^Définition Empty$/ }).click();
	const definition = page
		.getByRole('region', { name: 'Définition', exact: true })
		.getByRole('textbox', { name: 'rdw-editor' })
		.first();
	await definition.click();
	await definition.fill('Définition posée par le test e2e.');

	await page.getByRole('button', { name: 'Save' }).click();

	// Le concept est créé et l'application redirige vers sa fiche.
	await expect(page).toHaveURL(/\/concepts\/[^/]+$/);
	await expect(page.getByRole('heading', { name: labelLg1 })).toBeVisible();
	const id = page.url().split('/').pop() as string;

	// Il est retrouvable depuis la liste.
	await page.goto('/concepts');
	await page.getByRole('textbox', { name: 'Search...' }).fill(labelLg1);
	await expect(page.getByRole('link', { name: labelLg1 })).toBeVisible();

	// Publication.
	await page.goto(`/concepts/${id}`);
	await page.getByRole('button', { name: 'Publish' }).click();
	await expect(page.getByText('Published')).toBeVisible();
});

/**
 * La définition en langue 1 est obligatoire, et son absence doit être signalée
 * même si elle est saisie dans un onglet différent de celui affiché.
 */
test('refuse d’enregistrer un concept sans définition', async ({ page }) => {
	await page.goto('/concepts/create');
	await expect(page.getByRole('heading', { name: 'Create concept' })).toBeVisible();

	await page.getByLabel('Label (fr)*').fill(uniqueLabel('Concept invalide'));
	await page.getByLabel('Label (en)*').fill('Invalid concept');
	await selectFirstOne(page, 'Owner');
	await selectOne(page, 'Dissemination status', 'Privé');

	await page.getByRole('button', { name: 'Save' }).click();

	await expect(page.getByText('You have errors in this form.')).toBeVisible();
	await expect(page).toHaveURL(/\/concepts\/create$/);
});
