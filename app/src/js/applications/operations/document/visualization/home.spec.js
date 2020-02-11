import React from 'react';
import OperationsDocumentationVisualization from './home';
import { shallow } from 'enzyme';
import { Note }  from '@inseefr/ui';

const langs = { lg1: 'lg1', lg2: 'lg2' };
const document = {
	descriptionLg1: 'descriptionLg1',
	descriptionLg2: 'descriptionLg2',
	uri: 'uri/page/1',
	url: 'url',
	updatedDate: '2019/02/01',
};
describe('OperationsDocumentationVisualization', () => {
	it('should display by default two notes', () => {
		const wrapper = shallow(
			<OperationsDocumentationVisualization
				secondLang={false}
				attr={document}
				langs={langs}
			/>
		);
		const notes = wrapper.find(Note);
		expect(notes).toHaveLength(2);

		expect(notes.get(0).props.text).toBe(document.descriptionLg1);
		expect(notes.get(0).props.alone).toBe(true);

		expect(notes.get(1).props.text.type).toBe('a');
		expect(notes.get(1).props.text.props.href).toBe(document.url);
		expect(notes.get(1).props.text.props.rel).toBe('noopener noreferrer');
		expect(notes.get(1).props.text.props.target).toBe('_blank');
		expect(notes.get(1).props.text.props.children).toBe(document.url);
	});

	it('should display a note if the secondLang flag is true', () => {
		const wrapper = shallow(
			<OperationsDocumentationVisualization
				attr={document}
				langs={langs}
				secondLang={true}
			/>
		);
		const notes = wrapper.find(Note);
		expect(notes).toHaveLength(3);

		expect(notes.get(0).props.text).toBe(document.descriptionLg1);
		expect(notes.get(0).props.alone).toBe(false);

		expect(notes.get(1).props.text).toBe(document.descriptionLg2);
	});
	it('should display a note if the object is a document', () => {
		const d = {
			...document,
			uri: '/document/uri',
		};
		const wrapper = shallow(
			<OperationsDocumentationVisualization
				attr={d}
				langs={langs}
				secondLang={true}
			/>
		);
		const notes = wrapper.find(Note);
		expect(notes).toHaveLength(5);
	});
});
