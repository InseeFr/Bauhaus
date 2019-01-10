describe('Help Page', function() {
	it(`Should display the Help page and manage the show/hide feature`, function() {
		cy.server().visit(`/operations/help`);

		cy.get(`.navbar-right li:nth-child(1)`).should('have.class', 'active');
		cy.get('.sommaire-gauche').should('be.visible');
		cy.get('.sommaire-droite').should('be.visible');

		cy.get('button[title="open summary"]').click();
		cy.get('.sommaire-gauche').should('not.be.visible');
		cy.get('.sommaire-droite').should('be.visible');

		cy.get('.ouverture-sommaire').click();
		cy.get('.sommaire-gauche').should('be.visible');
		cy.get('.sommaire-droite').should('be.visible');

		cy.get('button[title="open content"]').click();
		cy.get('.sommaire-gauche').should('be.visible');
		cy.get('.sommaire-droite').should('not.be.visible');

		cy.get('.ouverture-contenu').click();
		cy.get('.sommaire-gauche').should('be.visible');
		cy.get('.sommaire-droite').should('be.visible');
	});

	it(`Should manage the collapsible panel feature`, function() {
		cy.server().visit(`/operations/help`);
		cy.get('.sommaire li:nth-child(1) .sommaire-item').should('not.be.visible');
		cy.get('.sommaire li:nth-child(1) .up-down').click();
		cy.get('.sommaire li:nth-child(1) .sommaire-item').should('be.visible');
		cy.get('.sommaire li:nth-child(1) .up-down').click();
		cy.get('.sommaire li:nth-child(1) .sommaire-item').should('not.be.visible');
	});
});
