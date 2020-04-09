export class SimsViewPage {
	getTitle() {
		return '.wilco-page-title';
	}

	getPublishButton() {
		return '.action-toolbar div:nth-child(3) > button';
	}

	getUpdateButton() {
		return '.action-toolbar div:nth-child(4) > a';
	}

	getSecondLangCheckbox() {
		return '.wilco-second-lang-checkbox';
	}

	getDocumentsBlocForRubric(rubricId) {
		return cy.get(rubricId);
	}
}

export class SimsEditPage {
	getTitle() {
		return '.wilco-page-title';
	}
	p;
	getCancelButton() {
		return cy.get('.btn-line div:first > button');
	}

	getSaveButton() {
		return cy.get('.btn-line div:nth-child(2) > button');
	}
}
