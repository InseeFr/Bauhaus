import { test, expect } from '@playwright/test';

test('Should create a new family', async ({ page }) => {
	await page.goto('/');
	await page.getByRole('link', { name: 'Operations' }).click();
	await page.getByRole('link', { name: 'Families' }).click();
	await page.getByRole('link', { name: 'New' }).click();
	await page.getByLabel('Intitulé*').click();
	await page.getByLabel('Intitulé*').fill('Familie 1');
	await page.getByLabel('Title*').click();
	await page.getByLabel('Title*').fill('Familie 2');
	await page.getByLabel('Thème').click();
	await page.getByLabel('Thème').fill('Theme 1');
	await page.getByLabel('Theme').click();
	await page.getByLabel('Theme').fill('Theme 2');
	await page.getByRole('button', { name: 'Save' }).click();
	await expect(page.locator('h2')).toContainText('Familie 1');
	await page.getByText('Display second language').click();
	await expect(page.locator('h2')).toContainText('" Familie 2 "');
	await page.getByRole('link', { name: 'Families' }).click();
	await expect(page.locator('#root-app')).toContainText('1 result');
	await expect(page.getByRole('link', { name: 'Familie 1' })).toBeVisible();
});
