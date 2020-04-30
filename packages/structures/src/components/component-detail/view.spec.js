import '@testing-library/jest-dom';
import React from 'react';
import {
	render,
	fireEvent,
	getByText,
	queryByText,
} from '@testing-library/react';

import { ComponentDetailView } from './view';

describe('<ComponentDetailView />', () => {
	const component = {
		id: '5e7334002a5c764f68247222',
		identifiant: '5e7334002a5c764f68247222',
		labelLg1: 'veniam non irure',
		labelLg2: 'nisi aliquip',
		type: 'http://purl.org/linked-data/cube#dimension',
		attachment: ['http://purl.org/linked-data/cube#Observation'],
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
	it('should display  the update button if the component is updatable', () => {
		const { container } = render(
			<ComponentDetailView
				component={component}
				concepts={concepts}
				codesLists={codesLists}
				handleBack={() => {}}
				handleUpdate={() => {}}
				updatable={true}
			></ComponentDetailView>
		);

		expect(queryByText(container, 'Update')).toBeNull();
	});
	it('should call handleBack', () => {
		const handleBack = jest.fn();
		const { container } = render(
			<ComponentDetailView
				component={component}
				concepts={concepts}
				codesLists={codesLists}
				handleBack={handleBack}
				handleUpdate={() => {}}
			></ComponentDetailView>
		);
		fireEvent.click(getByText(container, 'Back'));

		expect(handleBack).toHaveBeenCalled();
	});
	it('should call handleUpdate', () => {
		const handleUpdate = jest.fn();

		const { container } = render(
			<ComponentDetailView
				component={component}
				concepts={concepts}
				codesLists={codesLists}
				handleBack={() => {}}
				handleUpdate={handleUpdate}
				updatable={true}
			></ComponentDetailView>
		);

		fireEvent.click(getByText(container, 'Update'));

		expect(handleUpdate).toHaveBeenCalled();
	});
	it('should display the main values', () => {
		const { container } = render(
			<ComponentDetailView
				component={component}
				concepts={concepts}
				codesLists={codesLists}
				handleBack={() => {}}
				handleUpdate={() => {}}
			></ComponentDetailView>
		);

		expect(queryByText(container, component.identifiant)).not.toBeNull();
		expect(queryByText(container, 'Dimension')).not.toBeNull();
		expect(queryByText(container, 'Code list')).not.toBeNull();
	});
	it('should display the attachment if the type is an attribute', () => {
		const { container } = render(
			<ComponentDetailView
				component={{
					...component,
					type: 'http://purl.org/linked-data/cube#attribute',
				}}
				concepts={concepts}
				codesLists={codesLists}
				handleBack={() => {}}
				handleUpdate={() => {}}
			></ComponentDetailView>
		);
		expect(queryByText(container, 'Observation')).not.toBeNull();
	});

	it('should not display the codeList if the range is  not an XSD_CODE_LIST', () => {
		const { container } = render(
			<ComponentDetailView
				component={{ ...component, range: 'fake' }}
				concepts={concepts}
				codesLists={codesLists}
				handleBack={() => {}}
				handleUpdate={() => {}}
			></ComponentDetailView>
		);

		expect(queryByText(container, 'Code List - Label 492')).toBeNull();
	});
});
