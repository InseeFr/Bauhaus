import { DocumentMenu } from './po/document.po';

describe('Document page', () => {
	const documentMenu = new DocumentMenu();

	it('Document menu', () => {
		documentMenu.go();
		documentMenu
			.getMenuElement()
			.should('be.visible')
			.contains('Documents')
			.contains('Liens');
	});
});
