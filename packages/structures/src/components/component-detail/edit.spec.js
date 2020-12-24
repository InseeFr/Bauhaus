import '@testing-library/jest-dom';
import React from 'react';
import { render, fireEvent, getByText } from '@testing-library/react';

import { ComponentDetailEdit } from './edit';

describe('<ComponentDetailEdit />', () => {
	const component = {
		id: '5e7334002a5c764f68247222',
		identifiant: '5e7334002a5c764f68247222',
		labelLg1: 'veniam non irure',
		labelLg2: 'nisi aliquip',
		type: 'http://purl.org/linked-data/cube#dimension',
		attachment: 'http://purl.org/linked-data/cube#Observation',
		concept: 439,
		isCoded: '<SyntaxError: missing ) after argument list>)',
		codeList: 942,
		range: 'http://www.w3.org/2001/XMLSchema#codeList',
	};
	it('should handleBack when clicking on the back button', () => {
		const handleBack = jest.fn();
		const { container } = render(
			<ComponentDetailEdit
				handleBack={handleBack}
				component={component}
			></ComponentDetailEdit>
		);
		fireEvent.click(getByText(container, 'Cancel'));
		expect(handleBack).toHaveBeenCalled();
	});

	it('should handleSave when clicking on the save button', () => {
		const handleSave = jest.fn();
		const { container } = render(
			<ComponentDetailEdit
				handleBack={() => {}}
				handleSave={handleSave}
				component={component}
			></ComponentDetailEdit>
		);
		fireEvent.change(container.querySelector('#labelLg1'), {
			target: { value: 'a', name: 'labelLg1' },
		});
		fireEvent.click(getByText(container, 'Save'));
		expect(handleSave).toHaveBeenCalledWith({
			...component,
			contributor: "DG75-H250",
			labelLg1: 'a',
		});
	});

	it('should disabled the save button if the component is invalid', () => {
		const handleSave = jest.fn();
		const { container } = render(
			<ComponentDetailEdit
				handleBack={() => {}}
				handleSave={handleSave}
				component={component}
			></ComponentDetailEdit>
		);
		expect(getByText(container, 'Save')).toBeEnabled();
		fireEvent.change(container.querySelector('#labelLg1'), {
			target: { value: '', name: 'labelLg1' },
		});
		expect(getByText(container, 'Save').parentNode).toBeDisabled();
	});

	it('should display the error the save button if the component is invalid', () => {
		const handleSave = jest.fn();
		const { container } = render(
			<ComponentDetailEdit
				handleBack={() => {}}
				handleSave={handleSave}
				component={component}
			></ComponentDetailEdit>
		);
		expect(container.querySelector('.alert-danger')).toBeNull();
		fireEvent.change(container.querySelector('#labelLg1'), {
			target: { value: '', name: 'labelLg1' },
		});
		expect(container.querySelector('.alert-danger')).not.toBeNull();
	});


	it('should display the labelLg2', () => {
		const handleSave = jest.fn();
		const { container } = render(
			<ComponentDetailEdit
				handleBack={() => {}}
				handleSave={handleSave}
				component={component}
				secondLang={true}
			></ComponentDetailEdit>
		);
		let labelLg2 = container.querySelector('#labelLg2');
		expect(labelLg2).not.toBeNull();
		expect(labelLg2.value).toBe(component.labelLg2);
	});
	it('should display the identifiant', () => {
		const handleSave = jest.fn();
		const { container } = render(
			<ComponentDetailEdit
				handleBack={() => {}}
				handleSave={handleSave}
				component={component}
				secondLang={true}
			></ComponentDetailEdit>
		);
		const identifiant = container.querySelector('#identifiant');
		expect(identifiant.value).toEqual(component.identifiant)
		expect(identifiant).not.toBeNull();
	});
});
