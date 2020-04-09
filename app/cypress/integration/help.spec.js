describe('Help Page', function() {
	it(`Should display the Help page and manage the show/hide feature`, function() {
		cy.server().visit(`/operations/help`);

		//Should see both blocks
		cy.get(`.navbar-right li:nth-child(2)`).should('have.class', 'active');
		cy.get('.msd__outline').should('be.visible');
		cy.get('.msd__content').should('be.visible');

		// Should see only summary
		cy.get('button[title="open summary"]').click();
		cy.get('.msd__outline').should('be.visible');
		cy.get('.msd__content').should('not.be.visible');

		// Should see both blocks
		cy.get('.msd__panel-trigger_right').click();
		cy.get('.msd__outline').should('be.visible');
		cy.get('.msd__content').should('be.visible');

		// Should see only main content
		cy.get('button[title="open content"]').click();
		cy.get('.msd__outline').should('not.be.visible');
		cy.get('.msd__content_alone').should('be.visible');

		// Should see both blocks
		cy.get('.msd__panel-trigger_left').click();
		cy.get('.msd__outline').should('be.visible');
		cy.get('.msd__content').should('be.visible');
	});

	it(`Should manage the collapsible panel feature`, function() {
		cy.server().visit(`/operations/help`);
		cy.get('.msd__outline-content li:nth-child(1) .msd__item').should(
			'not.be.visible'
		);
		cy.get(
			'.msd__outline-content li:nth-child(1) .msd__outline-primary-updown'
		).click();
		cy.get('.msd__outline-content li:nth-child(1) .msd__item').should(
			'be.visible'
		);
		cy.get(
			'.msd__outline-content li:nth-child(1) .msd__outline-primary-updown'
		).click();
		cy.get('.msd__outline-content li:nth-child(1) .msd__item').should(
			'not.be.visible'
		);
	});
});
