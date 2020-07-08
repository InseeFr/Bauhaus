import '@testing-library/jest-dom';
import React from 'react';
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
		expect(container.querySelector('.boldRed').innerHTML).toBe('*');
	});

	it('returns non-starry component', () => {
		const { container } = render(<InputRmes handleChange={handleChange} />);
		expect(container.querySelectorAll('.boldRed')).toHaveLength(0);
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
