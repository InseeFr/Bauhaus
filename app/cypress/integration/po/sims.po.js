export class SimsViewPage {
	getTitle() {
		return '.bauhaus-page-title';
	}

	getUpdateButton() {
		return 'div:nth-child(4) > a';
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
		return '.btn-line div:first > button';
	}

	getSaveButton() {
		return '.btn-line div:nth-child(3) > button';
	}
}
