import '@testing-library/jest-dom';
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { MutualizedComponentsSelector } from '.';

const mockStore = configureStore([]);
const store = mockStore({});

describe('<MutualizedComponentsSelector />', () => {
	const components = [
		{
			id: '5e7334002a5c764f68247222',
			labelLg1: 'veniam non irure',
			labelLg2: 'nisi aliquip',
			type: 'http://purl.org/linked-data/cube#dimension',
			attachment: 'http://purl.org/linked-data/cube#Observation',
			concept: 439,
			isCoded: '<SyntaxError: missing ) after argument list>)',
			codeList: 942,
			range: 'http://www.w3.org/2001/XMLSchema#codeList',
		},
		{
			id: '5e7334002a5c764f68247222qqq',
			labelLg1: 'veniam non irure',
			labelLg2: 'nisi aliquip',
			type: 'http://purl.org/linked-data/cube#dimension',
			attachment: 'http://purl.org/linked-data/cube#Observation',
			concept: 439,
			isCoded: '<SyntaxError: missing ) after argument list>)',
			codeList: 942,
			range: 'http://www.w3.org/2001/XMLSchema#codeList',
		},
	];

	const concepts = [
		{
			altLabel: '',
			id: components[0].concept.toString(),
			label: 'Concept - Label ' + components[0].concept,
		},
	];
	const codesLists = [
		{
			altLabel: '',
			id: components[0].codeList.toString(),
			label: 'Code List - Label ' + components[0].codeList,
		},
	];

	it('should call handleAdd', () => {
		const handleAdd = jest.fn();

		const { container } = render(
			<Provider store={store}>
				<MutualizedComponentsSelector
					components={components}
					concepts={concepts}
					codesLists={codesLists}
					handleAdd={handleAdd}
				/>
			</Provider>
		);
		fireEvent.click(
			container.querySelector('tbody tr:nth-child(1) button:nth-child(2)')
		);
		expect(handleAdd).toHaveBeenCalled();
	});
	it('should display the view panel', () => {
		const { container } = render(
			<Provider store={store}>
				<MutualizedComponentsSelector
					components={components}
					concepts={concepts}
					codesLists={codesLists}
					handleAdd={() => {}}
				/>
			</Provider>
		);

		fireEvent.click(
			container.querySelector('tbody tr:nth-child(1) button:nth-child(1)')
		);
		expect(
			container.querySelector('.sliding-panel-container.active')
		).not.toBeNull();
	});
});
