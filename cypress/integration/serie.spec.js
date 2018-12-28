describe('Series page', () => {
	it('Should go the Series view page and come back', () => {
		cy.server().visit(`/operations/series`);
		cy.get('.list-group a')
			.first()
			.click();

		cy.url().should('include', '/operations/series/');
		cy.get('.btn-line button')
			.first()
			.click();
		cy.url().should('match', /\/operations\/series$/);
	});

	it('Should go the Series update page and come back', () => {
		cy.server().visit(`/operations/series`);
		cy.get('.list-group a')
			.first()
			.click();

		cy.url().should('include', '/operations/series/');

		cy.get('.btn-line a')
			.first()
			.click();

		cy.url().should('include', '/modify');

		cy.get('.btn-line button')
			.first()
			.click();

		cy.url().should('include', '/operations/series/');
		cy.get('.btn-line button')
			.first()
			.click();
		cy.url().should('match', /\/operations\/series$/);
	});

	it('Should go the Series update page', () => {
		cy.server().visit(`/operations/series`);
		cy.get('.list-group a')
			.first()
			.click();

		cy.url().should('include', '/operations/series/');

		cy.get('.btn-line a')
			.first()
			.click();

		cy.url().should('include', '/modify');

		cy.get('form input[disabled]').should('have.length', 2);

		cy.get('form .Select:not(.is-disabled) .Select-control').each($el => {
			const control = cy.wrap($el);

			control.click();
			control.click();

			control
				.get('.Select-option')
				.first()
				.should('be.visible');

			control
				.get('.Select-option')
				.first()
				.click();
		});

		cy.get('form .Select.is-disabled .Select-control').should('have.length', 1);

		cy.get('label img').should('have.length', 8);
		cy.get('.row:first-of-type > div.form-group').should('have.length', 2);
		cy.get('label span.boldRed').should('have.length', 0);
	});

	it('should handle multi Select component', () => {
		cy.server().visit(`/operations/series`);
		cy.get('.list-group a')
			.first()
			.click();

		cy.url().should('include', '/operations/series/');

		cy.get('.btn-line a')
			.first()
			.click();

		cy.url().should('include', '/modify');

		cy.get('.Select--multi')
			.first()
			.as('firstMultiSelect')
			.get('@firstMultiSelect')
			.find('.Select-multi-value-wrapper')
			.children('.Select-value')
			.then(children => {
				cy.get('@firstMultiSelect')
					.find('.Select-value')
					.should('have.length', children.length);

				cy.get('@firstMultiSelect').click();
				cy.get('@firstMultiSelect').click();

				cy.get('@firstMultiSelect')
					.get('.Select-option')
					.first()
					.should('be.visible');

				cy.get('@firstMultiSelect')
					.get('.Select-option')
					.first()
					.click();

				cy.get('@firstMultiSelect')
					.find('.Select-value')
					.should('have.length', children.length + 1);

				cy.get('@firstMultiSelect')
					.find('.Select-value-icon')
					.first()
					.click();
				cy.get('@firstMultiSelect')
					.find('.Select-value')
					.should('have.length', children.length);
			});
	});
});
