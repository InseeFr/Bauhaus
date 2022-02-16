import React from 'react';
import { ComponentSpecificationModalBody } from '.';
import { render, fireEvent } from '@testing-library/react';

describe('<ComponentSpecificationModal />', () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});
	const specification = {
		required: true,
		attachment: ['http://purl.org/linked-data/cube#DataSet'],
	};
	const structureComponents = [];

	it('should call the onClose prop', () => {
		const onClose = jest.fn();
		const { container } = render(
			<ComponentSpecificationModalBody
				specification={specification}
				structureComponents={structureComponents}
				onClose={onClose}
			/>
		);
		fireEvent.click(container.querySelector('.modal-header button'));
		expect(onClose).toHaveBeenCalled();
	});
	it('should call the onSave prop', () => {
		const onSave = jest.fn();
		const { container } = render(
			<ComponentSpecificationModalBody
				specification={specification}
				structureComponents={structureComponents}
				onSave={onSave}
			/>
		);
		fireEvent.click(container.querySelector('.modal-footer button'));
		expect(onSave).toHaveBeenCalled();
	});
	it('should display the component specification', () => {
		const { getAllByText } = render(
			<ComponentSpecificationModalBody
				specification={specification}
				structureComponents={structureComponents}
			/>
		);
		expect(getAllByText('DataSet')).toBeInTheDocument();
	});
});
