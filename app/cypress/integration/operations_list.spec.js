['families', 'series', ['operations', ''], 'indicators'].forEach(
	(page, index) => {
		let title = page;
		let path = page;

		if (Array.isArray(page)) {
			title = page[0];
			path = page[1];
		}
		describe(title, function() {
			it(`Should display the ${title} page`, function() {
				cy.server().visit(`/operations/${path}`);

				cy.get(`.navbar-nav li:nth-child(${index + 2})`).should(
					'have.class',
					'active'
				);
				cy.get('.navbar-nav li.active').should(lis => {
					expect(lis).to.have.length(1);
				});

				cy.get('.wilco-page-title').should('be.visible');
				cy.get('.list-group').should('be.visible');
				cy.get('.wilco-pagination').should('be.visible');

				cy.get('input').type('FAKE DATA');
				cy.get('p').should(p => {
					expect(p.first()).to.contain('0');
				});
				cy.get('.wilco-pagination li').should(lis => {
					expect(lis).to.have.length(0);
				});
			});
		});
	}
);
