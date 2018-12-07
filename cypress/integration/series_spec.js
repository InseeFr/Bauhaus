describe('Main Layout', function() {
	it('Should display an error message if the backoffice is not reachable', function() {
		cy.server().visit('/operations/series');

		cy.get('.navbar-nav-operations li:nth-child(3)').should(
			'have.class',
			'active'
		);
		cy.get('.navbar-nav-operations li.active').should(lis => {
			expect(lis).to.have.length(1);
		});

		cy.get('h2.page-title-operations').should('be.visible');
		cy.get('.list-group').should('be.visible');
		cy.get('.pagination').should('be.visible');

		cy.get('input').type('Zenika');
		cy.get('h4').should(h4 => {
			expect(h4.first()).to.contain('0');
		});
		cy.get('.pagination li').should(lis => {
			expect(lis).to.have.length(0);
		});
	});
});
