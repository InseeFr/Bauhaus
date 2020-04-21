import '@testing-library/jest-dom';
import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';

import { ComponentDetail } from './';

import configureStore from 'redux-mock-store';

const mockStore = configureStore([]);
const store = mockStore({});

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

	const concepts = [
		{
			altLabel: '',
			id: component.concept.toString(),
			label: 'Concept - Label ' + component.concept,
		},
	];
	const codesLists = [
		{
			altLabel: '',
			id: component.codeList.toString(),
			label: 'Code List - Label ' + component.codeList,
		},
	];
	it('should display the ComponentDetailEdit component', () => {
		const { container } = render(
			<Provider store={store}>
				<ComponentDetail
					component={{ ...component, labelLg1: undefined }}
					concepts={concepts}
					codesLists={codesLists}
					handleBack={() => {}}
				></ComponentDetail>
			</Provider>
		);
		expect(container.querySelector('input[type="text"]')).not.toBeNull();
	});
	it('should display the ComponentDetailView component', () => {
		const { container } = render(
			<Provider store={store}>
				<ComponentDetail
					secondLang={true}
					component={{ ...component }}
					concepts={concepts}
					codesLists={codesLists}
					handleBack={() => {}}
				></ComponentDetail>
			</Provider>
		);
		expect(container.querySelector('input[type="text"]')).toBeNull();
	});
	it('should display the sub title', () => {
		const { container } = render(
			<Provider store={store}>
				<ComponentDetail
					secondLang={true}
					component={{ ...component }}
					concepts={concepts}
					codesLists={codesLists}
					handleBack={() => {}}
				></ComponentDetail>
			</Provider>
		);
		expect(container.querySelector('h3')).not.toBeNull();
	});
});
