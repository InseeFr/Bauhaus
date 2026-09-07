import { expect, Page } from '@playwright/test';

import { selectFirstMany, selectFirstOne } from '../helpers/prime';

export class SeriesPageObject {
	constructor(private readonly page: Page) {}

	async goToList() {
		await this.page.goto('/operations/series');
		await expect(this.page.getByRole('heading', { name: 'Series - Search' })).toBeVisible();
	}

	async goToCreationForm() {
		await this.page.getByRole('link', { name: 'New' }).click();
		await expect(this.page).toHaveURL(/\/operations\/series\/create$/);
		await expect(this.page.getByRole('button', { name: 'Save' })).toBeVisible();
	}

	/** Renseigne les seuls champs obligatoires : famille, intitulés lg1/lg2, propriétaire. */
	async fillMandatoryFields({
		prefLabelLg1,
		prefLabelLg2,
	}: {
		prefLabelLg1: string;
		prefLabelLg2: string;
	}) {
		await selectFirstOne(this.page, 'Family');
		await this.page.getByLabel('Intitulé*').fill(prefLabelLg1);
		await this.page.getByLabel('Title*').fill(prefLabelLg2);
		await selectFirstMany(this.page, 'Owners');
	}

	async save() {
		await this.page.getByRole('button', { name: 'Save' }).click();
	}

	/** Attend la redirection vers la fiche de la série créée et retourne son identifiant. */
	async waitForVisualisation(prefLabelLg1: string): Promise<string> {
		await expect(this.page).toHaveURL(/\/operations\/series\/[^/]+$/);
		await expect(this.page.getByRole('heading', { name: prefLabelLg1 })).toBeVisible();
		return this.page.url().split('/').pop() as string;
	}

	async publish() {
		await this.page.getByRole('button', { name: 'Publish' }).click();
	}
}
