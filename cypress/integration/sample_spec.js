describe('Main Layout', function() {
	it('Should display an error message if the backoffice is not reachable', function() {
		cy.server();
		cy.route(
			'http://localhost:8080/api/operations/series',

			[{ id: 's1161', label: 'Base permanente des équipements' }]
		);
		cy.visit('/operations/series');
		cy.contains('Error');
	});
});
