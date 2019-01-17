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

		// Quand on click sur le bouton Voir le SIMS on doit est rediriger vers la page SIMS edit et avoir un bouton duplicate
		cy.get(':nth-child(3) > .btn').click();
		cy.url().should('contains', '/sims/1512');
		cy.get('.btn-line').within(btns => {
			cy.get('div:first > button').contains('Retour');
			cy.get('div:nth-child(3) > a').contains('Modifier');
		});

		// Quand on click sur le bouton Voir le SIMS on doit est rediriger vers la page SIMS create et ne pas avoir de  bouton duplicate

		// Quand on click sur le bouton Edit on est redireiger vers upadte et ne contiens pas de bouton duplicate
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
		cy.url().should('contains', '/sims/create');
		cy.get('.btn-line').within(btns => {
			cy.get('div:first > button').contains('Annuler');
			cy.get('div:nth-child(3) > button').contains('Sauvegarder');
		});
	});
});
