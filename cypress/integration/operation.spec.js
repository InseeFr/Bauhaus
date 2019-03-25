import { OperationsPage, OperationEditPage } from './po/operation.po';

describe('Operation Page', function() {
	let polyfill;
	const operationsPage = new OperationsPage();
	const operationEditPage = new OperationEditPage();

	before(() => {
		const polyfillUrl = 'https://unpkg.com/unfetch/dist/unfetch.umd.js';
		cy.request(polyfillUrl).then(response => {
			polyfill = response.body;
		});
	});

	it(`Should go to the operation page and go back`, function() {
		cy.server().visit(`/operations`);
		cy.get('.list-group li:nth-child(1) a').click();
		cy.url().should('include', '/operations/operation');
		cy.get('.btn-line > div:nth-child(1) button').contains('Retour');
		cy.get('.btn-line > div:nth-child(1) button').click();
		cy.url().should('match', /\/operations$/);
	});

	it('Should go the Operations creation page and come back', () => {
		cy.server().visit(`/operations`);
		cy.get(operationsPage.getNewButton()).should('be.visible');
		cy.get(operationsPage.getNewButton()).click();
		cy.url().should('match', /\/operations\/operation\/create$/);
		cy.get(operationEditPage.getBackButton())
			.first()
			.click();

		cy.url().should('match', /\/operations$/);
	});
	it('Should create a new operation', () => {
		cy.server().visit(`/operations`);
		cy.get(operationsPage.getNewButton()).should('be.visible');
		cy.get(operationsPage.getNewButton()).click();
		cy.url().should('match', /\/operations\/operation\/create$/);
		cy.get(operationEditPage.getTitle()).should('not.exist');
		cy.get('form .Select-placeholder')
			.first()
			.should('contain', 'Séries');

		cy.get(operationEditPage.getErrorsBlock()).should('be.visible');

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

		cy.get(operationEditPage.getErrorsBlock()).should('be.visible');
		cy.get(operationEditPage.getPrefLabelLg1()).type('test');

		cy.get(operationEditPage.getErrorsBlock()).should('be.visible');

		cy.get(operationEditPage.getPrefLabelLg2()).type('test');

		cy.get(operationEditPage.getErrorsBlock()).should('not.be.visible');
	});

	it(`Should contain the content of an operation`, function() {
		cy.server()
			.fixture('operation-with-sims')
			.then(json => {
				cy.route(Cypress.env('API') + 'operations/operation/1', json);
			})

			.visit('/operations/operation/1', {
				onBeforeLoad(win) {
					delete win.fetch;
					win.eval(polyfill);
					win.fetch = win.unfetch;
				},
			});
		cy.get('.page-title-operations').contains(
			'Enquête annuelle de production 2013'
		);
	});
	it(`Should have a button to create a SIMS`, function() {
		cy.server()
			.fixture('operation-with-sims')
			.then(json => {
				cy.route(Cypress.env('API') + 'operations/operation/1', json);
			})

			.visit('/operations/operation/1', {
				onBeforeLoad(win) {
					delete win.fetch;
					win.eval(polyfill);
					win.fetch = win.unfetch;
				},
			});
		cy.get('.btn-line').contains('Voir le SIMS');
	});
	it(`Should have a button to update a SIMS`, function() {
		cy.server()
			.fixture('operation-without-sims')
			.then(json => {
				cy.route(Cypress.env('API') + 'operations/operation/1', json);
			})

			.visit('/operations/operation/1', {
				onBeforeLoad(win) {
					delete win.fetch;
					win.eval(polyfill);
					win.fetch = win.unfetch;
				},
			});
		cy.get('.btn-line').contains('Créer le SIMS');
	});
	it(`Should go to the update page and go back`, function() {
		cy.server()
			.fixture('operation-with-sims')
			.then(json => {
				cy.route(Cypress.env('API') + 'operations/operation/1', json);
			})

			.visit('/operations/operation/1', {
				onBeforeLoad(win) {
					delete win.fetch;
					win.eval(polyfill);
					win.fetch = win.unfetch;
				},
			});
		cy.get('.page-title-operations').contains(
			'Enquête annuelle de production 2013'
		);
		cy.get('a[href="/operations/operation/1/modify"]').click();
		cy.url().should('match', /\/operations\/operation\/1\/modify$/);
		cy.get('.btn-line button')
			.first()
			.click();
		cy.url().should('match', /\/operations\/operation\/1$/);
	});
});
