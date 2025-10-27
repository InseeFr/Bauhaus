import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DateRepresentation } from './DateRepresentation';
import type { DateTimeRepresentation } from '../../types/api';

vi.mock('react-i18next', () => ({
	useTranslation: () => ({
		t: (key: string) => {
			const translations: Record<string, string> = {
				'physicalInstance.view.date.type': 'Type de date',
				'physicalInstance.view.date.selectType': 'Sélectionnez un type de date',
			};
			return translations[key] || key;
		},
	}),
}));

vi.mock('primereact/dropdown', () => ({
	Dropdown: ({ id, value, onChange, options, placeholder }: any) => (
		<select
			id={id}
			value={value}
			onChange={(e) => onChange({ value: e.target.value })}
			aria-label={placeholder}
		>
			{options.map((option: any) => (
				<option key={option.value} value={option.value}>
					{option.label}
				</option>
			))}
		</select>
	),
}));

describe('DateRepresentation', () => {
	const mockOnChange = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should render date type dropdown', () => {
		render(
			<DateRepresentation representation={undefined} onChange={mockOnChange} />,
		);

		expect(screen.getByLabelText('Type de date')).toBeInTheDocument();
	});

	it('should display default value "Date" when representation is undefined', () => {
		render(
			<DateRepresentation representation={undefined} onChange={mockOnChange} />,
		);

		const dropdown = screen.getByLabelText(
			'Sélectionnez un type de date',
		) as HTMLSelectElement;
		expect(dropdown.value).toBe('Date');
	});

	it('should display initial value from representation', () => {
		const representation: DateTimeRepresentation = {
			DateTypeCode: 'DateTime',
		};

		render(
			<DateRepresentation
				representation={representation}
				onChange={mockOnChange}
			/>,
		);

		const dropdown = screen.getByLabelText(
			'Sélectionnez un type de date',
		) as HTMLSelectElement;
		expect(dropdown.value).toBe('DateTime');
	});

	it('should render all date type options', () => {
		render(
			<DateRepresentation representation={undefined} onChange={mockOnChange} />,
		);

		const expectedOptions = [
			'DateTime',
			'Date',
			'Time',
			'Year',
			'Month',
			'Day',
			'MonthDay',
			'YearMonth',
			'Duration',
			'Timespan',
		];

		expectedOptions.forEach((option) => {
			expect(screen.getByText(option)).toBeInTheDocument();
		});
	});

	it('should call onChange when date type changes', () => {
		render(
			<DateRepresentation representation={undefined} onChange={mockOnChange} />,
		);

		const dropdown = screen.getByLabelText('Sélectionnez un type de date');
		fireEvent.change(dropdown, { target: { value: 'Year' } });

		expect(mockOnChange).toHaveBeenCalledWith({
			DateTypeCode: 'Year',
		});
	});

	it('should call onChange immediately on mount with default value', () => {
		render(
			<DateRepresentation representation={undefined} onChange={mockOnChange} />,
		);

		expect(mockOnChange).toHaveBeenCalledWith({
			DateTypeCode: 'Date',
		});
	});

	it('should update when representation prop changes', () => {
		const { rerender } = render(
			<DateRepresentation representation={undefined} onChange={mockOnChange} />,
		);

		const newRepresentation: DateTimeRepresentation = {
			DateTypeCode: 'Time',
		};

		rerender(
			<DateRepresentation
				representation={newRepresentation}
				onChange={mockOnChange}
			/>,
		);

		const dropdown = screen.getByLabelText(
			'Sélectionnez un type de date',
		) as HTMLSelectElement;
		expect(dropdown.value).toBe('Time');
	});

	it('should handle change to each date type correctly', () => {
		render(
			<DateRepresentation representation={undefined} onChange={mockOnChange} />,
		);

		const dropdown = screen.getByLabelText('Sélectionnez un type de date');

		const dateTypes = [
			'DateTime',
			'Date',
			'Time',
			'Year',
			'Month',
			'Day',
			'MonthDay',
			'YearMonth',
			'Duration',
			'Timespan',
		];

		dateTypes.forEach((type) => {
			fireEvent.change(dropdown, { target: { value: type } });
			expect(mockOnChange).toHaveBeenCalledWith({
				DateTypeCode: type,
			});
		});
	});
});
