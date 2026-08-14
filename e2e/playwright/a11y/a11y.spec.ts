import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

/**
 * Dette d'accessibilité connue au moment de l'écriture de ce test. Ces règles
 * sont violées sur la quasi-totalité des écrans de liste (contraste des
 * boutons, `<select>` « nombre d'éléments par page » sans nom accessible).
 * On ne les fait pas échouer — sinon la suite est rouge en permanence — mais
 * toute NOUVELLE règle violée casse le test.
 *
 * À vider au fur et à mesure des corrections : une entrée retirée d'ici
 * devient une garantie de non-régression.
 */
const KNOWN_VIOLATIONS = ['color-contrast', 'label', 'select-name'];

const PAGES = [
	'/',
	'/concepts',
	'/classifications',
	'/operations/series',
	'/structures',
	'/codelists',
	'/datasets',
];

for (const url of PAGES) {
	test(`aucune nouvelle violation d'accessibilité sur ${url}`, async ({ page }) => {
		await page.goto(url);
		await expect(page.getByRole('heading').first()).toBeVisible();

		const { violations } = await new AxeBuilder({ page }).analyze();
		const unexpected = violations.filter((v) => !KNOWN_VIOLATIONS.includes(v.id));

		expect(
			unexpected.map((v) => `${v.id} (${v.impact}, ${v.nodes.length} nœuds)`),
			`nouvelles violations axe sur ${url}`,
		).toEqual([]);
	});
}
