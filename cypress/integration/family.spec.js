import { FamiliesPage, FamilyEditPage } from './po/family.po';

describe('Family page', () => {
	let polyfill;
	const familiesPage = new FamiliesPage();
	const familyEditPage = new FamilyEditPage();

	before(() => {
		const polyfillUrl = 'https://unpkg.com/unfetch/dist/unfetch.umd.js';
		cy.request(polyfillUrl).then(response => {
			polyfill = response.body;
		});
	});

	it('Families view page', () => {
		cy.server()
			.fixture('families')
			.then(json => {
				cy.route(Cypress.env('API') + 'operations/families', json);
			});

		familiesPage.go();
		familiesPage.getFamiliesList().should('have.length', 10);
		familiesPage.getPaginationBlock().should('have.length', 7);
		familiesPage.search('INSEE');
		familiesPage.getFamiliesList().should('have.length', 0);
		familiesPage.resetSearch();
		familiesPage.getFamiliesList().should('have.length', 10);
	});

	it('Should go the Family view page', () => {
		familiesPage.go();
		familiesPage.selectFamily();
		cy.url().should('include', '/operations/family/');
		familyEditPage.goBack();
		cy.url().should('match', /\/operations\/families$/);

		familiesPage.selectFamily();
		cy.url().should('include', '/operations/family/');
		cy.get('.panel-body > ul > :nth-child(1) > a').click();
		cy.url().should('include', '/operations/series/s1284');
		cy.get('.btn-line button')
			.first()
			.click();
		cy.url().should('include', '/operations/family/');
	});

	it('Should go the Family creation page and come back', () => {
		familiesPage.go();
		familiesPage.getNewButton().should('be.visible');
		familiesPage.getNewButton().click();
		cy.url().should('match', /\/operations\/family\/create$/);
		familyEditPage.goBack();
		cy.url().should('match', /\/operations\/families$/);
	});

	it('Should create a new family', () => {
		familiesPage.go();
		familiesPage.getNewButton().should('be.visible');
		familiesPage.goToCreationPage();
		cy.url().should('match', /\/operations\/family\/create$/);
		familyEditPage.getTitle().should('not.exist');
	});

	it('Should go the Family update page and come back', () => {
		familiesPage.go();
		cy.get('.list-group a')
			.first()
			.click();

		cy.url().should('include', '/operations/family/');

		cy.get('.btn-line a')
			.first()
			.click();

		cy.url().should('include', '/modify');

		cy.get('.btn-line button')
			.first()
			.click();

		cy.url().should('include', '/operations/family/');
		cy.get('.btn-line button')
			.first()
			.click();
		cy.url().should('match', /\/operations\/families$/);
	});

	it('Should go the Family update page', () => {
		familiesPage.go();
		cy.get('.list-group a')
			.first()
			.click();

		cy.url().should('include', '/operations/family/');

		cy.get('.btn-line a')
			.first()
			.click();

		cy.url().should('include', '/modify');

		cy.get('label img').should('have.length', 6);
	});
});
