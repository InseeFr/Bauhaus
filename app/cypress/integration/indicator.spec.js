describe('Indicator Page', function() {
	it(`Should go to the Indicator view page and come back`, function() {
		cy.server().visit(`/operations/indicators`);
		cy.get('.list-group a')
			.first()
			.click();

		cy.url().should('include', '/operations/indicator/');
		cy.get('.btn-line button')
			.first()
			.click();
		cy.url().should('match', /\/operations\/indicators$/);
	});
	it(`Should go to the Indicator creation page and come back`, function() {
		cy.server().visit(`/operations/indicators`);
		cy.get('.btn-group-vertical a')
			.first()
			.click();

		cy.url().should('include', '/operations/indicator/create');

		cy.get('.btn-line a')
			.first()
			.click();

		cy.url().should('match', /\/operations\/indicators$/);
	});
	it(`Should go to the creation page`, function() {
		cy.server().visit(`/operations/indicators`);
		cy.get('.btn-group-vertical a')
			.first()
			.click();
		cy.get('.alert-danger').should('be.visible');
		cy.get('.btn-line a')
			.first()
			.should('not.be.disabled');

		cy.get('.btn-line button')
			.first()
			.should('be.disabled');

		cy.get('form div:nth-child(1) input')
			.first()
			.type('name');
		cy.get('.btn-line button')
			.first()
			.should('be.disabled');

		cy.get('form input[type=text]').each($el => {
			cy.wrap($el).type('name');
		});
		cy.get('.btn-line button')
			.first()
			.should('not.be.disabled');
		cy.get('.alert-danger').should('not.be.visible');

		cy.get('form .Select-control').each($el => {
			const control = cy.wrap($el).click();
			cy.wrap($el).click();
			control
				.get('.Select-option')
				.first()
				.should('be.visible');
			control
				.get('.Select-option')
				.first()
				.click();
		});

		cy.get('label img').should('have.length', 8);
		cy.get('.row:first-of-type > div.form-group').should('have.length', 2);
		cy.get('label span.boldRed').should('have.length', 2);
	});
});
