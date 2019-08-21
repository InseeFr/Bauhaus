export class OperationsPage {
	getNewButton() {
		return '.operations-btn-group-vertical a';
	}
}

export class OperationEditPage {
	getBackButton() {
		return '.btn-line button';
	}
	getTitle() {
		return '.page-title-operations';
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
