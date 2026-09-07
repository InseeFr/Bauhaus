import { expect, test } from '@playwright/test';

import { uniqueLabel } from '../helpers/data';
import { SeriesPageObject } from './series.po';

/**
 * Parcours critique n°1 : créer une série d'opérations depuis la liste, la
 * retrouver dans la recherche, puis la publier.
 */
test('crée une série, la retrouve dans la liste et la publie', async ({ page }) => {
	const prefLabelLg1 = uniqueLabel('Serie');
	const prefLabelLg2 = `${prefLabelLg1} EN`;

	const series = new SeriesPageObject(page);
	await series.goToList();
	await series.goToCreationForm();

	await series.fillMandatoryFields({ prefLabelLg1, prefLabelLg2 });
	await series.save();

	// La série est créée et l'application redirige vers sa fiche.
	const id = await series.waitForVisualisation(prefLabelLg1);
	await expect(page.getByText('Provisional')).toBeVisible();

	// Elle est visible dans la seconde langue.
	await page.getByText('Display second language').click();
	await expect(page.getByRole('heading', { name: prefLabelLg2 })).toBeVisible();

	// Et elle est retrouvable depuis la liste.
	await series.goToList();
	await page.getByRole('textbox', { name: 'Search...' }).fill(prefLabelLg1);
	await expect(page.getByRole('link', { name: prefLabelLg1 })).toBeVisible();

	// Publication.
	await page.goto(`/operations/series/${id}`);
	await series.publish();
	await expect(page.getByText('Published')).toBeVisible();
});

/**
 * Le formulaire refuse une série sans famille ni intitulés : la validation
 * client est le dernier rempart avant des données incomplètes en base.
 */
test('refuse d’enregistrer une série sans les champs obligatoires', async ({ page }) => {
	const series = new SeriesPageObject(page);
	await series.goToList();
	await series.goToCreationForm();

	await page.getByLabel('Intitulé*').fill('x');
	await page.getByLabel('Intitulé*').fill('');
	await series.save();

	await expect(page.getByText('You have errors in this form.')).toBeVisible();
	await expect(page).toHaveURL(/\/operations\/series\/create$/);
});
