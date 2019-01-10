describe('Family page', () => {
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
