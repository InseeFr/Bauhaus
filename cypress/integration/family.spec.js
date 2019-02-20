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

		cy.server().visit(`/operations/families`);
		cy.get('.list-group-item').should('have.length', 10);
		cy.get('.page-item').should('have.length', 7);
		cy.get('input').type('INSEE');
		cy.get('.list-group-item').should('have.length', 0);
		cy.get('input').clear();
		cy.get('.list-group-item').should('have.length', 10);
	});

	it('Should go the Family view page and come back', () => {
		cy.server().visit(`/operations/families`);
		cy.get('.list-group a')
			.first()
			.click();

		cy.url().should('include', '/operations/family/');
		cy.get('.btn-line button')
			.first()
			.click();
		cy.url().should('match', /\/operations\/families$/);
	});

	it('Should go the Family creation page and come back', () => {
		cy.server().visit(`/operations/families`);
		cy.get(familiesPage.getNewButton()).should('be.visible');
		cy.get(familiesPage.getNewButton()).click();
		cy.url().should('match', /\/operations\/family\/create$/);
		cy.get(familyEditPage.getBackButton())
			.first()
			.click();

		cy.url().should('match', /\/operations\/families$/);
	});

	it('Should create a new family', () => {
		cy.server().visit(`/operations/families`);
		cy.get(familiesPage.getNewButton()).should('be.visible');
		cy.get(familiesPage.getNewButton()).click();
		cy.url().should('match', /\/operations\/family\/create$/);
		cy.get(familyEditPage.getTitle()).should('not.exist');
		cy.get('form input[disabled]').should('have.length', 0);
	});

	it('Should go the Family update page and come back', () => {
		cy.server().visit(`/operations/families`);
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
		cy.server().visit(`/operations/families`);
		cy.get('.list-group a')
			.first()
			.click();

		cy.url().should('include', '/operations/family/');

		cy.get('.btn-line a')
			.first()
			.click();

		cy.url().should('include', '/modify');
		cy.get('form input[disabled]').should('have.length', 4);

		cy.get('label img').should('have.length', 6);
	});
});
