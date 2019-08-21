export class DocumentMenu {
	go() {
		cy.server().visit(`/operations`);
	}
	getMenuElement() {
		return cy.get('.nav > :nth-child(7) > a');
	}
}
