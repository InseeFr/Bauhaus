import { test, expect } from '@playwright/test';

test('Should display an error is the backend is not on', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByText('Metadata management application')).toBeVisible();
});

test('test', async ({ page }) => {
	await page.goto('/');
	await page.getByRole('link', { name: 'Opérations operations' }).click();
	await page.getByRole('link', { name: 'Familles' }).click();
	await page.getByRole('link', { name: 'Nouvelle' }).click();
	await page.getByLabel('Intitulé*').click();
	await page.getByLabel('Intitulé*').click();
	await page.getByLabel('Intitulé*').fill('test');
	await page.getByLabel('Intitulé*').press('Tab');
	await page.getByLabel('Title*').fill('test');
	await page.getByRole('button', { name: 'Sauvegarder' }).click();
	await expect(page.locator('h2')).toContainText('test');
});
