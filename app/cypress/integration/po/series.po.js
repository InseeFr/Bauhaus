export class SeriesPage {
	getNewButton() {
		return cy.get('.btn-group-vertical a').first();
	}
}

export class SeriesEditPage {
	getBackButton() {
		return '.btn-line button';
	}
	getTitle() {
		return '.bauhaus-page-title';
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
