import { expect, Locator, Page } from '@playwright/test';

/**
 * Les listes déroulantes de Bauhaus sont des composants PrimeReact
 * (`Dropdown` / `MultiSelect`) rendus dans un overlay détaché du champ, et le
 * plus souvent sans `htmlFor` reliant le `<label>` au champ. On les cible donc
 * par le bloc de formulaire qui porte le libellé, et on interagit via le
 * panneau ouvert.
 */

const widget = (page: Page, label: string, kind: '.p-dropdown' | '.p-multiselect'): Locator =>
	page
		.locator('.form-group, .p-field, label')
		.filter({ hasText: label })
		.filter({ has: page.locator(kind) })
		.first()
		.locator(kind)
		.first();

const openPanel = async (trigger: Locator, page: Page, panelSelector: string) => {
	await trigger.click();
	const panel = page.locator(panelSelector);
	await expect(panel).toBeVisible();
	return panel;
};

const filterPanel = async (panel: Locator, value: string) => {
	const filter = panel.locator('input.p-dropdown-filter, input.p-multiselect-filter');
	if (await filter.count()) {
		await filter.fill(value);
	}
};

/** Sélectionne une valeur nommée dans un `Dropdown` (choix simple). */
export const selectOne = async (page: Page, label: string, option: string) => {
	const panel = await openPanel(widget(page, label, '.p-dropdown'), page, '.p-dropdown-panel');
	await filterPanel(panel, option);
	await panel.getByRole('option', { name: option, exact: true }).first().click();
	await expect(panel).toBeHidden();
};

/**
 * Sélectionne la première valeur disponible d'un `Dropdown` et retourne son
 * libellé. Utile quand le test n'a pas besoin d'une valeur précise : le jeu de
 * données de référence n'a alors pas à être figé dans le test.
 */
export const selectFirstOne = async (page: Page, label: string): Promise<string> => {
	const panel = await openPanel(widget(page, label, '.p-dropdown'), page, '.p-dropdown-panel');
	const first = panel.getByRole('option').first();
	const text = ((await first.textContent()) ?? '').trim();
	await first.click();
	await expect(panel).toBeHidden();
	return text;
};

/** Coche une ou plusieurs valeurs nommées dans un `MultiSelect`. */
export const selectMany = async (page: Page, label: string, options: string[]) => {
	const panel = await openPanel(
		widget(page, label, '.p-multiselect'),
		page,
		'.p-multiselect-panel',
	);
	for (const option of options) {
		await filterPanel(panel, option);
		await panel.getByRole('option', { name: option, exact: true }).first().click();
	}
	await page.keyboard.press('Escape');
	await expect(panel).toBeHidden();
};

/**
 * Vide les valeurs déjà sélectionnées d'un `MultiSelect` (chips).
 *
 * Utile pour les champs « Contributeurs », que l'application pré-remplit avec
 * le timbre de l'utilisateur — une valeur que le back refuse (il attend l'IRI
 * d'une organisation). Voir le test `fixme` de
 * `structures/components.spec.ts`.
 */
export const clearChips = async (page: Page, label: string) => {
	const chips = page
		.locator('.form-group, .p-field, label')
		.filter({ hasText: label })
		.filter({ has: page.locator('.p-multiselect') })
		.first()
		.locator('.p-multiselect-token-icon');

	for (let remaining = await chips.count(); remaining > 0; remaining--) {
		await chips.first().click();
	}
	await expect(chips).toHaveCount(0);
};

/** Coche la première valeur disponible d'un `MultiSelect` et retourne son libellé. */
export const selectFirstMany = async (page: Page, label: string): Promise<string> => {
	const panel = await openPanel(
		widget(page, label, '.p-multiselect'),
		page,
		'.p-multiselect-panel',
	);
	const first = panel.getByRole('option').first();
	const text = ((await first.textContent()) ?? '').trim();
	await first.click();
	await page.keyboard.press('Escape');
	await expect(panel).toBeHidden();
	return text;
};

/**
 * Remplit un éditeur riche (react-draft-wysiwyg), qui n'est pas un `<input>`
 * mais un `contenteditable` exposé avec `aria-label="rdw-editor"`.
 */
export const fillRichText = async (editor: Locator, text: string) => {
	await editor.click();
	await editor.fill(text);
};
