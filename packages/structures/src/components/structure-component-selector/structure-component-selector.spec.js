import '@testing-library/jest-dom';
import React from 'react';
import { render, fireEvent, getByText } from '@testing-library/react';

import { StructureComponentsSelector } from '.';
describe('<StructureComponentsSelector />', () => {
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

	const concepts = {
		[components[0].concept]: {
			altLabel: '',
			id: components[0].concept.toString(),
			label: 'Concept - Label ' + components[0].concept,
		},
	};
	const codesLists = {
		[components[0].codeList]: {
			altLabel: '',
			id: components[0].codeList.toString(),
			label: 'Code List - Label ' + components[0].codeList,
		},
	};

	it('should call handleRemove', () => {
		const handleRemove = jest.fn();
		const handleUp = jest.fn();

		const handleDown = jest.fn();

		const { container } = render(
			<StructureComponentsSelector
				components={components}
				concepts={concepts}
				codesLists={codesLists}
				handleRemove={handleRemove}
				handleUp={handleUp}
				handleDown={handleDown}
			/>
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
			<StructureComponentsSelector
				components={components}
				concepts={concepts}
				codesLists={codesLists}
				handleRemove={handleRemove}
				handleUp={handleUp}
				handleDown={handleDown}
			/>
		);
		fireEvent.click(
			container.querySelector('tbody tr:nth-child(2) button:nth-child(3)')
		);
		expect(handleUp).toHaveBeenCalled();
	});

	it('should call handleDown', () => {
		const handleRemove = jest.fn();
		const handleUp = jest.fn();
		const handleDown = jest.fn();

		const { container } = render(
			<StructureComponentsSelector
				components={components}
				concepts={concepts}
				codesLists={codesLists}
				handleRemove={handleRemove}
				handleUp={handleUp}
				handleDown={handleDown}
			/>
		);
		fireEvent.click(
			container.querySelector('tbody tr:nth-child(1) button:nth-child(3)')
		);
		expect(handleDown).toHaveBeenCalled();
	});
	it('should not display the creation/update form', () => {
		const { container } = render(
			<StructureComponentsSelector
				components={components}
				concepts={concepts}
				codesLists={codesLists}
				handleRemove={() => {}}
				handleUp={() => {}}
				handleDown={() => {}}
			/>
		);

		expect(
			container.querySelector('.sliding-panel-container.active')
		).toBeNull();
	});

	it('should display the creation form', () => {
		const { container } = render(
			<StructureComponentsSelector
				components={components}
				concepts={concepts}
				codesLists={codesLists}
				handleRemove={() => {}}
				handleUp={() => {}}
				handleDown={() => {}}
			/>
		);

		fireEvent.click(container.querySelector('#add-component'));

		expect(
			container.querySelector('.sliding-panel-container.active')
		).not.toBeNull();
	});
	it('should display the view panel', () => {
		const { container } = render(
			<StructureComponentsSelector
				components={components}
				concepts={concepts}
				codesLists={codesLists}
				handleRemove={() => {}}
				handleUp={() => {}}
				handleDown={() => {}}
			/>
		);

		fireEvent.click(
			container.querySelector('tbody tr:nth-child(1) button:nth-child(1)')
		);
		expect(
			container.querySelector('.sliding-panel-container.active')
		).not.toBeNull();
	});
});
