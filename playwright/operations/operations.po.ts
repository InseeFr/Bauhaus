import { Page } from '@playwright/test';
import { expect } from '@playwright/test';

abstract class OperationsPageObject {
	protected page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	abstract goTo();

	async goToFormPage() {
		await this.page.getByRole('link', { name: 'New' }).click();
		await expect(this.page.getByText('Cancel')).toBeVisible();
	}

	async publish() {
		await this.page.getByRole('button', { name: 'Publish' }).click();
		await expect(this.page.getByText('Published')).toBeVisible();
	}

	async createReport() {
		await this.page.getByRole('link', { name: 'Create the report' }).click();
	}
}

export class FamilyPageObject extends OperationsPageObject {
	goTo() {
		return this.page.getByRole('link', { name: 'Families' }).click();
	}

	async fillForm({
		prefLabelLg1,
		prefLabelLg2,
		themeLg1,
		themeLg2,
	}: {
		prefLabelLg1: string;
		prefLabelLg2: string;
		themeLg1: string;
		themeLg2: string;
	}) {
		await this.page.getByLabel('Intitulé*').click();
		await this.page.getByLabel('Intitulé*').fill(prefLabelLg1);
		await this.page.getByLabel('Title*').click();
		await this.page.getByLabel('Title*').fill(prefLabelLg2);
		await this.page.getByLabel('Thème').click();
		await this.page.getByLabel('Thème').fill(themeLg1);
		await this.page.getByLabel('Theme').click();
		await this.page.getByLabel('Theme').fill(themeLg2);
		await this.page.getByRole('button', { name: 'Save' }).click();
	}
}

export class OperationPageObject extends OperationsPageObject {
	goTo() {
		return this.page.getByRole('link', { name: 'Operations' }).click();
	}

	async fillForm({
		series,
		prefLabelLg1,
		prefLabelLg2,
		shortLabelLg1,
		shortLabelLg2,
		year,
	}: {
		series: string;
		prefLabelLg1: string;
		prefLabelLg2: string;
		shortLabelLg1: string;
		shortLabelLg2: string;
		year: string;
	}) {
		await this.page
			.locator('.Select-multi-value-wrapper')
			.getByText('Series')
			.click();
		await this.page.getByLabel(series).click();
		await this.page.getByLabel('Intitulé*').click();
		await this.page.getByLabel('Intitulé*').fill(prefLabelLg1);
		await this.page.getByLabel('Title*').click();
		await this.page.getByLabel('Title*').fill(prefLabelLg2);
		await this.page.getByLabel('Nom court').click();
		await this.page.getByLabel('Nom court').fill(shortLabelLg1);
		await this.page.getByLabel('Short name').click();
		await this.page.getByLabel('Short name').fill(shortLabelLg2);
		await this.page.getByLabel('Year').click();
		await this.page.getByLabel('Year').fill(year);
		await this.page.getByRole('button', { name: 'Save' }).click();
	}
}
