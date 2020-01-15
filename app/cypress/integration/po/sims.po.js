export class SimsViewPage {
	getTitle() {
		return '.bauhaus-page-title';
	}

	getPublishButton() {
		return 'div:nth-child(2) > button';
	}

	getUpdateButton() {
		return 'div:nth-child(3) > a';
	}

	getSecondLangCheckbox() {
		return '.bauhaus-second-lang-checkbox';
	}

	getDocumentsBlocForRubric(rubricId) {
		return cy.get(rubricId);
	}
}

export class SimsEditPage {
	getTitle() {
		return '.bauhaus-page-title';
	}
	p;
	getCancelButton() {
		return cy.get('.btn-line div:first > button');
	}

	getSaveButton() {
		return cy.get('.btn-line div:nth-child(2) > button');
	}
}
