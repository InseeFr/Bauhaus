import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import ValidationButton from './';
import { PublishButton } from '@inseefr/wilco';

describe('<ValidationButton', () => {
	it('should contain a disabled button if the object is already validated', () => {
		const { container } = render(
			<ValidationButton
				object={{ validationState: 'Validated' }}
				callback={jest.fn()}
				disabled={false}
			/>
		);
		expect(
			container.querySelector('button').hasAttribute('disabled')
		).toBeTruthy();
	});

	it('should contain a enabled button if the validationStateis not defined', () => {
		const { container } = render(
			<ValidationButton callback={jest.fn()} disabled={false} />
		);
		expect(
			container.querySelector('button').hasAttribute('disabled')
		).toBeFalsy();
	});

	it('should contain a enabled button if the object is already validated', () => {
		const { container } = render(
			<ValidationButton
				object={{ validationState: 'updated' }}
				callback={jest.fn()}
				disabled={false}
			/>
		);
		expect(
			container.querySelector('button').hasAttribute('disabled')
		).toBeFalsy();
	});

	it('should call the callback if we click on the button', () => {
		const callback = jest.fn();
		const object = { validationState: 'updated' };
		const { container } = render(
			<ValidationButton object={object} callback={callback} disabled={false} />
		);
		fireEvent.click(container.querySelector('button'));

		expect(callback).toHaveBeenCalledWith(object);
	});

	it('should be disabled if the property disabled is set to true', () => {
		const callback = jest.fn();
		const object = { validationState: 'updated' };
		const { container } = render(
			<ValidationButton object={object} callback={callback} disabled={true} />
		);
		expect(
			container.querySelector('button').hasAttribute('disabled')
		).toBeTruthy();
	});
});
