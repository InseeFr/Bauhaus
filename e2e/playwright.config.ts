import { defineConfig, devices } from '@playwright/test';

const CI = !!process.env.CI;

/**
 * @see https://playwright.dev/docs/test-configuration
 *
 * Ce fichier doit rester à la racine de `e2e/` : c'est le répertoire depuis
 * lequel `npx playwright test` est lancé, et Playwright ne cherche la config
 * que dans son cwd.
 */
export default defineConfig({
	testDir: './playwright',
	/* Run tests in files in parallel */
	fullyParallel: false,
	/* Fail the build on CI if you accidentally left test.only in the source code. */
	forbidOnly: CI,
	/* Retry on CI only */
	retries: CI ? 1 : 0,
	/* Les tests écrivent dans le même dépôt RDF : un seul worker. */
	workers: 1,
	timeout: 60_000,
	expect: { timeout: 10_000 },
	/* Reporter to use. See https://playwright.dev/docs/test-reporters */
	reporter: CI ? [['github'], ['html', { open: 'never' }]] : [['list'], ['html', { open: 'never' }]],
	/* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
	use: {
		/* Base URL to use in actions like `await page.goto('/')`. */
		baseURL: 'http://localhost:3000',

		/* L'IHM choisit sa langue via navigator.language : on la fige pour que
		   les libellés attendus par les tests soient déterministes. */
		locale: 'en-US',

		trace: 'retain-on-failure',
		screenshot: 'only-on-failure',
	},

	/* Configure projects for major browsers */
	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] },
		},
	],
	webServer: {
		command: 'pnpm start',
		cwd: '..',
		env: {
			VITE_API_BASE_HOST: process.env.VITE_API_BASE_HOST ?? 'http://localhost:8080/api',
		},
		url: 'http://localhost:3000',
		reuseExistingServer: !CI,
		timeout: 180_000,
	},
});
