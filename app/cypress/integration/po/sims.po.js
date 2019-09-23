export class SimsViewPage {
	getTitle() {
		return '.page-title-operations';
	}

	getUpdateButton() {
		return 'div:nth-child(5) > a';
	}

	getDocumentsBlocForRubric(rubricId) {
		return cy.get(rubricId);
	}
}

export class SimsEditPage {
	getTitle() {
		return '.page-title-operations';
	}
	p;
	getCancelButton() {
		return '.btn-line div:first > button';
	}

	getSaveButton() {
		return '.btn-line div:nth-child(3) > button';
	}
}
