describe('Home Page', function() {
	it(`Should go to the Concepts page and come back`, function() {
		cy.server().visit(`/`);

		cy.get('div.concepts a').click();

		cy.url().should('match', /\/concepts$/);
		cy.get('title').contains('Bauhaus - Concepts');
		cy.go('back');
		cy.get('h1').contains(
			'Application de gestion des métadonnées de référence'
		);
	});

	it(`Should go to the Nomenclatures page and come back`, function() {
		cy.server().visit(`/`);
		cy.get('div.classifications a').click();
		cy.url().should('match', /\/classifications$/);
		cy.get('title').contains('Bauhaus - Nomenclatures');
		cy.go('back');
		cy.get('h1').contains(
			'Application de gestion des métadonnées de référence'
		);
	});
	it(`Should go to the Operations page and come back`, function() {
		cy.server().visit(`/`);
		cy.get('div.operations a').click();
		cy.url().should('match', /\/operations\/series$/);
		cy.get('title').contains('Bauhaus - Opérations');
		cy.go('back');
		cy.get('h1').contains(
			'Application de gestion des métadonnées de référence'
		);
	});
	it(`Should contain a footer`, function() {
		cy.server().visit(`/`);
		cy.get('footer').should('exist');
	});
});
