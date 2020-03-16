import React from 'react';
import { render } from '@testing-library/react';
import { DocumentsBloc } from './index';
import { sortArray } from 'js/utils/array-utils';
import { getLang } from '@inseefr/wilco';

jest.mock('js/applications/operations/msd/utils');

const documents = [
	{
		uri: 'uri1-bis',
		url: 'http://google.fr?q=url-1',
		updatedDate: '2019-03-04T10:00:00.000Z',
		labelLg1: 'B labelLg1-0',
		labelLg2: 'B labelLg2-0',
		lang: 'fr',
		descriptionLg1: 'descriptionLg1',
		descriptionLg2: 'descriptionLg2',
		aside: `fr-${new Intl.DateTimeFormat(getLang()).format(
			new Date('2019-03-04T10:00:00.000Z')
		)}`,
	},
	{
		uri: 'uri2-bis',
		url: 'http://google.fr?q=url-2',
		updatedDate: '2019-04-04T10:00:00.000Z',
		labelLg1: 'A labelLg1-1',
		labelLg2: 'A labelLg2-1',
		descriptionLg1: 'descriptionLg1-2',
		descriptionLg2: 'descriptionLg2-2',
		aside: `${new Intl.DateTimeFormat(getLang()).format(
			new Date('2019-04-04T10:00:00.000Z')
		)}`,
	},
	{
		uri: 'uri3-bis',
		url: 'http://google.fr?q=url-2',
		labelLg1: 'Z labelLg1-2',
		labelLg2: 'Z labelLg2-2',
		lang: 'fr',
		descriptionLg1: 'descriptionLg1-2',
		descriptionLg2: 'descriptionLg2-2',
		aside: 'fr',
	},
];

describe('DocumentsBloc', () => {
	it('should display nothing if the documents props is not defined', () => {
		const { container } = render(<DocumentsBloc />);
		expect(container.querySelectorAll('.documentsbloc')).toHaveLength(0);
	});
	it('should display nothing if the documents props is an empty array', () => {
		const { container } = render(<DocumentsBloc documents={[]} />);
		expect(container.querySelectorAll('.documentsbloc')).toHaveLength(0);
	});

	it('should display nothing if the documents props is an empty array', () => {
		const { container } = render(
			<DocumentsBloc documents={documents} documentStores={documents} />
		);
		expect(container.querySelectorAll('li')).toHaveLength(3);
	});

	it('should display the Lg1 label and description ordered by label', () => {
		const { container } = render(
			<DocumentsBloc documents={documents} documentStores={documents} />
		);
		const orderedList = sortArray('labelLg1')(documents);

		const lis = container.querySelectorAll('li');
		for (let i = 0; i < lis.length; i++) {
			expect(lis[i].outerHTML).toEqual(
				`<li class="list-group-item documentbloc__item"><span><a target="_blank" rel="noopener noreferrer" href="${orderedList[i].url}" title="${orderedList[i].descriptionLg1}">${orderedList[i].labelLg1}</a><i> (${orderedList[i].aside})</i></span></li>`
			);
		}
	});
	it('should display the Lg2 label and description ordered by label', () => {
		const { container } = render(
			<DocumentsBloc
				documents={documents}
				localPrefix="Lg2"
				documentStores={documents}
			/>
		);
		const orderedList = sortArray('labelLg2')(documents);

		const lis = container.querySelectorAll('li');
		for (let i = 0; i < lis.length; i++) {
			expect(lis[i].outerHTML).toEqual(
				`<li class="list-group-item documentbloc__item"><span><a target="_blank" rel="noopener noreferrer" href="${orderedList[i].url}" title="${orderedList[i].descriptionLg2}">${orderedList[i].labelLg2}</a><i> (${orderedList[i].aside})</i></span></li>`
			);
		}
	});

	describe.each`
		lang     | expectedEdit | expectedView
		${'Lg2'} | ${0}         | ${0}
		${'Lg1'} | ${3}         | ${0}
	`('$a + $b', ({ lang, expectedEdit, expectedView }) => {
		it('should not display delete buttons', () => {
			const { container } = render(
				<DocumentsBloc
					documents={documents}
					localPrefix={lang}
					editMode={false}
					documentStores={documents}
				/>
			);

			expect(container.querySelectorAll('.documentsbloc__delete')).toHaveLength(
				expectedView
			);
		});

		it('should display zero delete buttons', () => {
			const { container } = render(
				<DocumentsBloc
					documents={documents}
					localPrefix={lang}
					editMode={true}
					documentStores={documents}
				/>
			);

			expect(container.querySelectorAll('.documentsbloc__delete')).toHaveLength(
				expectedEdit
			);
		});
	});

	it('should display the Add Document button if there is not more document to add', () => {
		const { container } = render(
			<DocumentsBloc
				documents={documents}
				localPrefix="Lg1"
				editMode={true}
				documentStores={documents}
			/>
		);

		expect(container.querySelectorAll('.documentsbloc__add')).toHaveLength(1);
	});
	it('should display the Add Document button if there is more than on document available', () => {
		const { container } = render(
			<DocumentsBloc
				documents={documents}
				localPrefix="Lg1"
				editMode={true}
				documentStores={[
					...documents,
					{
						uri: 'new-uri',
						...documents[0],
					},
				]}
			/>
		);

		expect(container.querySelectorAll('.documentsbloc__add')).toHaveLength(1);
	});

	it('should not display the Add Document button for Lg2', () => {
		const { container } = render(
			<DocumentsBloc
				documents={documents}
				localPrefix="Lg2"
				editMode={false}
				documentStores={documents}
			/>
		);

		expect(container.querySelectorAll('.documentsbloc__add')).toHaveLength(0);
	});
});
