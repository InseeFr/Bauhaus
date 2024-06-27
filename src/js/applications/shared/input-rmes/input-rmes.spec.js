import '@testing-library/jest-dom';
import { render, fireEvent } from '@testing-library/react';
import InputRmes from './';

describe('inputMulti', () => {
	const handleChange = jest.fn();

	it('renders without crashing', () => {
		render(<InputRmes handleChange={handleChange} />);
	});

	it('returns disabled component', () => {
		const { container } = render(
			<InputRmes handleChange={handleChange} disabled />
		);
		expect(container.querySelector('input')).toBeDisabled();
	});

	it('returns enabled component', () => {
		const { container } = render(<InputRmes handleChange={handleChange} />);
		expect(container.querySelector('input')).toBeEnabled();
	});

	it('returns starry component', () => {
		const { container } = render(
			<InputRmes handleChange={handleChange} star />
		);
		expect(container.querySelector('.required-icon').innerHTML).toBe('*');
	});

	it('returns non-starry component', () => {
		const { container } = render(<InputRmes handleChange={handleChange} />);
		expect(container.querySelectorAll('.required-icon')).toHaveLength(0);
	});

	it('should trigger the change event', () => {
		const { container } = render(<InputRmes handleChange={handleChange} />);
		fireEvent.change(container.querySelector('input'), {
			target: {
				value: 'value',
			},
		});
		expect(handleChange).toHaveBeenCalledWith('value');
	});
});
