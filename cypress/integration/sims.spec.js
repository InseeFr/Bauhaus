describe('SIMS Page', function() {
	let polyfill;

	before(() => {
		const polyfillUrl = 'https://unpkg.com/unfetch/dist/unfetch.umd.js';
		cy.request(polyfillUrl).then(response => {
			polyfill = response.body;
		});
	});

	it(`Operation with SIMS`, function() {
		cy.server()
			.fixture('operation-with-sims')
			.then(json => {
				cy.route('http://localhost:8080/api/operations/operation/1', json);
			})
			.fixture('sims')
			.then(json => {
				cy.route(
					'http://localhost:8080/api/operations/metadataReport/1512',
					json
				);
			})

			.visit('/operations/operation/1', {
				onBeforeLoad(win) {
					delete win.fetch;
					win.eval(polyfill);
					win.fetch = win.unfetch;
				},
			});
		cy.get('.btn-line').contains('Voir le SIMS');
		cy.get('#operation-picker').should('not.exist');
		cy.get(':nth-child(3) > .btn').click();

		// Visu Page
		cy.url().should('contains', '/sims/1512');
		cy.get('.page-title-operations').should('exist');
		cy.get('div:nth-child(4) > a').click();

		// Update page
		cy.url().should('contains', '/sims/1512/modify');
		cy.get('.page-title-operations').should('exist');
		cy.get('.btn-line').within(() => {
			cy.get('div:first > button').contains('Annuler');
			cy.get('div:nth-child(3) > button').contains('Sauvegarder');
		});

		cy.get('#operation-picker').should('not.exist');
	});
	it(`Should duplicate a SIMS`, function() {
		cy.server()
			.fixture('operation-with-sims')
			.then(json => {
				cy.route('http://localhost:8080/api/operations/operation/1', json);
			})
			.fixture('sims')
			.then(json => {
				cy.route(
					'http://localhost:8080/api/operations/metadataReport/1512',
					json
				);
			})

			.visit('/operations/operation/1', {
				onBeforeLoad(win) {
					delete win.fetch;
					win.eval(polyfill);
					win.fetch = win.unfetch;
				},
			});
		cy.get('.btn-line').contains('Voir le SIMS');
		cy.get(':nth-child(3) > .btn').click();

		// Visu Page
		cy.url().should('contains', '/sims/1512');

		cy.get('.btn-line').within(btns => {
			cy.get('div:first > button').contains('Retour');
			cy.get('div:nth-child(3) > a').contains('Dupliquer');
			cy.get('div:nth-child(4) > a').contains('Modifier');
			cy.get('div:nth-child(3) > a').click();
		});

		// Duplicate page
		cy.url().should('contains', '/sims/1512/duplicate');
		cy.get('.page-title-operations').should('not.exist');
		cy.get('input[value="02/01/2019"]').should('exist');
		cy.get('.btn-line').within(() => {
			cy.get('div:first > button')
				.as('cancelButton')
				.contains('Annuler');
			cy.get('div:nth-child(3) > button').contains('Sauvegarder');

			cy.get('@cancelButton').click();
		});

		// Visu page
		cy.url().should('not.contains', '/sims/1512/duplicate');
		cy.get('.btn-line div:nth-child(3) > a').click();

		// Duplicate page
		cy.get('#operation-picker')
			.as('operation-picker')
			.should('exist');
		cy.get('@operation-picker').within(() => {
			cy.get('.Select-placeholder').contains('Opérations');
			cy.get('.Select-value-label').should('not.exist');
			cy.get('.Select-arrow-zone').click();
			cy.get('.Select-menu')
				.children()
				.should('have.length.greaterThan', 1);
			cy.get('.Select-option:nth-child(3)').click();
			cy.get('.Select-value-label').should('exist');
		});
	});

	it(`Operation without a SIMS`, function() {
		cy.server()
			.fixture('operation-without-sims')
			.then(json => {
				cy.route('http://localhost:8080/api/operations/operation/1', json);
			})

			.visit('/operations/operation/1', {
				onBeforeLoad(win) {
					delete win.fetch;
					win.eval(polyfill);
					win.fetch = win.unfetch;
				},
			});
		cy.get('.btn-line').contains('Créer le SIMS');
		cy.get(':nth-child(3) > .btn').click();

		// Create Page
		cy.url().should('contains', '/sims/create');
		cy.get('.page-title-operations').should('exist');
		cy.get('.btn-line').within(() => {
			cy.get('div:first > button').contains('Annuler');
			cy.get('div:nth-child(3) > button').contains('Sauvegarder');
		});
		cy.get('#operation-picker').should('not.exist');
	});
});
