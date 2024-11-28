import { render } from '@testing-library/react';

import { DocumentsStoreProvider } from '../sims-creation/documents-store-context';
import SimsBlockRichText from './sims-block-richtext';

export const renderWithStore = (component) => {
	return render(
		<DocumentsStoreProvider value={{ documentStores: { lg1: [], lg2: [] } }}>
			{component}
		</DocumentsStoreProvider>,
	);
};

const documents = {
	labelLg1: 'sectionLg1',
	labelLg2: 'sectionLg2',
	documentsLg1: [
		{
			labelLg1: 'Page 1',
			labelLg2: 'Page 2',
			uri: '/page/1',
		},
		{
			labelLg1: 'Document 1',
			labelLg2: 'Document 2',
			uri: '/document/1',
		},
	],
	documentsLg2: [
		{
			labelLg1: 'Page 1',
			labelLg2: 'Page 2',
			uri: '/page/1',
		},
		{
			labelLg1: 'Document 1',
			labelLg2: 'Document 2',
			uri: '/document/1',
		},
	],
};
describe('<SimsBlockRichText />', () => {
	it('should display labelLg1', () => {
		const { container } = renderWithStore(
			<SimsBlockRichText currentSection={documents} isSecondLang={false} />,
		);
		expect(container.querySelector('p').innerHTML).toBe('sectionLg1');
	});
	it('should display labelLg2', () => {
		const { container } = renderWithStore(
			<SimsBlockRichText currentSection={documents} isSecondLang={true} />,
		);
		expect(container.querySelector('p').innerHTML).toBe('sectionLg2');
	});
	it('should display link/document Lg1', () => {
		const { container } = renderWithStore(
			<SimsBlockRichText currentSection={documents} isSecondLang={false} />,
		);
		expect(
			container.querySelector('.documentsbloc:nth-child(2) a').innerHTML,
		).toBe('Document 1');
		expect(
			container.querySelector('.documentsbloc:nth-child(4) a').innerHTML,
		).toBe('Page 1');
	});
	it('should display link/document Lg2', () => {
		const { container } = renderWithStore(
			<SimsBlockRichText currentSection={documents} isSecondLang={true} />,
		);
		expect(
			container.querySelector('.documentsbloc:nth-child(2) a').innerHTML,
		).toBe('Document 2');
		expect(
			container.querySelector('.documentsbloc:nth-child(4) a').innerHTML,
		).toBe('Page 2');
	});
});
