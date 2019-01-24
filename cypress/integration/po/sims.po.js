export class SimsViewPage {
	getTitle() {
		return '.page-title-operations';
	}

	getUpdateButton() {
		return 'div:nth-child(4) > a';
	}
}

export class SimsEditPage {
	getTitle() {
		return '.page-title-operations';
	}

	getCancelButton() {
		return '.btn-line div:first > button';
	}

	getSaveButton() {
		return '.btn-line div:nth-child(3) > button';
	}
}
