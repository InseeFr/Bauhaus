import AxeBuilder from '@axe-core/playwright';
import { expect, Page, test } from '@playwright/test';

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

const unexpectedViolations = async (page: Page, url: string) => {
	const { violations } = await new AxeBuilder({ page }).analyze();
	const unexpected = violations.filter((v) => !KNOWN_VIOLATIONS.includes(v.id));

	expect(
		unexpected.map((v) => `${v.id} (${v.impact}, ${v.nodes.length} nœuds)`),
		`nouvelles violations axe sur ${url}`,
	).toEqual([]);
};

for (const url of PAGES) {
	test(`aucune nouvelle violation d'accessibilité sur ${url}`, async ({ page }) => {
		await page.goto(url);
		await expect(page.getByRole('heading').first()).toBeVisible();
		// Le premier titre est celui de la bannière : il est là avant les données.
		// Sans ces deux attentes, axe analyse une page à moitié rendue et le
		// résultat dépend de la vitesse du back.
		await page.waitForLoadState('networkidle');
		await expect(page.getByRole('status')).toHaveCount(0);

		await unexpectedViolations(page, url);
	});
}

/**
 * L'état de chargement est un écran à part entière, que la boucle ci-dessus
 * attend justement de voir disparaître. On le fige en retardant la réponse du
 * back, plutôt que d'espérer l'attraper au passage.
 */
test("aucune nouvelle violation d'accessibilité pendant un chargement", async ({ page }) => {
	await page.route('**/codeList', async (route) => {
		await new Promise((resolve) => setTimeout(resolve, 3_000));
		await route.continue();
	});

	await page.goto('/codelists');
	await expect(page.getByRole('status')).toBeVisible();

	await unexpectedViolations(page, '/codelists (en chargement)');
});
