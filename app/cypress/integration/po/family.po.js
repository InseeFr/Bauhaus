export class FamiliesPage {
	go() {
		cy.server().visit(`/operations/families`);
	}
	getNewButton() {
		return cy.get('.btn-group-vertical a').first();
	}
	goToCreationPage() {
		this.getNewButton().click();
	}
	getFamiliesList() {
		return cy.get('.list-group-item');
	}
	getNthElementFromList(nth) {
		return cy.get(`.list-group :nth-child(${nth}) a`);
	}
	getPaginationBlock() {
		return cy.get('.bauhaus-pagination li');
	}
	search(value) {
		return cy.get('input').type(value);
	}
	resetSearch(value) {
		return cy.get('input').clear();
	}
	selectFamily() {
		cy.get('.list-group a')
			.first()
			.click();
	}
}
export class FamilyEditPage {
	getBackButton() {
		return cy.get('.btn-line button').first();
	}
	goBack() {
		this.getBackButton().click();
	}
	getTitle() {
		return cy.get('.bauhaus-page-title');
	}
	getErrorsBlock() {
		return '.alert';
	}
	getPrefLabelLg1() {
		return '#prefLabelLg1';
	}
	getPrefLabelLg2() {
		return '#prefLabelLg2';
	}
}
