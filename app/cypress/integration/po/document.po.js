export class DocumentMenu {
	go() {
		cy.server().visit(`/operations`);
	}
	getMenuElement() {
		return cy.get('.navbar-right > :nth-child(1) > a');
	}
}
