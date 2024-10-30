import { test, expect } from '@playwright/test';

test('Should display an error is the backend is not on', async ({ page }) => {
	await page.goto('/');
	await page.getByText('Error');
});
