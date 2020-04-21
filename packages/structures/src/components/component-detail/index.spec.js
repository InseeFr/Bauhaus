import '@testing-library/jest-dom';
import React from 'react';
import { render } from '@testing-library/react';

import { ComponentDetail } from './';

describe('<ComponentDetail />', () => {
	const component = {
		id: '5e7334002a5c764f68247222',
		labelLg1: 'veniam non irure',
		labelLg2: 'nisi aliquip',
		type: 'http://purl.org/linked-data/cube#dimension',
		attachment: 'http://purl.org/linked-data/cube#Observation',
		concept: 439,
		isCoded: '<SyntaxError: missing ) after argument list>)',
		codeList: 942,
		range: 'http://www.w3.org/2001/XMLSchema#codeList',
	};

	const concepts = {
		[component.concept]: {
			altLabel: '',
			id: component.concept.toString(),
			label: 'Concept - Label ' + component.concept,
		},
	};
	const codesLists = {
		[component.codeList]: {
			altLabel: '',
			id: component.codeList.toString(),
			label: 'Code List - Label ' + component.codeList,
		},
	};
	it('should display the ComponentDetailEdit component', () => {
		const { container } = render(
			<ComponentDetail
				component={{ ...component, labelLg1: undefined }}
				concepts={concepts}
				codesLists={codesLists}
				handleBack={() => {}}
			></ComponentDetail>
		);
		expect(container.querySelector('input[type="text"]')).not.toBeNull();
	});
	it('should display the ComponentDetailView component', () => {
		const { container } = render(
			<ComponentDetail
				secondLang={true}
				component={{ ...component }}
				concepts={concepts}
				codesLists={codesLists}
				handleBack={() => {}}
			></ComponentDetail>
		);
		expect(container.querySelector('input[type="text"]')).toBeNull();
	});
	it('should display the sub title', () => {
		const { container } = render(
			<ComponentDetail
				secondLang={true}
				component={{ ...component }}
				concepts={concepts}
				codesLists={codesLists}
				handleBack={() => {}}
			></ComponentDetail>
		);
		expect(container.querySelector('h3')).not.toBeNull();
	});
});
