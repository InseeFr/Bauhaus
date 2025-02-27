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
	await expect(page.locator('#root-app')).toContainText('2 results');
	await expect(page.getByRole('link', { name: 'Familie 1' })).toBeVisible();
});

test('complete end-to-end test for module Operation', async ({ page }) => {
	await page.goto('/');
	await page.getByRole('link', { name: 'Operations' }).click();

	const operationPage = new OperationPageObject(page);

	await operationPage.goTo();
	await operationPage.goToFormPage();
	await operationPage.fillForm({
		series: 'Série Importée',
		prefLabelLg1: 'O1',
		prefLabelLg2: 'O1',
		shortLabelLg1: 'OS1',
		shortLabelLg2: 'OS1',
		year: '2000',
	});
	await expect(page.getByRole('heading', { name: 'O1' })).toBeVisible();
	await expect(
		page.getByText('State of the operation : Temporary, never published'),
	).toBeVisible();
	await expect(page.getByText('Year :')).toBeVisible();
	await page.getByRole('link', { name: 'Operations' }).click();
	await page.getByRole('link', { name: 'O1' }).click();
	await expect(page.getByRole('heading', { name: 'O1' })).toBeVisible();
	await operationPage.publish();
});
