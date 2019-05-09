import { SeriesPage, SeriesEditPage } from './po/series.po';

describe('Series page', () => {
	const seriesPage = new SeriesPage();
	const seriesEditPage = new SeriesEditPage();

	let polyfill;

	before(() => {
		const polyfillUrl = 'https://unpkg.com/unfetch/dist/unfetch.umd.js';
		cy.request(polyfillUrl).then(response => {
			polyfill = response.body;
		});
	});

	it('Should go the Series creation page and come back', () => {
		cy.server().visit(`/operations/series`);
		cy.injectAxe();

		cy.get(seriesPage.getNewButton()).should('be.visible');
		cy.checkA11y();
		cy.get(seriesPage.getNewButton()).click();
		cy.url().should('match', /\/operations\/series\/create$/);
		cy.get(seriesEditPage.getBackButton())
			.first()
			.click();

		cy.url().should('match', /\/operations\/series$/);
	});

	it('Should create a new series', () => {
		cy.server().visit(`/operations/series`);
		cy.get(seriesPage.getNewButton()).should('be.visible');
		cy.get(seriesPage.getNewButton()).click();
		cy.url().should('match', /\/operations\/series\/create$/);
		cy.get(seriesEditPage.getTitle()).should('not.exist');
		cy.get('form .Select-placeholder')
			.first()
			.should('contain', 'Familles');

		cy.get(seriesEditPage.getErrorsBlock()).should('be.visible');

		cy.get('.Select--single')
			.eq(0)
			.as('familySelect');
		cy.get('@familySelect').click();
		cy.get('@familySelect').click();

		cy.get('@familySelect')
			.get('.Select-option')
			.first()
			.should('be.visible');

		cy.get('@familySelect')
			.get('.Select-option')
			.first()
			.click();

		cy.get(seriesEditPage.getErrorsBlock()).should('be.visible');
		cy.get(seriesEditPage.getPrefLabelLg1()).type('test');

		cy.get(seriesEditPage.getErrorsBlock()).should('be.visible');

		cy.get(seriesEditPage.getPrefLabelLg2()).type('test');

		cy.get(seriesEditPage.getErrorsBlock()).should('not.be.visible');
	});

	it('Should go the Series view page and come back', () => {
		cy.server().visit(`/operations/series`);
		cy.get('.list-group a')
			.first()
			.click();

		cy.url().should('include', '/operations/series/');
		cy.get('.btn-line button')
			.first()
			.click();
		cy.url().should('match', /\/operations\/series$/);
	});

	it('Should go the Series update page and come back', () => {
		cy.server().visit(`/operations/series`);
		cy.get('.list-group a')
			.first()
			.click();

		cy.url().should('include', '/operations/series/');

		cy.get('.btn-line a')
			.eq(1)
			.click();

		cy.url().should('include', '/modify');

		cy.get('.btn-line button')
			.first()
			.click();

		cy.url().should('include', '/operations/series/');
		cy.get('.btn-line button')
			.first()
			.click();
		cy.url().should('match', /\/operations\/series$/);
	});

	it('Should go the Series update page', () => {
		cy.server().visit(`/operations/series`);
		cy.get('.list-group a')
			.first()
			.click();

		cy.url().should('include', '/operations/series/');

		cy.get('.btn-line a')
			.eq(1)
			.click();

		cy.url().should('include', '/modify');

		cy.get('form .Select:not(.is-disabled) .Select-control').each($el => {
			const control = cy.wrap($el);

			control.click();
			control.click();

			control
				.get('.Select-option')
				.first()
				.should('be.visible');

			control
				.get('.Select-option')
				.first()
				.click();
		});

		cy.get('form .Select.is-disabled .Select-control').should('have.length', 1);

		cy.get('label img').should('have.length', 8);
		cy.get('.row:first-of-type > div.form-group').should('have.length', 2);
		cy.get('label span.boldRed').should('have.length', 2);
	});
});
