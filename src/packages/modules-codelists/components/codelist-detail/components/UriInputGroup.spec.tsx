import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';

import { UriInputGroup } from './UriInputGroup';

describe('UriInputGroup Component', () => {
	const defaultProps = {
		id: 'test-uri',
		name: 'testUri',
		label: 'Test URI Label',
		prefix: 'http://test.example/',
		value: 'segment',
		onChange: vi.fn(),
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('renders with all required props', () => {
		render(<UriInputGroup {...defaultProps} />);

		expect(screen.getByText('Test URI Label')).toBeInTheDocument();
		expect(screen.getByText('http://test.example/')).toBeInTheDocument();
		expect(screen.getByDisplayValue('segment')).toBeInTheDocument();
	});

	it('calls onChange when input value changes', () => {
		const mockOnChange = vi.fn();
		render(<UriInputGroup {...defaultProps} onChange={mockOnChange} />);

		const input = screen.getByDisplayValue('segment');
		fireEvent.change(input, { target: { value: 'new-segment' } });

		expect(mockOnChange).toHaveBeenCalledTimes(1);
		expect(mockOnChange).toHaveBeenCalledWith(expect.any(Object));
	});

	it('renders as disabled when disabled prop is true', () => {
		render(<UriInputGroup {...defaultProps} disabled={true} />);

		const input = screen.getByDisplayValue('segment');
		expect(input).toBeDisabled();
	});

	it('renders as enabled by default', () => {
		render(<UriInputGroup {...defaultProps} />);

		const input = screen.getByDisplayValue('segment');
		expect(input).not.toBeDisabled();
	});

	it('displays error message when error prop is provided', () => {
		const errorMessage = 'This field is required';
		render(<UriInputGroup {...defaultProps} error={errorMessage} />);

		expect(screen.getByText(errorMessage)).toBeInTheDocument();
	});

	it('sets aria-invalid to true when error is present', () => {
		render(<UriInputGroup {...defaultProps} error="Error message" />);

		const input = screen.getByDisplayValue('segment');
		expect(input).toHaveAttribute('aria-invalid', 'true');
		expect(input).toHaveAttribute('aria-describedby', 'test-uri-error');
	});

	it('sets aria-invalid to false when no error', () => {
		render(<UriInputGroup {...defaultProps} />);

		const input = screen.getByDisplayValue('segment');
		expect(input).toHaveAttribute('aria-invalid', 'false');
		expect(input).not.toHaveAttribute('aria-describedby');
	});

	it('renders with empty value', () => {
		render(<UriInputGroup {...defaultProps} value="" />);

		const input = screen.getByRole('textbox');
		expect(input).toHaveValue('');
	});

	it('has correct id and name attributes', () => {
		render(<UriInputGroup {...defaultProps} />);

		const input = screen.getByDisplayValue('segment');
		expect(input).toHaveAttribute('id', 'test-uri');
		expect(input).toHaveAttribute('name', 'testUri');
	});
});