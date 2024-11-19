import { render, screen } from '@testing-library/react';
import { DatePicker } from './';

describe('date-picker', () => {
	it('renders without crashing', () => {
		render(<DatePicker value="2024-01-01" onChange={vi.fn()} />);
		const input: HTMLInputElement = screen.getByRole("combobox")
		expect(input.value).toBe('01/01/2024')
	});
});
