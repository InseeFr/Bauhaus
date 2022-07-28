import '@testing-library/jest-dom';
import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import { StructureComponentsSelector } from '.';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

const mockStore = configureStore([]);
const store = mockStore({
	app: {
		secondLang: true,
	},
	disseminationStatus: {
		results: [{}]
	},
	stampList: {
		results: []
	}
});

describe('<StructureComponentsSelector />', () => {
	const components = [
		{
			component: {
				id: '5e7334002a5c764f68247222',
				identifiant: '5e7334002a5c764f68247222',
				labelLg1: 'veniam non irure',
				labelLg2: 'nisi aliquip',
				type: 'http://purl.org/linked-data/cube#dimension',
				attachment: 'http://purl.org/linked-data/cube#Observation',
				concept: 439,
				isCoded: '<SyntaxError: missing ) after argument list>)',
				codeList: 942,
				structures: [],
				range: 'http://www.w3.org/2001/XMLSchema#codeList',
			},
			order: '1',
		},
		{
			component: {
				id: '5e7334002a5c764f68247222qqq',
				identifiant: '5e7334002a5c764f68247222qqq',
				labelLg1: 'veniam non irure 2',
				labelLg2: 'nisi aliquip',
				type: 'http://purl.org/linked-data/cube#dimension',
				attachment: 'http://purl.org/linked-data/cube#Observation',
				concept: 439,
				isCoded: '<SyntaxError: missing ) after argument list>)',
				structures: [],
				range: 'http://www.w3.org/2001/XMLSchema#codeList',
			},
			order: '2',
		},
	];

	const concepts = [
		{
			altLabel: '',
			id: components[0].component.concept?.toString(),
			label: 'Concept - Label ' + components[0].component.concept,
		},
	];
	const codesLists = [
		{
			altLabel: '',
			id: components[0].codeList?.toString(),
			label: 'Code List - Label ' + components[0].component.codeList,
		},
	];

	it('should call handleRemove', () => {
		const handleRemove = jest.fn();
		const handleUp = jest.fn();

		const handleDown = jest.fn();

		const { container } = render(
			<Provider store={store}>
				<StructureComponentsSelector
					componentDefinitions={components}
					concepts={concepts}
					codesLists={codesLists}
					handleRemove={handleRemove}
					handleUp={handleUp}
					handleDown={handleDown}
					handleCodesListDetail={() => {}}
				/>
			</Provider>
		);
		fireEvent.click(
			container.querySelector('tbody tr:nth-child(1) button:nth-child(2)')
		);
		expect(handleRemove).toHaveBeenCalled();
	});
	it('should call handleUp', () => {
		const handleRemove = jest.fn();
		const handleUp = jest.fn();
		const handleDown = jest.fn();

		const { container } = render(
			<Provider store={store}>
				<StructureComponentsSelector
					componentDefinitions={components}
					concepts={concepts}
					codesLists={codesLists}
					handleRemove={handleRemove}
					handleUp={handleUp}
					handleDown={handleDown}
					handleCodesListDetail={() => {}}
				/>
			</Provider>
		);

		fireEvent.click(
			container.querySelector('tbody tr:nth-child(2) button:nth-child(3) span')
		);
		expect(handleUp).toHaveBeenCalled();
	});

	it('should call handleDown', () => {
		const handleRemove = jest.fn();
		const handleUp = jest.fn();
		const handleDown = jest.fn();

		const { container } = render(
			<Provider store={store}>
				<StructureComponentsSelector
					componentDefinitions={components}
					concepts={concepts}
					codesLists={codesLists}
					handleRemove={handleRemove}
					handleUp={handleUp}
					handleDown={handleDown}
					handleCodesListDetail={() => {}}
				/>
			</Provider>
		);
		fireEvent.click(
			container.querySelector('tbody tr:nth-child(1) button:nth-child(3) span')
		);
		expect(handleDown).toHaveBeenCalled();
	});
	it('should not display the creation/update form', () => {
		const { container } = render(
			<Provider store={store}>
				<StructureComponentsSelector
					componentDefinitions={components}
					concepts={concepts}
					codesLists={codesLists}
					handleRemove={() => {}}
					handleUp={() => {}}
					handleDown={() => {}}
					handleCodesListDetail={() => {}}
				/>
			</Provider>
		);

		expect(
			container.querySelector('.sliding-panel-container.active')
		).toBeNull();
	});

	it('should display the creation form', () => {
		const { container } = render(
			<Provider store={store}>
				<StructureComponentsSelector
					componentDefinitions={components}
					concepts={concepts}
					codesLists={codesLists}
					handleRemove={() => {}}
					handleUp={() => {}}
					handleDown={() => {}}
					handleCodesListDetail={() => {}}
					structure={{}}
				/>
			</Provider>
		);

		fireEvent.click(container.querySelector('#add-component'));

		expect(
			container.querySelector('.sliding-panel-container.active')
		).not.toBeNull();
	});
	it('should display the view panel', () => {
		const { container } = render(
			<Provider store={store}>
				<StructureComponentsSelector
					componentDefinitions={components}
					concepts={concepts}
					codesLists={codesLists}
					handleRemove={jest.fn()}
					handleUp={jest.fn()}
					handleDown={jest.fn()}
					handleCodesListDetail={jest.fn()}
				/>
			</Provider>
		);

		fireEvent.click(
			container.querySelector('tbody tr:nth-child(1) button:nth-child(1) span')
		);
		expect(
			container.querySelector('.sliding-panel-container.active')
		).not.toBeNull();
	});
	it('should not display the code list detail button if the code list is undefined', () => {
		const handleRemove = jest.fn();
		const handleUp = jest.fn();
		const handleDown = jest.fn();

		const { container } = render(
			<Provider store={store}>
				<StructureComponentsSelector
					componentDefinitions={components}
					concepts={concepts}
					codesLists={codesLists}
					handleRemove={handleRemove}
					handleUp={handleUp}
					handleDown={handleDown}
					handleCodesListDetail={jest.fn()}
				/>
			</Provider>
		);

		expect(container.querySelector('tbody tr:nth-child(1) button.codes-list-detail')).toBeNull();

	})
	it('should display the code list detail button if the code list is defined', () => {
		const handleRemove = jest.fn();
		const handleUp = jest.fn();
		const handleDown = jest.fn();

		const { container } = render(
			<Provider store={store}>
				<StructureComponentsSelector
					componentDefinitions={components}
					concepts={concepts}
					codesLists={codesLists}
					handleRemove={handleRemove}
					handleUp={handleUp}
					handleDown={handleDown}
					handleCodesListDetail={jest.fn()}
				/>
			</Provider>
		);
		console.log(container.querySelector('tbody tr:nth-child(2)').innerHTML)
		expect(container.querySelector('tbody tr:nth-child(2) button.codes-list-detail')).not.toBeNull();
	})
});
