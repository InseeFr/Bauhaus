import '@testing-library/jest-dom';
import { render, fireEvent } from '@testing-library/react';

import { ValidationButton } from './';

describe('<ValidationButton', () => {
	it('should return nothing if the object is already validated', () => {
		const { container } = render(
			<ValidationButton
				object={{ validationState: 'Validated' }}
				callback={vi.fn()}
				disabled={false}
			/>,
		);
		expect(container).toBeEmptyDOMElement();
	});

	it('should contain a enabled button if the validationStateis not defined', () => {
		const { container } = render(
			<ValidationButton object={{}} callback={vi.fn()} disabled={false} />,
		);
		expect(container.querySelector('button')).toBeEnabled();
	});

	it('should contain a enabled button if the object is already validated', () => {
		const { container } = render(
			<ValidationButton
				object={{ validationState: 'updated' }}
				callback={vi.fn()}
				disabled={false}
			/>,
		);
		expect(container.querySelector('button')).toBeEnabled();
	});

	it('should call the callback if we click on the button', () => {
		const callback = vi.fn();
		const object = { validationState: 'updated' };
		const { container } = render(
			<ValidationButton object={object} callback={callback} disabled={false} />,
		);
		fireEvent.click(container.querySelector('button')!);

		expect(callback).toHaveBeenCalledWith(object);
	});

	it('should be disabled if the property disabled is set to true', () => {
		const callback = vi.fn();
		const object = { validationState: 'updated' };
		const { container } = render(
			<ValidationButton object={object} callback={callback} disabled={true} />,
		);
		expect(container.querySelector('button')).toBeDisabled();
	});
});
