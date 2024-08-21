import { render, screen, fireEvent } from '@testing-library/react';
import { CreatorsInput } from '.';
import { useStampsOptions } from '../../utils/hooks/stamps';

// Mock du hook useStampsOptions
jest.mock('../../utils/hooks/stamps', () => ({
	useStampsOptions: jest.fn(),
}));

// Mock du composant Select
jest.mock('../select-rmes', () => ({
	Select: ({ onChange }: any) => (
		<select
			data-testid="select-mock"
			onChange={(e) => onChange(e.target.value)}
		>
			<option value="option1">Option 1</option>
			<option value="option2">Option 2</option>
		</select>
	),
}));

describe('CreatorsInput', () => {
	const mockOnChange = jest.fn();

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should render with single select and label for single creator', () => {
		(useStampsOptions as jest.Mock).mockReturnValue([
			{ value: 'option1', label: 'Option 1' },
		]);

		render(
			<CreatorsInput value="option1" onChange={mockOnChange} multi={false} />
		);

		screen.getByText(/Propriétaire/i);
		screen.getByTestId('select-mock');
	});

	it('should render with multi select and label for multiple creators', () => {
		(useStampsOptions as jest.Mock).mockReturnValue([
			{ value: 'option1', label: 'Option 1' },
			{ value: 'option2', label: 'Option 2' },
		]);

		render(
			<CreatorsInput
				value={['option1', 'option2']}
				onChange={mockOnChange}
				multi={true}
			/>
		);

		screen.getByText(/Propriétaires/i);
		screen.getByTestId('select-mock');
	});

	it('should call onChange with correct value when single select changes', () => {
		(useStampsOptions as jest.Mock).mockReturnValue([
			{ value: 'option1', label: 'Option 1' },
		]);

		render(
			<CreatorsInput value="option1" onChange={mockOnChange} multi={false} />
		);

		fireEvent.change(screen.getByTestId('select-mock'), {
			target: { value: 'option2' },
		});

		expect(mockOnChange).toHaveBeenCalledWith('option2');
	});
});
