import { render, screen, fireEvent } from '@testing-library/react';
import { Mock, vi } from 'vitest';

import { CreatorsInput } from '.';
import { useV2StampsOptions } from '../../../utils/hooks/stamps';

// Mock du hook useV2StampsOptions
vi.mock('../../../utils/hooks/stamps', () => ({
	useV2StampsOptions: vi.fn(),
}));

// Mock du composant Select
vi.mock('../../ui/select', () => ({
	Select: ({ label, onChange }: any) => (
		<div>
			<label>{label}</label>
			<select
				data-testid="select-mock"
				onChange={(e) => onChange(e.target.value)}
			>
				<option value="option1">Option 1</option>
				<option value="option2">Option 2</option>
			</select>
		</div>
	),
}));

describe('CreatorsInput', () => {
	const mockOnChange = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should render with single select and label for single creator', () => {
		(useV2StampsOptions as Mock).mockReturnValue([
			{ value: 'option1', label: 'Option 1' },
		]);

		render(
			<CreatorsInput value="option1" onChange={mockOnChange} multi={false} />,
		);

		screen.getByText(/Propriétaire/i);
		screen.getByTestId('select-mock');
	});

	it('should render with multi select and label for multiple creators', () => {
		(useV2StampsOptions as Mock).mockReturnValue([
			{ value: 'option1', label: 'Option 1' },
			{ value: 'option2', label: 'Option 2' },
		]);

		render(
			<CreatorsInput
				value={['option1', 'option2']}
				onChange={mockOnChange}
				multi={true}
			/>,
		);

		screen.getByText(/Propriétaires/i);
		screen.getByTestId('select-mock');
	});

	it('should call onChange with correct value when single select changes', () => {
		(useV2StampsOptions as Mock).mockReturnValue([
			{ value: 'option1', label: 'Option 1' },
		]);

		render(
			<CreatorsInput value="option1" onChange={mockOnChange} multi={false} />,
		);

		fireEvent.change(screen.getByTestId('select-mock'), {
			target: { value: 'option2' },
		});

		expect(mockOnChange).toHaveBeenCalledWith('option2');
	});
});
