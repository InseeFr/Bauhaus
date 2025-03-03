import { test, expect } from '@playwright/test';

import { FamilyPageObject, OperationPageObject } from './operations.po';

test('Should create a new family', async ({ page }) => {
	await page.goto('/');
	await page.getByRole('link', { name: 'Operations' }).click();

	const familyPage = new FamilyPageObject(page);

	await familyPage.goTo();
	await familyPage.goToFormPage();

	await familyPage.fillForm({
		prefLabelLg1: 'Familie 1',
		prefLabelLg2: 'Familie 2',
		themeLg1: 'Theme 1',
		themeLg2: 'Theme 2',
	});

	await expect(page.locator('h2')).toContainText('Familie 1');
	await page.getByText('Display second language').click();
	await expect(page.locator('h2')).toContainText('" Familie 2 "');
	await page.getByRole('link', { name: 'Families' }).click();
	await expect(page.locator('#root-app')).toContainText('57 results');
});

test('complete end-to-end test for module Operation', async ({ page }) => {
	await page.goto('/');
	await page.getByRole('link', { name: 'Operations' }).click();
	await expect(page.getByText('Series')).toBeVisible();

	const operationPage = new OperationPageObject(page);

	await operationPage.goTo();

	// Creating a new operation
	await operationPage.goToFormPage();
	const values = {
		series: 'Autres indicateurs',
		prefLabelLg1: 'Autres Indicateurs Op1',
		prefLabelLg2: 'Autres Indicateurs Op1',
		shortLabelLg1: 'OS1',
		shortLabelLg2: 'OS1',
		year: '2000',
	};

	await operationPage.fillForm(values);

	// Checking if the operation has been saved
	await operationPage.assertValues(values);
	await page.getByRole('link', { name: 'Operations' }).click();
	await page.getByRole('link', { name: 'Autres Indicateurs Op1' }).click();
	await operationPage.assertValues(values);

	// Publishing the operation
	await operationPage.publish();

	// Creating the Report
	await operationPage.createReport();
	await page
		.locator('[id="S\\.1\\.1"] .Select-multi-value-wrapper')
		.first()
		.click();
	await page.getByLabel('Administration du comité du').click();
	await page.getByRole('button', { name: 'Save' }).click();
	await page.getByRole('button', { name: 'Publish' }).click();

	await operationPage.goTo();

	// Creating a new operation
	await operationPage.goToFormPage();

	const values2 = {
		series: 'Autres indicateurs',
		prefLabelLg1: 'Autres Indicateurs Op2',
		prefLabelLg2: 'Autres Indicateurs Op2',
		shortLabelLg1: 'OS1',
		shortLabelLg2: 'OS1',
		year: '2000',
	};
	await operationPage.fillForm(values2);

	// Checking if the operation has been saved
	await operationPage.assertValues(values2);
	await page.getByRole('link', { name: 'Operations' }).click();
	await page.getByRole('link', { name: 'Autres Indicateurs Op2' }).click();
	await operationPage.assertValues(values2);

	// Publishing the operation
	await operationPage.publish();

	// Creating the Report
	await operationPage.createReport();

	await expect(
		page.getByRole('heading', {
			name: 'Rapport qualité : Autres Indicateurs Op2',
		}),
	).toBeVisible();

	await page.getByText('Create from an existing').click();
	await page.getByRole('option', { name: 'Autres Indicateurs Op1' }).click();

	await page
		.locator('[id="S\\.1\\.2"] .Select-multi-value-wrapper')
		.first()
		.click();
	await page.getByLabel('Administration du comité du').click();

	await page.locator('[id="S\\.1\\.3"] .form-control').first().click();
	await page.locator('[id="S\\.1\\.3"] .form-control').first().fill('Contact');

	await page.locator('[id="S\\.3\\.1"] .DraftEditor-root').first().click();
	await page
		.locator('[id="S\\.3\\.1"] .DraftEditor-root')
		.first()
		.getByRole('textbox', { name: 'rdw-editor' })
		.fill('Description');

	await page
		.locator('[id="S\\.3\\.1"]')
		.getByRole('button', { name: 'Ajoutez un lien' })
		.first()
		.click();
	await page
		.locator('[id="S\\.3\\.1"]')
		.getByRole('listitem')
		.filter({ hasText: 'Insee Résultats « Estimations' })
		.getByLabel('Add')
		.click();
	await page
		.locator('[id="S\\.3\\.1"]')
		.locator('div')
		.filter({ hasText: /^Ajoutez un lien 89$/ })
		.getByLabel('Add')
		.click();
	await page
		.locator('div')
		.filter({ hasText: /^Intitulé\*$/ })
		.getByRole('textbox')
		.click();
	await page
		.locator('div')
		.filter({ hasText: /^Intitulé\*$/ })
		.getByRole('textbox')
		.fill('Nouveau Lien');
	await page
		.locator('div')
		.filter({ hasText: /^Title\*$/ })
		.getByRole('textbox')
		.click();
	await page
		.locator('div')
		.filter({ hasText: /^Title\*$/ })
		.getByRole('textbox')
		.fill('Nouveau Lien');

	await page.getByRole('textbox', { name: 'Lien*' }).click();
	await page.getByRole('textbox', { name: 'Lien*' }).fill('http://lien.fr');
	await page
		.locator('.panel-container-right-enter-done .Select-multi-value-wrapper')
		.first()
		.click();

	await page.getByRole('option', { name: 'Français' }).click();
	await page
		.locator('.panel-container-right-enter-done')
		.getByRole('button', { name: 'Save' })
		.click();
	await expect(page.getByRole('textbox', { name: 'Lien*' })).not.toBeVisible();

	await page
		.locator('[id="I\\.6\\.3"] .Select-multi-value-wrapper')
		.first()
		.click();

	await page
		.getByRole('option', {
			name: "Enquête d'intérêt général et de qualité statistique",
			exact: true,
		})
		.click();
	await page.getByRole('button', { name: 'Save' }).click();

	await expect(
		page.getByText('State of the SIMS : Temporary, never published'),
	).toBeVisible();
	await page.getByRole('button', { name: 'Publish' }).click();
});
