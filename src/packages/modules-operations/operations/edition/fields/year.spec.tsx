import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, vi } from 'vitest';

import { YearInput } from './year';

describe('YearInput Component', () => {
	it('renders the label and NumberInput inside a Row', () => {
		const mockOnChange = vi.fn();

		render(<YearInput value="2024" onChange={mockOnChange} />);

		const label = screen.getByText('Year');
		expect(label.getAttribute('for')).toBe('year');

		const numberInput = screen.getByRole('spinbutton') as HTMLInputElement;
		expect(numberInput.getAttribute('id')).toBe('year');
		expect(numberInput.value).toBe('2024');
	});

	it('calls onChange when the NumberInput value changes', async () => {
		const mockOnChange = vi.fn();
		const user = userEvent.setup();

		render(<YearInput value="" onChange={mockOnChange} />);

		const numberInput = screen.getByRole('spinbutton') as HTMLInputElement;

		await user.type(numberInput, '2025');

		expect(mockOnChange).toHaveBeenCalledTimes(4);
	});
});
