import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

['/'].forEach((url) => {
	test(`Should check accessibilituy for url ${url}`, async ({ page }) => {
		await page.goto('/');
		const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

		expect(accessibilityScanResults.violations).toEqual([]);
	});
});
